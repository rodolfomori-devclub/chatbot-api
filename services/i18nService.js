const fs = require('fs').promises;
const path = require('path');

/**
 * Internationalization Service
 * Provides efficient translation management with caching and lazy loading
 */
class I18nService {
  constructor() {
    this.translations = new Map();
    this.challenges = new Map(); // Cache for challenges by language
    this.localesPath = path.join(__dirname, '../locales');
    this.supportedLanguages = ['pt', 'es'];
    this.defaultLanguage = 'pt';
    this.loadingPromises = new Map(); // Prevent concurrent loading of same language
    this.challengeLoadingPromises = new Map(); // Prevent concurrent loading of challenges
  }

  /**
   * Load translations for a specific language with caching
   * @param {string} language - Language code (pt, es)
   * @returns {Promise<Object>} Translation object
   */
  async loadTranslations(language) {
    // Return cached translations if available
    if (this.translations.has(language)) {
      return this.translations.get(language);
    }

    // Check if already loading this language to prevent concurrent loads
    if (this.loadingPromises.has(language)) {
      return this.loadingPromises.get(language);
    }

    // Create loading promise
    const loadingPromise = this._loadTranslationsFromFiles(language);
    this.loadingPromises.set(language, loadingPromise);

    try {
      const translations = await loadingPromise;
      this.translations.set(language, translations);
      return translations;
    } catch (error) {
      console.error(`Error loading translations for ${language}:`, error);
      
      // Fallback to default language if current language fails and it's not the default
      if (language !== this.defaultLanguage) {
        console.log(`Falling back to ${this.defaultLanguage} for language ${language}`);
        return this.loadTranslations(this.defaultLanguage);
      }
      
      throw error;
    } finally {
      // Clean up loading promise
      this.loadingPromises.delete(language);
    }
  }

  /**
   * Internal method to load translations from files
   * @private
   * @param {string} language - Language code
   * @returns {Promise<Object>} Translation object
   */
  async _loadTranslationsFromFiles(language) {
    const langPath = path.join(this.localesPath, language);
    
    // Load all translation files in parallel for better performance
    const [system, messages, motivational] = await Promise.all([
      this.loadJsonFile(path.join(langPath, 'system.json')),
      this.loadJsonFile(path.join(langPath, 'messages.json')),
      this.loadJsonFile(path.join(langPath, 'motivational.json'))
    ]);

    return {
      system,
      messages,
      motivational
    };
  }

