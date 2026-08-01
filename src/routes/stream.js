const express = require("express");
const crypto = require("crypto");
const openaiService = require("../../services/openaiService");
const { sendI18nError, sendI18nSuccess } = require("../../middleware/i18n");

const router = express.Router();

/** In-memory conversation store — maps conversationId → { messages, language } */
const conversations = {};

const HISTORY_TURNS = Number(process.env.HISTORY_TURNS || 8);
const CONVERSA_TTL_MS = Number(process.env.CONVERSA_TTL_MIN || 30) * 60 * 1000;
const MAX_CONVERSAS = Number(process.env.MAX_CONVERSAS || 5000);

/** The conversationId is the only thing guarding a conversation's history,
 *  which can now hold student screenshots — Math.random() is predictable. */
const generateConversationId = () => crypto.randomBytes(24).toString("hex");

/** Keep conversation history within a manageable window (system + last N turns) */
const pruneHistory = (convo, keepTurns = HISTORY_TURNS) => {
  if (convo.messages.length > keepTurns + 1) {
    const [system, ...rest] = convo.messages;
    convo.messages = [system, ...rest.slice(-keepTurns)];
  }
};

/** Messages actually sent to the LLM.
 *  The previous `convo.messages.slice(-5)` took the last 5 entries of the whole
 *  array — index 0 is the system prompt, so past 5 messages Giovanna silently
 *  lost her persona mid-conversation. The system prompt is now always kept and
 *  never counted against the window. */
const buildMessagesForApi = (convo) => {
  const [system, ...history] = convo.messages;
  return [system, ...history.slice(-HISTORY_TURNS)];
};

/** Replace image payloads with a short marker once the turn is done.
 *  An image only needs to reach the model on the turn it was sent; keeping the
 *  base64 around re-uploads hundreds of KB (and ~1.100 vision tokens) on every
 *  later turn and pins the memory until the conversation expires. */
const dropImagesFromHistory = (convo) => {
  convo.messages = convo.messages.map((msg) => {
    if (!Array.isArray(msg.content)) return msg;

    const texts = msg.content
      .filter((p) => p.type === "text")
      .map((p) => p.text);
    const imageCount = msg.content.filter((p) => p.type === "image_url").length;
    if (imageCount === 0) return { ...msg, content: texts.join("\n") };

    const marker =
      imageCount === 1
        ? "[o aluno enviou uma imagem nesta mensagem]"
        : `[o aluno enviou ${imageCount} imagens nesta mensagem]`;

    return { ...msg, content: [...texts, marker].filter(Boolean).join("\n") };
  });
};

/** Close out a turn: release image payloads, trim, stamp activity. */
const finishTurn = (convo) => {
  dropImagesFromHistory(convo);
  pruneHistory(convo);
  convo.lastActivity = Date.now();
};

/** The store lives in the process heap. During a live class with thousands of
 *  students it only ever grew — with screenshots in there, that is an OOM that
 *  takes the whole class's chat down. */
const purgeConversations = () => {
  const now = Date.now();
  let removed = 0;

  for (const [id, convo] of Object.entries(conversations)) {
    if (now - (convo.lastActivity || 0) > CONVERSA_TTL_MS) {
      delete conversations[id];
      removed++;
    }
  }

  const ids = Object.keys(conversations);
  if (ids.length > MAX_CONVERSAS) {
    ids
      .sort(
        (a, b) =>
          (conversations[a].lastActivity || 0) -
          (conversations[b].lastActivity || 0),
      )
      .slice(0, ids.length - MAX_CONVERSAS)
      .forEach((id) => {
        delete conversations[id];
        removed++;
      });
  }

  if (removed > 0) {
    console.log(
      `🧹 Purged ${removed} conversations, ${Object.keys(conversations).length} active`,
    );
  }
};

const purgeTimer = setInterval(purgeConversations, 5 * 60 * 1000);
purgeTimer.unref?.();

/** Images arrive as data URLs. The browser-side resize is cosmetic — anyone can
 *  call this API directly — so format and size are validated here. */
const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;
const IMAGE_DATA_URL = /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/;

const normalizeImages = (images) => {
  if (!images) return [];
  const list = Array.isArray(images) ? images : [images];

  return list
    .filter((url) => {
      if (typeof url !== "string" || !IMAGE_DATA_URL.test(url)) return false;
      const bytes = (url.length - url.indexOf(",") - 1) * 0.75;
      if (bytes > MAX_IMAGE_BYTES) {
        console.warn(`Image rejected: ${Math.round(bytes / 1024)}KB over limit`);
        return false;
      }
      return true;
    })
    .slice(0, MAX_IMAGES);
};

