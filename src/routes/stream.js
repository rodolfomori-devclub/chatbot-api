const express = require("express");
const openaiService = require("../../services/openaiService");
const { sendI18nError, sendI18nSuccess } = require("../../middleware/i18n");

const router = express.Router();

/** In-memory conversation store — maps conversationId → { messages, language } */
const conversations = {};

const generateConversationId = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

/** Keep conversation history within a manageable window (system + last N turns) */
const pruneHistory = (convo, keepTurns = 8) => {
  if (convo.messages.length > keepTurns + 1) {
    const [system, ...rest] = convo.messages;
    convo.messages = [system, ...rest.slice(-keepTurns)];
  }
};

// ---------------------------------------------------------------------------
// POST /start-conversation
// ---------------------------------------------------------------------------
router.post("/start-conversation", async (req, res) => {
  try {
    const conversationId = generateConversationId();
    const systemPrompt = await req.t.getSystemPrompt();

    conversations[conversationId] = {
      messages: [{ role: "system", content: systemPrompt }],
      language: req.language,
    };

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
    const { message, conversationId = null } = req.body;

    if (!message || !message.trim()) {
      return sendI18nError(
        res,
        req,
        400,
        "errors.invalidMessage",
        "errors.emptyMessage",
      );
    }

    const currentId =
      conversationId && conversations[conversationId]
        ? conversationId
        : generateConversationId();

    if (!conversations[currentId]) {
      const systemPrompt = await req.t.getSystemPrompt();
      conversations[currentId] = {
        messages: [{ role: "system", content: systemPrompt }],
        language: req.language,
      };
    }

    const convo = conversations[currentId];
    convo.messages.push({ role: "user", content: message });

    try {
      const limitedMessages = convo.messages.slice(-5);
      const assistantMessage =
        await openaiService.createCompletion(limitedMessages);

      convo.messages.push({ role: "assistant", content: assistantMessage });
      pruneHistory(convo);

      return sendI18nSuccess(res, req, {
        message: assistantMessage,
        conversationId: currentId,
        provider: "openai",
      });
    } catch (apiErr) {
      console.error("OpenAI error in /chat:", apiErr.message);

      const topic = pickFallbackTopic(message);
      const fallbackMessage = await req.t.getFallbackResponse(topic);
      const signature = await req.t.getSignature();
      const fullFallback = `${fallbackMessage}\n\n${signature}`;

      convo.messages.push({ role: "assistant", content: fullFallback });
      pruneHistory(convo);

      return sendI18nSuccess(res, req, {
        message: fullFallback,
        conversationId: currentId,
        fallback: true,
        provider: "openai",
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
  const { message, conversationId = null } = req.body;

  console.log("📨 Request received:", {
    message: message.substring(0, 50),
    conversationId,
    hasBody: !!req.body,
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
  if (!message || !message.trim()) {
    console.log("❌ Empty message");
    sendEvent({
      type: "error",
      message: "Mensagem vazia",
      code: "EMPTY_MESSAGE",
    });
    endResponse();
    return;
  }

  if (message.length > 4000) {
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
  const currentId =
    conversationId && conversations[conversationId]
      ? conversationId
      : generateConversationId();

  console.log("💬 Using conversation ID:", currentId);

  if (!conversations[currentId]) {
    console.log("🆕 Creating new conversation");
    const systemPrompt = await req.t.getSystemPrompt();
    conversations[currentId] = {
      messages: [{ role: "system", content: systemPrompt }],
      language: req.language,
    };
  }

  if (clientClosed) {
    console.log("⚠️ Client already closed before conversation setup");
    endResponse();
    return;
  }

  const convo = conversations[currentId];
  convo.messages.push({ role: "user", content: message });

  const limitedMessages = convo.messages.slice(-5);
  console.log("📝 Message history length:", limitedMessages.length);

  let assembled = "";
  let usedFallback = false;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const finalize = () => {
    if (clientClosed || responseClosedByServer) {
      console.log("⚠️ Cannot finalize - already closed");
      return;
    }

    console.log("🏁 Finalizing - assembled length:", assembled.length);

    if (assembled.trim().length > 0) {
      convo.messages.push({ role: "assistant", content: assembled });
      pruneHistory(convo);
    }

    if (!completedEventSent) {
      const sent = sendEvent({
        type: "complete",
        conversationId: currentId,
        model: openaiService.getModel(),
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

    console.log("🤖 Creating OpenAI stream...");

    // Cria o stream
    const stream =
      await openaiService.createStreamingCompletion(limitedMessages);

    console.log("✅ Stream created, starting to process...");

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