  /**
   * Load and parse a JSON file
   * @private
   * @param {string} filePath - Path to JSON file
   * @returns {Promise<Object>} Parsed JSON object
   */
  async loadJsonFile(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading file ${filePath}:`, error);
      throw new Error(`Failed to load translation file: ${filePath}`);
    }
  }

  /**
   * Get all translations for a language
   * @param {string} language - Language code
   * @returns {Promise<Object>} Translation object
   */
  async getTranslations(language) {
    const validLanguage = this.validateLanguage(language);
    return this.loadTranslations(validLanguage);
  }

  /**
   * Get system prompt for chatbot
   * @param {string} language - Language code
   * @returns {Promise<string>} System prompt
   */
  async getSystemPrompt(language) {
    const translations = await this.loadTranslations(language);
    return translations.system.chatbotPrompt;
  }

  /**
   * Get code analysis prompt
   * @param {string} language - Language code
   * @returns {Promise<string>} Code analysis prompt
   */
  async getCodeAnalysisPrompt(language) {
    const translations = await this.loadTranslations(language);
    return translations.system.codeAnalysisPrompt;
  }

  /**
   * Get code analysis instruction
   * @param {string} language - Language code
   * @returns {Promise<string>} Code analysis instruction
   */
  async getCodeAnalysisInstruction(language) {
    const translations = await this.loadTranslations(language);
    return translations.system.codeAnalysisInstruction;
  }

  /**
   * Get signature for responses
   * @param {string} language - Language code
   * @returns {Promise<string>} Signature
   */
  async getSignature(language) {
    const translations = await this.loadTranslations(language);
    return translations.system.signature;
  }

  /**
   * Get a random motivational text
   * @param {string} language - Language code
   * @returns {Promise<string>} Random motivational text
   */
  async getRandomMotivationalText(language) {
    const translations = await this.loadTranslations(language);
    const texts = translations.motivational.texts;
    const randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex];
  }

  /**
   * Get translated message by key path
   * @param {string} language - Language code
   * @param {string} keyPath - Dot notation key path (e.g., 'errors.invalidMessage')
   * @param {string} defaultValue - Default value if key not found
   * @returns {Promise<string>} Translated message
   */
  async getMessage(language, keyPath, defaultValue = '') {
    try {
      const translations = await this.loadTranslations(language);
      const keys = keyPath.split('.');
      let value = translations.messages;
      
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          console.warn(`Translation key '${keyPath}' not found for language '${language}'`);
          return defaultValue;
        }
      }
      
      return value || defaultValue;
    } catch (error) {
      console.error(`Error getting message for key '${keyPath}':`, error);
      return defaultValue;
    }
  }

  /**
   * Get fallback response for API errors
   * @param {string} language - Language code
   * @param {string} topic - Topic for fallback (html, css, javascript)
   * @returns {Promise<string>} Fallback message
   */
  async getFallbackResponse(language, topic = 'apiConnectionError') {
    const translations = await this.loadTranslations(language);
    return translations.messages.fallback[topic] || translations.messages.fallback.apiConnectionError;
  }

  /**
   * Validate and normalize language code
   * @private
   * @param {string} language - Language code to validate
   * @returns {string} Valid language code
   */
  validateLanguage(language) {
    if (!language || !this.supportedLanguages.includes(language)) {
      return this.defaultLanguage;
    }
    return language;
  }

  /**
   * Get list of supported languages
   * @returns {Array<string>} Array of supported language codes
   */
  getSupportedLanguages() {
    return [...this.supportedLanguages];
  }

  /**
   * Check if a language is supported
   * @param {string} language - Language code to check
   * @returns {boolean} True if supported
   */
  isLanguageSupported(language) {
    return this.supportedLanguages.includes(language);
  }

  /**
   * Clear cache for a specific language or all languages
   * @param {string} [language] - Language to clear, or undefined for all
   */
  clearCache(language = null) {
    if (language) {
      this.translations.delete(language);
      this.challenges.delete(language);
      this.loadingPromises.delete(language);
      this.challengeLoadingPromises.delete(language);
      console.log(`Cache cleared for language: ${language}`);
    } else {
      this.translations.clear();
      this.challenges.clear();
      this.loadingPromises.clear();
      this.challengeLoadingPromises.clear();
      console.log('All translation and challenge cache cleared');
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return {
      cachedLanguages: Array.from(this.translations.keys()),
      cachedChallenges: Array.from(this.challenges.keys()),
      loadingLanguages: Array.from(this.loadingPromises.keys()),
      loadingChallenges: Array.from(this.challengeLoadingPromises.keys()),
      supportedLanguages: this.supportedLanguages,
      defaultLanguage: this.defaultLanguage,
      challengesCounts: Object.fromEntries(
        Array.from(this.challenges.entries()).map(([lang, challenges]) => [lang, challenges.length])
      )
    };
  }

  /**
   * Preload translations for all supported languages
   * Useful for warming up the cache on server start
   * @returns {Promise<void>}
   */
  async preloadAllTranslations() {
    console.log('Preloading translations for all supported languages...');
    
    const loadPromises = this.supportedLanguages.map(lang => 
      this.loadTranslations(lang).catch(error => 
        console.error(`Failed to preload language ${lang}:`, error)
      )
    );
    
    await Promise.allSettled(loadPromises);
    console.log(`Preloading complete. Cached languages: ${Array.from(this.translations.keys()).join(', ')}`);
  }
}

// Export singleton instance
module.exports = new I18nService(); 