const express = require('express');
const axios = require('axios');
const router = express.Router();
const { sendI18nError, sendI18nSuccess } = require('../../middleware/i18n');

// GitHub OAuth settings
const GITHUB_CLIENT_ID = 'Ov23li3INAAPPidJ2X7X';
const GITHUB_CLIENT_SECRET = '87ccb6c27476fbbf92e858c6dca42373db82e256';

// Exchange code for access token
router.post('/exchange-code', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return sendI18nError(res, req, 400, 'errors.missingCode', 'validation.authorizationCodeRequired');
    }
    
    // Exchange the code for an access token
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code
      },
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    // Return the access token to the client
    return sendI18nSuccess(res, req, response.data);
    
  } catch (error) {
    console.error('Error exchanging GitHub code for token:', error);
    return sendI18nError(res, req, 500, 'errors.authenticationError', 'github.authenticationFailed');
  }
});

// Get GitHub file content and analyze it
router.post('/analyze-file', async (req, res) => {
  try {
    const { repo, branch, path, token } = req.body;
    
    if (!repo || !branch || !path || !token) {
      return sendI18nError(res, req, 400, 'errors.missingParameters', 'validation.repoParametersRequired');
    }
    
    // Get the file content from GitHub
    const fileResponse = await axios.get(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    
    // Get the file content
    const fileContent = fileResponse.data;
    
    // Analyze the code using the LLM service
    // Get LLM configuration
    const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const GROQ_MODEL = process.env.GROQ_MODEL || 'llama2-70b-4096';
    
    // Choose the appropriate API key and model based on provider
    const apiKey = LLM_PROVIDER === 'groq' ? GROQ_API_KEY : OPENAI_API_KEY;
    const model = LLM_PROVIDER === 'groq' ? GROQ_MODEL : OPENAI_MODEL;
    
    // Import the code analysis function
    const { analyzeCodeWithLLM } = require('./codeCheck');
    
    // Create a context string with repository info
    const contextPrefix = req.language === 'es' 
      ? `Repositorio: ${repo}\nRama: ${branch}\nArchivo: ${path}\n\n`
      : `Repositório: ${repo}\nBranch: ${branch}\nArquivo: ${path}\n\n`;
    
    const codeWithContext = contextPrefix + fileContent;
    
    // Analyze the code
    const analysis = await analyzeCodeWithLLM(codeWithContext, LLM_PROVIDER, apiKey, model, req.language, req.t);
    
    // Return the analysis
    return sendI18nSuccess(res, req, {
      analysis,
      provider: LLM_PROVIDER,
      file: {
        repo,
        branch,
        path
      }
    }, 'success.fileAnalyzed');
    
  } catch (error) {
    console.error('Error analyzing GitHub file:', error);
    
    // Handle specific GitHub API errors
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return sendI18nError(res, req, 404, 'errors.challengeNotFound', 'github.repositoryAccessFailed');
      } else if (status === 401 || status === 403) {
        return sendI18nError(res, req, status, 'errors.authenticationError', 'github.authenticationFailed');
      }
    }
    
    return sendI18nError(res, req, 500, 'errors.analysisError', 'github.fileAnalysisFailed');
  }
});

module.exports = router; 