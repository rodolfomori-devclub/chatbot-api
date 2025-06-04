const i18nService = require('../services/i18nService');

/**
 * Language Detection Utilities
 */

/**
 * Detect language from request headers
 * Priority: x-language header > Accept-Language header > default language
 * @param {Object} req - Express request object
 * @returns {string} Detected language code
 */
const detectLanguage = (req) => {
  const supportedLanguages = i18nService.getSupportedLanguages();
  const defaultLanguage = 'pt';

  // 1. Check custom header first (for explicit control)
  const customLang = req.headers['x-language'];
  if (customLang && supportedLanguages.includes(customLang)) {
    return customLang;
  }

  // 2. Parse Accept-Language header (standard HTTP header)
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage) {
    // Parse Accept-Language header format: "en-US,en;q=0.9,es;q=0.8"
    const preferredLanguages = acceptLanguage
      .split(',')
      .map(lang => {
        const [code, qValue] = lang.trim().split(';q=');
        return {
          code: code.split('-')[0].toLowerCase(), // Extract base language code
          quality: qValue ? parseFloat(qValue) : 1.0
        };
      })
      .sort((a, b) => b.quality - a.quality); // Sort by quality score

    // Find first supported language
    for (const lang of preferredLanguages) {
      if (supportedLanguages.includes(lang.code)) {
        return lang.code;
      }
    }
  }

  // 3. Default fallback
  return defaultLanguage;
};

/**
 * i18n Middleware
 * Detects language and injects translation utilities into request object
 */
const i18nMiddleware = async (req, res, next) => {
  try {
    // Detect language from request
    const language = detectLanguage(req);
    
    // Add language to request object
    req.language = language;
    req.isDefaultLanguage = language === 'pt';
    
    // Add translation utilities to request
    req.t = {
      // Get message by key path
      getMessage: async (keyPath, defaultValue = '') => {
        return i18nService.getMessage(language, keyPath, defaultValue);
      },
      
      // Get system prompts
      getSystemPrompt: async () => {
        return i18nService.getSystemPrompt(language);
      },
      
      getCodeAnalysisPrompt: async () => {
        return i18nService.getCodeAnalysisPrompt(language);
      },
      
      getCodeAnalysisInstruction: async () => {
        return i18nService.getCodeAnalysisInstruction(language);
      },
      
      getSignature: async () => {
        return i18nService.getSignature(language);
      },
      
      // Get motivational text
      getRandomMotivationalText: async () => {
        return i18nService.getRandomMotivationalText(language);
      },
      
      // Get fallback responses
      getFallbackResponse: async (topic = 'apiConnectionError') => {
        return i18nService.getFallbackResponse(language, topic);
      },
      
      // Direct access to all translations
      getAll: async () => {
        return i18nService.getTranslations(language);
      }
    };

    // Add language metadata to response headers for client reference
    res.set('Content-Language', language);
    res.set('X-Supported-Languages', i18nService.getSupportedLanguages().join(','));

    next();
  } catch (error) {
    console.error('i18n middleware error:', error);
    
    // Fallback setup for error cases
    req.language = 'pt';
    req.isDefaultLanguage = true;
    req.t = {
      getMessage: async (keyPath, defaultValue = '') => defaultValue,
      getSystemPrompt: async () => 'System prompt not available',
      getCodeAnalysisPrompt: async () => 'Code analysis prompt not available',
      getCodeAnalysisInstruction: async () => 'Please analyze this code:\n\n',
      getSignature: async () => 'Giovanna 👩‍💻',
      getRandomMotivationalText: async () => 'Keep learning and coding!',
      getFallbackResponse: async () => 'Service temporarily unavailable.',
      getAll: async () => ({})
    };
    
    next();
  }
};

/**
 * Language validation middleware
 * Validates language parameter in routes that accept it
 */
const validateLanguageParam = (req, res, next) => {
  const { language } = req.params;
  
  if (language && !i18nService.isLanguageSupported(language)) {
    return res.status(400).json({
      error: 'Unsupported language',
      message: `Language '${language}' is not supported. Supported languages: ${i18nService.getSupportedLanguages().join(', ')}`,
      supportedLanguages: i18nService.getSupportedLanguages()
    });
  }
  
  next();
};

/**
 * Error response helper with i18n support
 * @param {Object} res - Express response object
 * @param {Object} req - Express request object (for language)
 * @param {number} statusCode - HTTP status code
 * @param {string} errorKey - Translation key for error message
 * @param {string} detailsKey - Translation key for error details (optional)
 * @param {*} additionalData - Additional data to include in response
 */
const sendI18nError = async (res, req, statusCode, errorKey, detailsKey = null, additionalData = {}) => {
  try {
    const errorMessage = await req.t.getMessage(errorKey, 'An error occurred');
    const errorDetails = detailsKey ? await req.t.getMessage(detailsKey, '') : null;
    
    const response = {
      error: errorMessage,
      language: req.language,
      ...additionalData
    };
    
    if (errorDetails) {
      response.details = errorDetails;
    }
    
    res.status(statusCode).json(response);
  } catch (error) {
    console.error('Error in sendI18nError:', error);
    res.status(statusCode).json({
      error: 'An error occurred',
      language: req.language || 'pt'
    });
  }
};

/**
 * Success response helper with i18n support
 * @param {Object} res - Express response object
 * @param {Object} req - Express request object (for language)
 * @param {*} data - Response data
 * @param {string} messageKey - Translation key for success message (optional)
 */
const sendI18nSuccess = async (res, req, data, messageKey = null) => {
  try {
    const response = {
      ...data,
      language: req.language
    };
    
    if (messageKey) {
      const message = await req.t.getMessage(messageKey, 'Success');
      response.message = message;
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error in sendI18nSuccess:', error);
    res.json({
      ...data,
      language: req.language || 'pt'
    });
  }
};

module.exports = {
  i18nMiddleware,
  detectLanguage,
  validateLanguageParam,
  sendI18nError,
  sendI18nSuccess
}; 