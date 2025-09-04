const express = require('express');
const axios = require('axios'); // Garantindo que axios seja importado globalmente
const router = express.Router();
const { sendI18nError, sendI18nSuccess } = require('../../middleware/i18n');

// Function to call LLM for code analysis with i18n support
const analyzeCodeWithLLM = async (code, llmProvider, llmApiKey, llmModel, language, t) => {
  try {
    // Get localized system message and instruction
    const systemMessage = await t.getCodeAnalysisPrompt();
    const instruction = await t.getCodeAnalysisInstruction();
    
    // Prepare messages for the API call
    const messages = [
      { role: "system", content: systemMessage },
      { role: "user", content: instruction + code }
    ];

    let response;
    
    // Call appropriate API based on provider
    if (llmProvider === 'groq') {
      response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: llmModel,
          messages: messages,
          temperature: 0.5, // More focused responses
          max_tokens: 1000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${llmApiKey}`
          },
          timeout: 30000 // 30 seconds
        }
      );
      
      return response.data.choices[0].message.content;
    } else {
      // Default to OpenAI
      response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: llmModel,
          messages: messages,
          temperature: 0.5, // More focused responses
          max_tokens: 1000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${llmApiKey}`
          },
          timeout: 30000 // 30 seconds
        }
      );
      
      return response.data.choices[0].message.content;
    }
  } catch (error) {
    console.error('Error analyzing code with LLM:', error);
    
    // Better error handling with i18n
    if (error.response) {
      // API Error
      console.error('API Error:', error.response.status, error.response.data);
      const errorMsg = await t.getMessage('errors.apiError', 'API Error');
      throw new Error(`${errorMsg} (${error.response.status}): ${error.response.data.error || 'Unknown API error'}`);
    } else if (error.request) {
      // Network Error
      console.error('Network Error:', error.message);
      const errorMsg = await t.getMessage('errors.networkError', 'Network Error');
      throw new Error(`${errorMsg}: Unable to reach the LLM service. Please check your connection.`);
    } else {
      // Other errors
      const errorMsg = await t.getMessage('errors.analysisError', 'Error analyzing code');
      throw new Error(`${errorMsg}: ${error.message}`);
    }
  }
};

// Helper function to check API configuration
const checkApiConfig = () => {
  const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';
  const apiKey = LLM_PROVIDER === 'groq' 
    ? process.env.GROQ_API_KEY 
    : process.env.OPENAI_API_KEY;
    
  if (!apiKey) {
    console.error(`Missing API key for provider: ${LLM_PROVIDER}`);
    return false;
  }
  
  return true;
};

// Route for analyzing code snippet
router.post('/analyze', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code || code.trim() === '') {
      return sendI18nError(res, req, 400, 'errors.codeEmpty', 'validation.provideCode');
    }
    
    // Check API configuration
    if (!checkApiConfig()) {
      return sendI18nError(res, req, 500, 'errors.configurationError', 'validation.apiConfigIncomplete');
    }
    
    // Get LLM configuration from the main server
    const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5o-nano';
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const GROQ_MODEL = process.env.GROQ_MODEL || 'llama2-70b-4096';
    
    // Choose the appropriate API key and model based on provider
    const apiKey = LLM_PROVIDER === 'groq' ? GROQ_API_KEY : OPENAI_API_KEY;
    const model = LLM_PROVIDER === 'groq' ? GROQ_MODEL : OPENAI_MODEL;
    
    // Analyze the code
    const analysis = await analyzeCodeWithLLM(code, LLM_PROVIDER, apiKey, model, req.language, req.t);
    
    // Return the analysis
    return sendI18nSuccess(res, req, { 
      analysis,
      provider: LLM_PROVIDER
    }, 'success.codeAnalyzed');
    
  } catch (error) {
    console.error('Error in code analysis route:', error);
    return sendI18nError(res, req, 500, 'errors.analysisError', null, {
      message: error.message || await req.t.getMessage('validation.provideCode', 'Could not analyze the code at the moment. Please try again later.')
    });
  }
});

// Route for analyzing uploaded file
router.post('/analyze-file', async (req, res) => {
  try {
    const { fileContent, fileName, fileType } = req.body;
    
    if (!fileContent || fileContent.trim() === '') {
      return sendI18nError(res, req, 400, 'errors.fileEmpty', 'validation.provideValidFile');
    }
    
    // Check API configuration
    if (!checkApiConfig()) {
      return sendI18nError(res, req, 500, 'errors.configurationError', 'validation.apiConfigIncomplete');
    }
    
    // Get LLM configuration
    const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5o-nano';
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const GROQ_MODEL = process.env.GROQ_MODEL || 'llama2-70b-4096';
    
    // Choose the appropriate API key and model based on provider
    const apiKey = LLM_PROVIDER === 'groq' ? GROQ_API_KEY : OPENAI_API_KEY;
    const model = LLM_PROVIDER === 'groq' ? GROQ_MODEL : OPENAI_MODEL;
    
    // Create enhanced context for file analysis
    const fileContext = fileName 
      ? `File: ${fileName}${fileType ? ` (${fileType})` : ''}\n\n${fileContent}`
      : fileContent;
    
    // Analyze the code
    const analysis = await analyzeCodeWithLLM(fileContext, LLM_PROVIDER, apiKey, model, req.language, req.t);
    
    // Return the analysis
    return sendI18nSuccess(res, req, {
      analysis,
      provider: LLM_PROVIDER,
      file: {
        name: fileName,
        type: fileType
      }
    }, 'success.fileAnalyzed');
    
  } catch (error) {
    console.error('Error in file analysis route:', error);
    return sendI18nError(res, req, 500, 'errors.analysisError', null, {
      message: error.message || await req.t.getMessage('validation.provideValidFile', 'Could not analyze the file at the moment. Please try again later.')
    });
  }
});

// Route for getting supported languages
router.get('/languages', (req, res) => {
  const i18nService = require('../../services/i18nService');
  
  res.json({
    supportedLanguages: i18nService.getSupportedLanguages(),
    defaultLanguage: 'pt',
    currentLanguage: req.language,
    cacheStats: i18nService.getCacheStats()
  });
});

// This route is a placeholder for future GitHub integration
router.post('/analyze-github', (req, res) => {
  // This is just a placeholder - will be implemented later
  res.status(501).json({ 
    message: "Análise de repositórios GitHub ainda não está implementada." 
  });
});

module.exports = {
  router,
  analyzeCodeWithLLM
}; 