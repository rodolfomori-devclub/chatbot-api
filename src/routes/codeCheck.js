const express = require('express');
const axios = require('axios'); // Garantindo que axios seja importado globalmente
const router = express.Router();

// Definindo a mensagem do sistema globalmente para ser utilizada em todas as rotas
const systemMessage = `Você é um assistente de programação prestativo para iniciantes.
Sua tarefa é analisar código e fornecer feedback em linguagem simples que um iniciante possa entender.
Evite jargão técnico ou explicações complexas.

Você DEVE responder em formato Markdown e seguir EXATAMENTE esta estrutura:

## Resumo
Uma breve explicação do que o código faz ou tenta fazer.

## Problemas Encontrados

Para cada problema que você encontrar, siga este formato EXATO:

### Problema {número}

**Arquivo:** {nome_do_arquivo} (se disponível)

**O que está acontecendo:**
Explicação simples e amigável do problema, em linguagem que um iniciante entenda.

**Trecho com problema:**
\`\`\`{linguagem}
// Copie aqui EXATAMENTE o trecho de código com o problema
\`\`\`

**Correção sugerida:**
\`\`\`{linguagem}
// Copie aqui o mesmo trecho, mas corrigido
\`\`\`

**Por que isto funciona:**
Explicação simples e direta de por que a correção resolve o problema.

## Dicas de Melhoria

Liste 2-3 dicas simples para melhorar o código além das correções acima.

## Próximos Passos

Sugira 1-2 ações práticas e simples que o usuário pode tomar para continuar melhorando.

Lembre-se que os usuários são completos iniciantes, então use analogias e explicações simples.`;

// Function to call LLM for code analysis
const analyzeCodeWithLLM = async (code, llmProvider, llmApiKey, llmModel) => {
  try {
    // Preparar mensagens para a chamada da API
    const messages = [
      { role: "system", content: systemMessage },
      { role: "user", content: `Por favor, analise este código e forneça feedback amigável para iniciantes:\n\n${code}` }
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
    
    // Melhor detalhamento de erros
    if (error.response) {
      // Erro da API
      console.error('API Error:', error.response.status, error.response.data);
      throw new Error(`API Error (${error.response.status}): ${error.response.data.error || 'Unknown API error'}`);
    } else if (error.request) {
      // Erro de rede
      console.error('Network Error:', error.message);
      throw new Error(`Network Error: Unable to reach the LLM service. Please check your connection.`);
    } else {
      // Outros erros
      throw new Error(`Error analyzing code: ${error.message}`);
    }
  }
};

// Função auxiliar para verificar configurações da API
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
      return res.status(400).json({ 
        error: "Código vazio", 
        message: "Por favor, forneça algum código para análise." 
      });
    }
    
    // Verificar configuração da API
    if (!checkApiConfig()) {
      return res.status(500).json({
        error: "Configuração inválida",
        message: "Configuração da API de análise está incompleta. Por favor, contate o suporte."
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
      message: error.message || "Não foi possível analisar o código no momento. Por favor, tente novamente mais tarde." 
    });
  }
});

// Route for analyzing uploaded file
router.post('/analyze-file', async (req, res) => {
  try {
    const { fileContent, fileName, fileType } = req.body;
    
    if (!fileContent || fileContent.trim() === '') {
      return res.status(400).json({ 
        error: "Arquivo vazio", 
        message: "O arquivo enviado está vazio ou não pôde ser lido." 
      });
    }
    
    // Verificar configuração da API
    if (!checkApiConfig()) {
      return res.status(500).json({
        error: "Configuração inválida",
        message: "Configuração da API de análise está incompleta. Por favor, contate o suporte."
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
    
    // Prepare specific content with file info
    const fileExtensionInfo = fileType ? ` (tipo: ${fileType})` : '';
    const codeWithContext = `Arquivo: "${fileName || 'sem_nome'}"${fileExtensionInfo}\n\n${fileContent}`;
    
    // Use the common function to analyze code
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
      message: error.message || "Não foi possível analisar o arquivo no momento. Por favor, tente novamente mais tarde." 
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