const buildUserContent = (text, images) => {
  if (images.length === 0) return text;

  return [
    { type: "text", text: text || "Olha essa imagem, por favor." },
    ...images.map((url) => ({ type: "image_url", image_url: { url } })),
  ];
};

/** System prompt = base persona + the specialist block (html/css/javascript). */
const buildSystemMessage = async (req, specialist) => {
  const base = await req.t.getSystemPrompt();
  const extra = await req.t.getSpecialistPrompt(specialist);
  return { role: "system", content: extra ? `${base}\n\n${extra}` : base };
};

/** Create the conversation, or refresh its system prompt when the student
 *  switched specialist mid-session. */
const ensureConversation = async (req, conversationId, specialist) => {
  const id =
    conversationId && conversations[conversationId]
      ? conversationId
      : generateConversationId();

  if (!conversations[id]) {
    conversations[id] = {
      messages: [await buildSystemMessage(req, specialist)],
      language: req.language,
      specialist: specialist || "geral",
    };
  } else if (specialist && conversations[id].specialist !== specialist) {
    conversations[id].messages[0] = await buildSystemMessage(req, specialist);
    conversations[id].specialist = specialist;
  }

  conversations[id].lastActivity = Date.now();
  return id;
};

/** Shown when the student sends an image but no configured model can read one.
 *  Better an honest limitation than "the AI is offline" — it is not. */
const noVisionReply = async (req) =>
  "Consigo te ajudar por texto, mas nesse momento não estou conseguindo abrir imagens. " +
  "Cola aqui o seu código ou me descreve o que está aparecendo na tela que eu te ajudo do mesmo jeito." +
  "\n\n" +
  (await req.t.getSignature());

// ---------------------------------------------------------------------------
// POST /start-conversation
// ---------------------------------------------------------------------------
router.post("/start-conversation", async (req, res) => {
  try {
    const { specialist = null } = req.body || {};
    const conversationId = await ensureConversation(req, null, specialist);

    return sendI18nSuccess(res, req, { conversationId });
  } catch (err) {
    console.error("Error starting conversation:", err);
    return sendI18nError(res, req, 500, "errors.serverError");
  }
});

// ---------------------------------------------------------------------------
// POST /chat  (non-streaming fallback)
// ---------------------------------------------------------------------------
router.post("/chat", async (req, res) => {
  try {
    const {
      message,
      conversationId = null,
      specialist = null,
      images = null,
    } = req.body;
    const attachedImages = normalizeImages(images);

    if ((!message || !message.trim()) && attachedImages.length === 0) {
      return sendI18nError(
        res,
        req,
        400,
        "errors.invalidMessage",
        "errors.emptyMessage",
      );
    }

    const currentId = await ensureConversation(req, conversationId, specialist);
    const convo = conversations[currentId];

    const needsVision = attachedImages.length > 0;

    // Image sent but nothing in the chain can read it — say so plainly.
    if (needsVision && openaiService.getProviderChain({ needsVision }).length === 0) {
      const reply = await noVisionReply(req);
      convo.messages.push({ role: "user", content: message || "[imagem]" });
      convo.messages.push({ role: "assistant", content: reply });
      finishTurn(convo);

      return sendI18nSuccess(res, req, {
        message: reply,
        conversationId: currentId,
        provider: "sem-visao",
        noVision: true,
      });
    }

    convo.messages.push({
      role: "user",
      content: buildUserContent(message, attachedImages),
    });

    try {
      const limitedMessages = buildMessagesForApi(convo);
      const { content: assistantMessage, provider } =
        await openaiService.createCompletion(limitedMessages, { needsVision });

      convo.messages.push({ role: "assistant", content: assistantMessage });
      finishTurn(convo);

      return sendI18nSuccess(res, req, {
        message: assistantMessage,
        conversationId: currentId,
        provider: provider.name,
        model: provider.model,
      });
    } catch (apiErr) {
      console.error("All providers failed in /chat:", apiErr.message);

      const topic = pickFallbackTopic(message);
      const fallbackMessage = await req.t.getFallbackResponse(topic);
      const signature = await req.t.getSignature();
      const fullFallback = `${fallbackMessage}\n\n${signature}`;

      convo.messages.push({ role: "assistant", content: fullFallback });
      finishTurn(convo);

      return sendI18nSuccess(res, req, {
        message: fullFallback,
        conversationId: currentId,
        fallback: true,
        provider: "offline",
      });
    }
  } catch (err) {
    console.error("Error in /chat:", err);
    return sendI18nError(res, req, 500, "errors.serverError");
  }
});

