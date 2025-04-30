const express = require('express');
const router = express.Router();

// Function to call LLM for code analysis
const analyzeCodeWithLLM = async (code, llmProvider, llmApiKey, llmModel) => {
  const axios = require('axios');
  
  // Criar mensagem do sistema para o LLM responder de forma simples e amigável para iniciantes
  const systemMessage = `Você é um assistente de programação prestativo para iniciantes.
  Sua tarefa é analisar código e fornecer feedback em linguagem simples que um iniciante possa entender.
  Evite jargão técnico ou explicações complexas.
  Foque em:
  1. Erros comuns ou bugs no código
  2. Explicações simples do que cada parte do código faz
  3. Sugestões de melhoria em um tom encorajador e de apoio
  4. Exemplos práticos quando relevante
  
  Sempre formate sua resposta com:
  - Uma seção "Resumo" explicando brevemente o que o código faz ou tenta fazer
  - Uma seção "Feedback" com pontos numerados sobre problemas ou melhorias
  - Uma seção "Próximos Passos" com 1-2 ações simples que o usuário pode tomar
  
  Lembre-se que os usuários são completos iniciantes, então use analogias e explicações simples.`;

  // Preparar mensagens para a chamada da API
  const messages = [
    { role: "system", content: systemMessage },
    { role: "user", content: `Por favor, analise este código e forneça feedback amigável para iniciantes:\n\n${code}` }
  ];

  try {
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
    throw new Error('Failed to analyze code. Please try again later.');
  }
};

// Route for analyzing code snippet
router.post('/analyze', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code || code.trim() === '') {
      return res.status(400).json({ 
        error: "Código vazio", 
        message: "Por favor, forneça algum código para análise." 
      });
    }
    
    // Get LLM configuration from the main server
    const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const GROQ_MODEL = process.env.GROQ_MODEL || 'llama2-70b-4096';
    
    // Choose the appropriate API key and model based on provider
    const apiKey = LLM_PROVIDER === 'groq' ? GROQ_API_KEY : OPENAI_API_KEY;
    const model = LLM_PROVIDER === 'groq' ? GROQ_MODEL : OPENAI_MODEL;
    
    // Analyze the code
    const analysis = await analyzeCodeWithLLM(code, LLM_PROVIDER, apiKey, model);
    
    // Return the analysis
    res.json({ 
      analysis,
      provider: LLM_PROVIDER
    });
    
  } catch (error) {
    console.error('Error in code analysis route:', error);
    res.status(500).json({ 
      error: "Erro na análise", 
      message: "Não foi possível analisar o código no momento. Por favor, tente novamente mais tarde." 
    });
  }
});

// Route for analyzing uploaded file
router.post('/analyze-file', async (req, res) => {
  try {
    const { fileContent, fileName } = req.body;
    
    if (!fileContent || fileContent.trim() === '') {
      return res.status(400).json({ 
        error: "Arquivo vazio", 
        message: "O arquivo enviado está vazio ou não pôde ser lido." 
      });
    }
    
    // Get LLM configuration from the main server
    const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const GROQ_MODEL = process.env.GROQ_MODEL || 'llama2-70b-4096';
    
    // Choose the appropriate API key and model based on provider
    const apiKey = LLM_PROVIDER === 'groq' ? GROQ_API_KEY : OPENAI_API_KEY;
    const model = LLM_PROVIDER === 'groq' ? GROQ_MODEL : OPENAI_MODEL;
    
    // Create a message that includes the file name for context
    const codeWithContext = `Arquivo: ${fileName || 'Sem nome'}\n\n${fileContent}`;
    
    // Analyze the code
    const analysis = await analyzeCodeWithLLM(codeWithContext, LLM_PROVIDER, apiKey, model);
    
    // Return the analysis
    res.json({ 
      analysis,
      provider: LLM_PROVIDER
    });
    
  } catch (error) {
    console.error('Error in file analysis route:', error);
    res.status(500).json({ 
      error: "Erro na análise", 
      message: "Não foi possível analisar o arquivo no momento. Por favor, tente novamente mais tarde." 
    });
  }
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