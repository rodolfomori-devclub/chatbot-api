const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

/**
 * OpenAI Service
 * Provides streaming chat completions using OpenAI SDK
 */
class OpenAIService {
  constructor() {
    this.validateConfig();

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: parseInt(process.env.OPENAI_TIMEOUT || "30000", 10),
      maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES || "2", 10),
    });

    this.model = "gpt-4";

    console.log(`OpenAI Service initialized with model: ${this.model}`);
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

  async createStreamingCompletion(messages) {
    try {
      const requestParams = {
        model: this.model,
        messages: messages,
        stream: true,
      };

      // Only add temperature for models that support it (not gpt-5-nano)
      if (!this.model.includes("nano")) {
        requestParams.temperature = 0.7;
        requestParams.max_completion_tokens = 2000;
      }
      console.log("🤖 Creating OpenAI stream...");
      const startTime = Date.now();
      const stream = await this.client.chat.completions.create(requestParams);

      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`🚀 OpenAI stream created in ${duration}ms`);
      return stream;
    } catch (error) {
      console.error("Error creating streaming completion:", error.message);
      throw this.normalizeError(error);
    }
  }

  /**
   * Create a non-streaming chat completion
   * @param {Array} messages - Array of message objects with role and content
   * @returns {Promise<string>} The assistant's response
   */
  async createCompletion(messages) {
    try {
      const requestParams = {
        model: this.model,
        messages: messages,
      };

      // Only add temperature for models that support it (not gpt-5-nano)
      // if (!this.model.includes('nano')) {
      //   requestParams.temperature = 0.7;
      //   requestParams.max_completion_tokens = 2000;
      // }
      // For nano models, don't set max_completion_tokens to avoid length cutoff

      const response = await this.client.chat.completions.create(requestParams);

      return this.extractTextFromMessage(response.choices[0]?.message) || "";
    } catch (error) {
      console.error("Error creating completion:", error.message);
      throw this.normalizeError(error);
    }
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
