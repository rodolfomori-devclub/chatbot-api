const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

/**
 * OpenAI Service
 * Provides streaming chat completions using OpenAI SDK
 */
/**
 * Provider registry. Gemini and Groq both expose OpenAI-compatible endpoints,
 * so the same SDK client works for all three — only baseURL and key change.
 */
const PROVIDER_CONFIG = {
  openai: {
    label: "OpenAI",
    baseURL: undefined, // SDK default
    envKey: "OPENAI_API_KEY",
    envModel: "OPENAI_MODEL",
    defaultModel: "gpt-5.4-mini",
    // Vision is a property of the MODEL, not the provider. Announcing
    // "reads images" while running a text-only model makes every student
    // screenshot fail with an opaque 500.
    visionModels: /^(gpt-4o|gpt-4\.1|gpt-4-turbo|gpt-4-vision|o1|o3|o4|gpt-5)/i,
  },
  gemini: {
    label: "Gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    envKey: "GEMINI_API_KEY",
    envModel: "GEMINI_MODEL",
    defaultModel: "gemini-2.5-flash",
    visionModels: /^gemini-/i,
  },
  groq: {
    label: "Groq",
    baseURL: "https://api.groq.com/openai/v1",
    envKey: "GROQ_API_KEY",
    envModel: "GROQ_MODEL",
    defaultModel: "llama-3.3-70b-versatile",
    visionModels: /(llama-[34].*vision|llava|scout|maverick)/i,
  },
};

class OpenAIService {
  constructor() {
    this.validateConfig();

    const timeout = parseInt(process.env.OPENAI_TIMEOUT || "60000", 10);
    const maxRetries = parseInt(process.env.OPENAI_MAX_RETRIES || "2", 10);

    /** Ordered chain: primary provider first, then configured fallbacks. */
    const primary = process.env.LLM_PROVIDER || "openai";
    const fallbacks = (process.env.LLM_FALLBACK_PROVIDERS || "gemini,groq")
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);

    const seen = new Set();
    this.providers = [primary, ...fallbacks]
      .filter((name) => {
        if (seen.has(name) || !PROVIDER_CONFIG[name]) return false;
        seen.add(name);
        return !!process.env[PROVIDER_CONFIG[name].envKey];
      })
      .map((name) => {
        const cfg = PROVIDER_CONFIG[name];
        const model = process.env[cfg.envModel] || cfg.defaultModel;
        return {
          name,
          label: cfg.label,
          model,
          supportsVision: cfg.visionModels.test(model),
          client: new OpenAI({
            apiKey: process.env[cfg.envKey],
            baseURL: cfg.baseURL,
            timeout,
            maxRetries,
          }),
        };
      });

    if (this.providers.length === 0) {
      throw new Error(
        "No LLM provider configured. Set at least OPENAI_API_KEY.",
      );
    }

    // Kept for backwards compatibility with existing callers
    this.client = this.providers[0].client;
    this.model = this.providers[0].model;

