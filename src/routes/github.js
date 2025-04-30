const express = require('express');
const axios = require('axios');
const router = express.Router();

// GitHub OAuth settings
const GITHUB_CLIENT_ID = 'Ov23li3INAAPPidJ2X7X';
const GITHUB_CLIENT_SECRET = '87ccb6c27476fbbf92e858c6dca42373db82e256';

// Exchange code for access token
router.post('/exchange-code', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        error: 'Código ausente', 
        message: 'É necessário fornecer um código de autorização do GitHub.' 
      });
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
    res.json(response.data);
    
  } catch (error) {
    console.error('Error exchanging GitHub code for token:', error);
    res.status(500).json({ 
      error: 'Erro de autenticação',
      message: 'Não foi possível completar a autenticação com o GitHub.'
    });
  }
});

// Get GitHub file content and analyze it
router.post('/analyze-file', async (req, res) => {
  try {
    const { repo, branch, path, token } = req.body;
    
    if (!repo || !branch || !path || !token) {
      return res.status(400).json({ 
        error: 'Parâmetros insuficientes', 
        message: 'Repositório, branch, caminho do arquivo e token são obrigatórios.' 
      });
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
    const codeWithContext = `Repositório: ${repo}\nBranch: ${branch}\nArquivo: ${path}\n\n${fileContent}`;
    
    // Analyze the code
    const analysis = await analyzeCodeWithLLM(codeWithContext, LLM_PROVIDER, apiKey, model);
    
    // Return the analysis
    res.json({
      analysis,
      provider: LLM_PROVIDER,
      file: {
        repo,
        branch,
        path
      }
    });
    
  } catch (error) {
    console.error('Error analyzing GitHub file:', error);
    res.status(500).json({ 
      error: 'Erro na análise', 
      message: 'Não foi possível analisar o arquivo do GitHub.' 
    });
  }
});

module.exports = router; 