// ---------------------------------------------------------------------------
// POST /chat/stream  (SSE streaming)
// ---------------------------------------------------------------------------
router.post("/chat/stream", async (req, res) => {
  const {
    message,
    conversationId = null,
    specialist = null,
    images = null,
  } = req.body;
  const attachedImages = normalizeImages(images);

  console.log("📨 Request received:", {
    message: (message || "").substring(0, 50),
    conversationId,
    specialist,
    images: attachedImages.length,
  });

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  if (res.flushHeaders) {
    res.flushHeaders();
    console.log("✓ Headers flushed");
  }

  let clientClosed = false;
  let responseClosedByServer = false;
  let completedEventSent = false;

  // IMPORTANT: for POST + SSE, req "close" can fire after request body is read
  // and does NOT necessarily mean the response stream is disconnected.
  req.on("aborted", () => {
    if (!responseClosedByServer) {
      clientClosed = true;
      console.log("❌ Request aborted by client");
    }
  });

  res.on("close", () => {
    if (!responseClosedByServer) {
      clientClosed = true;
      console.log("❌ Response stream closed by client");
    }
  });

  const sendEvent = (payload) => {
    if (clientClosed || res.writableEnded || res.destroyed) {
      console.log("⚠️ Cannot send event - connection closed");
      return false;
    }

    try {
      const data = `data: ${JSON.stringify(payload)}\n\n`;
      res.write(data);
      console.log(
        "📤 Event sent:",
        payload.type,
        payload.delta?.substring(0, 20) || "",
      );
      return true;
    } catch (error) {
      console.error("❌ Error writing to response:", error.message);
      clientClosed = true;
      return false;
    }
  };

  const endResponse = () => {
    if (!responseClosedByServer && !res.writableEnded && !res.destroyed) {
      responseClosedByServer = true;
      res.end();
      console.log("🏁 Response ended by server");
    }
  };

  // ── Input validation ───────────────────────────────────────────────────────
  if ((!message || !message.trim()) && attachedImages.length === 0) {
    console.log("❌ Empty message");
    sendEvent({
      type: "error",
      message: "Mensagem vazia",
      code: "EMPTY_MESSAGE",
    });
    endResponse();
    return;
  }

  if (message && message.length > 4000) {
    console.log("❌ Message too long:", message.length);
    sendEvent({
      type: "error",
      message: "Mensagem muito longa. Máximo 4000 caracteres.",
      code: "MESSAGE_TOO_LONG",
    });
    endResponse();
    return;
  }

  // ── Conversation setup ─────────────────────────────────────────────────────
  const currentId = await ensureConversation(req, conversationId, specialist);
  console.log("💬 Using conversation ID:", currentId);

  if (clientClosed) {
    console.log("⚠️ Client already closed before conversation setup");
    endResponse();
    return;
  }

  const convo = conversations[currentId];
  const needsVision = attachedImages.length > 0;

  // Image sent but no configured model can read it — be honest instead of
  // claiming the AI is down.
  if (needsVision && openaiService.getProviderChain({ needsVision }).length === 0) {
    console.log("🖼️ Image received but no vision-capable provider configured");
    const reply = await noVisionReply(req);

    convo.messages.push({ role: "user", content: message || "[imagem]" });
    convo.messages.push({ role: "assistant", content: reply });
    finishTurn(convo);

    sendEvent({ type: "start", conversationId: currentId, model: null });
    sendEvent({ type: "content", delta: reply });
    sendEvent({
      type: "complete",
      conversationId: currentId,
      model: null,
      fallback: false,
      noVision: true,
    });
    endResponse();
    return;
  }

  convo.messages.push({
    role: "user",
    content: buildUserContent(message, attachedImages),
  });

  const limitedMessages = buildMessagesForApi(convo);
  console.log("📝 Message history length:", limitedMessages.length);

  let assembled = "";
  let usedFallback = false;
  let activeProvider = null;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const finalize = () => {
    if (clientClosed || responseClosedByServer) {
      console.log("⚠️ Cannot finalize - already closed");
      return;
    }

    console.log("🏁 Finalizing - assembled length:", assembled.length);

    if (assembled.trim().length > 0) {
      convo.messages.push({ role: "assistant", content: assembled });
    }
    finishTurn(convo);

    if (!completedEventSent) {
      const sent = sendEvent({
        type: "complete",
        conversationId: currentId,
        provider: usedFallback ? "offline" : activeProvider?.name,
        model: usedFallback ? null : activeProvider?.model,
        fallback: usedFallback,
      });
      completedEventSent = sent;
    }

    endResponse();
  };

  const handleFallback = async (apiErr) => {
    if (clientClosed || responseClosedByServer) {
      console.log("⚠️ Cannot handle fallback - already closed");
      return;
    }

    console.error(
      "🆘 Activating fallback due to error:",
      apiErr?.message ?? apiErr,
    );

    try {
      const topic = pickFallbackTopic(message);
      const fallbackMessage = await req.t.getFallbackResponse(topic);
      const signature = await req.t.getSignature();

      const fallbackContent = `${fallbackMessage}\n\n${signature}`;

      assembled = fallbackContent;
      usedFallback = true;

      const sent = sendEvent({ type: "content", delta: fallbackContent });
      if (!sent) return;
      finalize();
    } catch (fallbackError) {
      console.error("❌ Error in fallback:", fallbackError);

      assembled = "Desculpe, ocorreu um erro ao processar sua mensagem.";
      usedFallback = true;

      const sent = sendEvent({ type: "content", delta: assembled });
      if (!sent) return;
      finalize();
    }
  };

  // ── Stream ─────────────────────────────────────────────────────────────────
  try {
    // Envia evento de início
    if (
      !sendEvent({
        type: "start",
        conversationId: currentId,
        model: openaiService.getModel(),
      })
    ) {
      console.log("❌ Failed to send start event");
      return;
    }

    if (clientClosed || res.writableEnded || res.destroyed) {
      console.log("⚠️ Connection closed after start event");
      endResponse();
      return;
    }

    // Walks the provider chain (OpenAI → Gemini → Groq) until one answers
    const { stream, provider } = await openaiService.createStreamingCompletion(
      limitedMessages,
      { needsVision },
    );
    activeProvider = provider;

    console.log(`✅ Stream created via ${provider.label}, processing...`);

    if (clientClosed || res.writableEnded || res.destroyed) {
      console.log("⚠️ Connection closed before processing stream");
      endResponse();
      return;
    }

    // Processa o stream
    await openaiService.processStream(stream, {
      onStart: ({ model }) => {
        console.log("🚀 Stream started with model:", model);
      },

      onContent: (delta) => {
        if (clientClosed || res.writableEnded || res.destroyed) {
          console.log("⚠️ Connection closed during content streaming");
          return false;
        }

        assembled += delta;

        const sent = sendEvent({ type: "content", delta });

        if (!sent) {
          console.log("❌ Failed to send content delta");
          return false;
        }

        return true;
      },

      onComplete: async () => {
        if (
          clientClosed ||
          responseClosedByServer ||
          res.writableEnded ||
          res.destroyed
        ) {
          console.log("⚠️ Connection closed during complete callback");
          return;
        }

        console.log(
          "✅ Stream completed successfully, assembled:",
          assembled.length,
          "chars",
        );
        finalize();
      },

      onError: async (err) => {
        if (
          clientClosed ||
          responseClosedByServer ||
          res.writableEnded ||
          res.destroyed
        ) {
          console.log("⚠️ Connection closed during error callback");
          return;
        }

        console.error("❌ Stream error:", err);
        console.log("📊 Assembled so far:", assembled.length, "chars");

        if (assembled.trim().length > 0) {
          console.log("ℹ️ Have partial content, finalizing normally");
          finalize();
        } else {
          console.log("ℹ️ No content, using fallback");
          await handleFallback(err);
        }
      },
    });

    console.log("🏁 processStream finished");
  } catch (err) {
    console.error("💥 Error creating/processing stream:", err);

    if (
      !clientClosed &&
      !responseClosedByServer &&
      !res.writableEnded &&
      !res.destroyed
    ) {
      await handleFallback(err);
    }
  }
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function pickFallbackTopic(message) {
  const lower = message.toLowerCase();
  if (lower.includes("html")) return "html";
  if (lower.includes("css")) return "css";
  if (
    lower.includes("javascript") ||
    lower.includes(" js ") ||
    lower.endsWith(" js")
  )
    return "javascript";
  return "apiConnectionError";
}

module.exports = router;