    this.providers.forEach((p, i) => {
      const role = i === 0 ? "primary" : `fallback ${i}`;
      const vision = p.supportsVision ? "reads images" : "text only";
      console.log(`LLM ${role}: ${p.label} (${p.model}) — ${vision}`);
    });
  }

  /**
   * Validate required environment variables
   * @private
   */
  validateConfig() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }

    if (!process.env.OPENAI_API_KEY.startsWith("sk-")) {
      console.warn(
        'Warning: OPENAI_API_KEY does not start with "sk-". This may be an invalid key.',
      );
    }
  }

  /**
   * Providers eligible for this request, in attempt order.
   * @param {Object} options
   * @param {boolean} options.needsVision - Request carries images
   * @returns {Array} Eligible providers
   */
  getProviderChain({ needsVision = false } = {}) {
    return this.providers.filter((p) => !needsVision || p.supportsVision);
  }

  /** True when at least one configured provider can read images. */
  canSeeImages() {
    return this.providers.some((p) => p.supportsVision);
  }

  /** Public snapshot of the chain, for /api/llm-info. */
  describe() {
    return this.providers.map((p) => ({
      provider: p.name,
      model: p.model,
      vision: p.supportsVision,
    }));
  }

  /**
   * Build request params for a provider, omitting tuning knobs that some
   * models reject.
   * @private
   */
  buildParams(provider, messages, extra = {}) {
    const params = { model: provider.model, messages, ...extra };

    if (!provider.model.includes("nano")) {
      params.temperature = 0.7;
      params.max_completion_tokens = 2000;
    }

    return params;
  }

  /**
   * Processa o stream da OpenAI
   * NÃO lança exceção após chamar onError - apenas retorna
   */
  async processStream(stream, { onStart, onContent, onComplete, onError }) {
    let assembledContent = "";
    let isFirstChunk = true;

    try {
      console.log("🔄 Starting stream iteration...");

      for await (const chunk of stream) {
        if (isFirstChunk) {
          isFirstChunk = false;
          console.log("🎬 First chunk received");
          if (onStart) {
            onStart({ model: this.model });
          }
        }

        const deltaText = this.extractTextFromDelta(chunk.choices?.[0]?.delta);

        if (deltaText) {
          console.log("📝 Delta text:", deltaText.substring(0, 20));
          assembledContent += deltaText;

          if (onContent) {
            const shouldContinue = onContent(deltaText);
            if (shouldContinue === false) {
              console.log("⛔ Stream stopped by onContent");
              return assembledContent;
            }
          }
        }

        const finishReason = chunk.choices?.[0]?.finish_reason;
        if (finishReason) {
          console.log("🏁 Stream finished with reason:", finishReason);
          break;
        }
      }

      console.log(
        "✅ Stream iteration complete, total:",
        assembledContent.length,
        "chars",
      );

      if (assembledContent.length === 0) {
        const emptyError = new Error("Empty response from OpenAI");
        console.error("❌ Empty response from OpenAI");

        if (onError) {
          onError(this.normalizeError(emptyError));
        }

        return assembledContent;
      }

      if (onComplete) {
        console.log("🎉 Calling onComplete");
        await onComplete();
      }

      return assembledContent;
    } catch (error) {
      console.error("💥 Error processing stream:", error.message);

      if (onError) {
        onError(this.normalizeError(error));
      }

      return assembledContent;
    }
  }

  /**
   * Open a streaming completion, walking the provider chain until one answers.
   * @param {Array} messages
   * @param {Object} options
   * @param {boolean} options.needsVision - Request carries images
   * @returns {Promise<{stream: Object, provider: Object}>}
   */
  async createStreamingCompletion(messages, { needsVision = false } = {}) {
    const chain = this.getProviderChain({ needsVision });

    if (chain.length === 0) {
      const err = new Error("No provider available for this request");
      err.code = needsVision ? "NO_VISION_PROVIDER" : "NO_PROVIDER";
      throw err;
    }

    let lastError;

    for (const provider of chain) {
      try {
        console.log(`🤖 Creating stream via ${provider.label} (${provider.model})...`);
        const startTime = Date.now();

        const stream = await provider.client.chat.completions.create(
          this.buildParams(provider, messages, { stream: true }),
        );

        console.log(`🚀 Stream created in ${Date.now() - startTime}ms`);
        return { stream, provider };
      } catch (error) {
        lastError = this.normalizeError(error);
        console.error(
          `${provider.label} failed:`,
          error.status || "",
          error.message,
        );
      }
    }

    throw lastError;
  }

  /**
   * Create a non-streaming chat completion
   * @param {Array} messages - Array of message objects with role and content
   * @returns {Promise<string>} The assistant's response
   */
  async createCompletion(messages, { needsVision = false } = {}) {
    const chain = this.getProviderChain({ needsVision });

    if (chain.length === 0) {
      const err = new Error("No provider available for this request");
      err.code = needsVision ? "NO_VISION_PROVIDER" : "NO_PROVIDER";
      throw err;
    }

    let lastError;

    for (const provider of chain) {
      try {
        const response = await provider.client.chat.completions.create(
          this.buildParams(provider, messages),
        );

        const content =
          this.extractTextFromMessage(response.choices[0]?.message) || "";
        if (!content) throw new Error("Empty response");

        return { content, provider };
      } catch (error) {
        lastError = this.normalizeError(error);
        console.error(
          `${provider.label} failed:`,
          error.status || "",
          error.message,
        );
      }
    }

    throw lastError;
  }

  /**
   * Normalize OpenAI API errors into a consistent format
   * @private
   * @param {Error} error - Original error from OpenAI
   * @returns {Error} Normalized error
   */
  normalizeError(error) {
    if (error.status === 429) {
      const retryError = new Error(
        "Rate limit exceeded. Please try again in a moment.",
      );
      retryError.code = "RATE_LIMIT";
      retryError.status = 429;
      return retryError;
    }

    if (error.status === 401) {
      const authError = new Error("Invalid API key configuration.");
      authError.code = "AUTH_ERROR";
      authError.status = 401;
      return authError;
    }

    if (error.status >= 500) {
      const serverError = new Error("OpenAI service temporarily unavailable.");
      serverError.code = "SERVER_ERROR";
      serverError.status = error.status;
      return serverError;
    }

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      const timeoutError = new Error("Request timeout. Please try again.");
      timeoutError.code = "TIMEOUT";
      return timeoutError;
    }

    return error;
  }

  /**
   * Extract normalized text from OpenAI message payload.
   * Supports both legacy string content and newer array-based content blocks.
   * @private
   * @param {Object} message
   * @returns {string}
   */
  extractTextFromMessage(message) {
    if (!message) return "";
    const { content } = message;
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content
        .map((part) => {
          if (typeof part === "string") return part;
          if (typeof part?.text === "string") return part.text;
          if (typeof part?.content === "string") return part.content;
          return "";
        })
        .join("");
    }
    return "";
  }

  /**
   * Extract normalized text from streamed delta payload.
   * Handles string deltas and array/object deltas used by newer models.
   * @private
   * @param {Object} delta
   * @returns {string}
   */
  extractTextFromDelta(delta) {
    if (!delta) return "";
    if (typeof delta.content === "string") return delta.content;
    if (Array.isArray(delta.content)) {
      return delta.content
        .map((part) => {
          if (typeof part === "string") return part;
          if (typeof part?.text === "string") return part.text;
          if (typeof part?.content === "string") return part.content;
          return "";
        })
        .join("");
    }
    if (typeof delta.text === "string") return delta.text;
    return "";
  }

  /**
   * Get current model name
   * @returns {string} Model name
   */
  getModel() {
    return this.model;
  }

  /**
   * Health check - verifies API key is valid
   * @returns {Promise<boolean>} True if healthy
   */
  async healthCheck() {
    try {
      await this.client.models.list();
      return true;
    } catch (error) {
      console.error("OpenAI health check failed:", error.message);
      return false;
    }
  }
}

// Export singleton instance
module.exports = new OpenAIService();
