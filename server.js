const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configurações de API
const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama2-70b-4096';

// Middleware de CORS
app.use(cors({
  origin: '*', // Aceita qualquer origem durante desenvolvimento
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Sistema para armazenar conversas em memória
const conversations = {};

// Caminho para o arquivo de desafios pré-gerados
const CHALLENGES_FILE = path.join(__dirname, 'challenges.json');

// Motivational texts array - textos motivacionais para exibir quando o usuário completa desafios
const motivationalTexts = [
  "Incrível progresso! Você está dominando os conceitos fundamentais de programação. Continue assim!",
  "Cada desafio que você completa é um passo em direção ao seu objetivo como programador. Não desista!",
  "Você está construindo sua base de conhecimento a cada desafio. O caminho para se tornar programador é exatamente assim!",
  "Seu empenho está dando resultados! Lembre-se que todo programador experiente já esteve onde você está agora.",
  "Persistência é a chave para o sucesso na programação. E você está demonstrando isso!",
  "Você já aprendeu tanto! Imagine onde estará daqui a alguns meses se continuar nesse ritmo.",
  "Ótimo trabalho! Sua jornada na programação está apenas começando, e você já está brilhando!",
  "A persistência é o que transforma a dificuldade em conquista. Continue programando!",
  "Cada linha de código que você escreve, cada problema que resolve, está construindo seu futuro como programador.",
  "Dez desafios completos! Você está desenvolvendo o mindset de um programador de verdade.",
  "Sua dedicação está rendendo frutos! Continue aprendendo, continue codando.",
  "Os melhores programadores são aqueles que não desistem quando encontram dificuldades. Você está no caminho certo!",
  "Parabéns pelo seu progresso! Lembre-se: a programação é uma maratona, não uma corrida de velocidade.",
  "Você está cultivando uma habilidade que mudará seu futuro. Continue avançando!",
  "Com cada desafio, você expande sua mente e se aproxima de se tornar o programador que deseja ser.",
  "Sensacional! Você está demonstrando as qualidades essenciais de um programador: persistência e vontade de aprender.",
  "Continue resolvendo problemas, um após o outro. É assim que se constrói uma carreira em programação!",
  "Sua jornada de aprendizado está progredindo maravilhosamente! Não se esqueça de olhar para trás e ver o quanto já avançou.",
  "Você está construindo sua confiança a cada desafio. Esta é uma habilidade tão importante quanto o conhecimento técnico!",
  "Cada desafio completado é uma vitória. Continue somando estas vitórias em sua jornada como programador!",
  "A programação é feita de pequenas vitórias diárias. Você está acumulando muitas delas!",
  "Sua determinação é inspiradora! Continue praticando, e você verá como a programação se tornará natural.",
  "O segredo do sucesso em programação é a prática constante. Você está no caminho certo!",
  "Dez novos desafios concluídos! Seu cérebro está formando novas conexões a cada problema que você resolve.",
  "Seu progresso é a prova de que você tem o que é preciso para se tornar um programador de sucesso.",
  "A jornada do programador é feita de desafios. E você está mostrando que sabe como superá-los!",
  "Continue codando, continue aprendendo. Seu futuro como programador está sendo construído agora!",
  "Está vendo como você consegue? Esse é o poder da persistência que todo bom programador precisa ter.",
  "Mais dez desafios conquistados! Você está desenvolvendo um superpoder: resolver problemas com código!",
  "Você está transformando dificuldades em conhecimento. Esta é a essência da programação!"
];

// Função para carregar os desafios pré-gerados
let allChallenges = [];

const loadChallenges = async () => {
  try {
    const data = await fs.readFile(CHALLENGES_FILE, 'utf8');
    allChallenges = JSON.parse(data);
    console.log(`Carregados ${allChallenges.length} desafios pré-gerados.`);
    console.log(`- HTML: ${allChallenges.filter(c => c.topic === 'html').length} desafios`);
    console.log(`- CSS: ${allChallenges.filter(c => c.topic === 'css').length} desafios`);
    console.log(`- JavaScript: ${allChallenges.filter(c => c.topic === 'javascript').length} desafios`);
  } catch (error) {
    console.error('Erro ao carregar desafios:', error);
    // Fallback para os desafios base caso não consiga carregar o arquivo
    allChallenges = predefinedChallenges;
  }
};

// Carregar desafios ao iniciar o servidor
loadChallenges();

// Desafios predefinidos (fallback)
const predefinedChallenges = [
  {
    id: '1',
    topic: 'html',
    title: 'Primeira Tag HTML',
    description: 'Qual tag HTML é usada para criar um título de primeiro nível?',
    type: 'multipleChoice',
    options: [
      { id: 'a', text: '<h1>' },
      { id: 'b', text: '<title>' },
      { id: 'c', text: '<header>' },
      { id: 'd', text: '<main>' }
    ],
    correctAnswer: 'a',
    successFeedback: 'Correto! A tag <h1> é usada para criar o título principal de uma página. É importante ter apenas um h1 por página para manter uma boa estrutura.',
    failureFeedback: 'Não é essa. A tag para criar um título de primeiro nível é a <h1>. É o título mais importante da página.',
    explanation: 'A tag <h1> define o título principal e é importante para SEO e acessibilidade.'
  },
  {
    id: '2',
    topic: 'css',
    title: 'Seletores CSS',
    description: 'Qual seletor CSS é usado para selecionar elementos com uma classe específica?',
    type: 'multipleChoice',
    options: [
      { id: 'a', text: '#nome' },
      { id: 'b', text: '.nome' },
      { id: 'c', text: '$nome' },
      { id: 'd', text: '*nome' }
    ],
    correctAnswer: 'b',
    successFeedback: 'Exatamente! O ponto (.) é usado para selecionar elementos por classe em CSS.',
    failureFeedback: 'Não é esse. Para selecionar elementos por classe no CSS, usamos o ponto (.) seguido do nome da classe.',
    explanation: 'Em CSS, usamos # para IDs, . para classes, e nada para elementos/tags.'
  },
  // Outros desafios predefinidos...
];

// Função para gerar ID de conversa
const generateConversationId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Função para gerar ID de desafio
const generateChallengeId = () => {
  return 'c-' + Math.random().toString(36).substring(2, 10);
};

// Função para obter um texto motivacional aleatório
const getRandomMotivationalText = () => {
  const randomIndex = Math.floor(Math.random() * motivationalTexts.length);
  return motivationalTexts[randomIndex];
};

// Função para fazer chamada de API ao LLM selecionado
const callLLMApi = async (messages, model) => {
  if (LLM_PROVIDER === 'groq') {
    return callGroqApi(messages, model);
  } else {
    // Default para OpenAI
    return callOpenAIApi(messages, model);
  }
};

// Função para chamar a API da OpenAI
const callOpenAIApi = async (messages, model = OPENAI_MODEL) => {
  console.log("Enviando requisição para API OpenAI...");
  
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      timeout: 30000 // 30 segundos
    }
  );
  
  console.log("Resposta recebida da API OpenAI");
  return response.data.choices[0].message.content;
};

// Função para chamar a API da Groq
const callGroqApi = async (messages, model = GROQ_MODEL) => {
  console.log("Enviando requisição para API Groq...");
  
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      timeout: 30000 // 30 segundos
    }
  );
  
  console.log("Resposta recebida da API Groq");
  return response.data.choices[0].message.content;
};

// Rota para iniciar uma nova conversa
app.post('/api/start-conversation', (req, res) => {
  const conversationId = generateConversationId();
  conversations[conversationId] = {
    messages: [
      { 
        role: "system", 
        content: `Você é a Giovanna, uma assistente educacional especializada em programação que ajuda iniciantes. 
        
        Você está ajudando alunos da "Missão Programação do Zero", pessoas que estão fazendo transição de carreira e sabem pouco ou quase nada de programação.
        
        Suas características principais:
        1. Use linguagem simples e evite jargões técnicos
        2. Explique conceitos com analogias do dia a dia
        3. Forneça exemplos práticos e concretos
        4. Explique código linha por linha quando necessário
        5. Incentive boas práticas de programação
        6. Seja paciente e encorajadora 
        7. Use um tom amigável e acessível
        8. Quando mostrar código, adicione comentários explicativos
        9. Foque em HTML, CSS e JavaScript básico
        
        Assinatura: Sempre termine suas mensagens assinando como "Giovanna 👩‍💻"`
      }
    ]
  };
  res.json({ conversationId });
});

// Rota para chat - versão simples sem streaming
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationId = null } = req.body;
    
    // Verificação básica da mensagem
    if (!message) {
      return res.status(400).json({ error: "Mensagem inválida", details: "A mensagem não pode ser vazia" });
    }
    
    // Criar ou recuperar conversa
    const currentConversationId = conversationId && conversations[conversationId] 
      ? conversationId 
      : generateConversationId();
    
    if (!conversations[currentConversationId]) {
      conversations[currentConversationId] = {
        messages: [
          { 
            role: "system", 
            content: `Você é a Giovanna, uma assistente educacional especializada em programação que ajuda iniciantes. 
            Você está ajudando alunos da "Missão Programação do Zero". Use linguagem simples, evite jargões, forneça exemplos práticos, 
            seja encorajadora e sempre termine suas mensagens assinando como "Giovanna 👩‍💻"`
          }
        ]
      };
    }
    
    // Adicionar mensagem do usuário ao histórico
    conversations[currentConversationId].messages.push({ role: "user", content: message });
    
    // Fazer a chamada para a API LLM selecionada
    try {
      console.log(`Usando provedor de LLM: ${LLM_PROVIDER}`);
      
      // Limitar o histórico enviado para a API para economizar tokens
      const limitedMessages = conversations[currentConversationId].messages.slice(-5);
      
      // Chamar a API do LLM selecionado
      const assistantMessage = await callLLMApi(limitedMessages);
      
      // Adicionar resposta ao histórico
      conversations[currentConversationId].messages.push({
        role: 'assistant',
        content: assistantMessage
      });
      
      // Limitar o histórico para economizar tokens
      if (conversations[currentConversationId].messages.length > 10) {
        const systemMessage = conversations[currentConversationId].messages[0];
        conversations[currentConversationId].messages = [
          systemMessage,
          ...conversations[currentConversationId].messages.slice(-8)
        ];
      }
      
      // Enviar resposta para o cliente
      return res.json({
        message: assistantMessage,
        conversationId: currentConversationId,
        provider: LLM_PROVIDER // Enviar o provedor usado para referência
      });
      
    } catch (apiError) {
      console.error(`Erro na chamada à API ${LLM_PROVIDER}:`, apiError.message);
      
      if (apiError.response) {
        console.error("Status:", apiError.response.status);
        console.error("Dados:", apiError.response.data);
      }
      
      // Respostas de fallback para casos comuns quando a API falha
      const fallbackResponses = {
        html: "HTML (HyperText Markup Language) é a linguagem padrão para criar páginas web. Ela usa tags como `<div>`, `<p>`, `<h1>` para estruturar o conteúdo.\n\nGiovanna 👩‍💻",
        css: "CSS (Cascading Style Sheets) é a linguagem que usamos para estilizar páginas HTML. Ela controla cores, layouts, fontes e outros aspectos visuais.\n\nGiovanna 👩‍💻",
        javascript: "JavaScript é uma linguagem de programação que permite adicionar interatividade às páginas web. Com ela, você pode responder a cliques, validar formulários e muito mais.\n\nGiovanna 👩‍💻",
        default: "Desculpe, estou tendo dificuldades para me conectar aos servidores. Por favor, tente novamente em alguns instantes.\n\nGiovanna 👩‍💻"
      };
      
      // Determinar resposta de fallback com base na mensagem
      let fallbackMessage = fallbackResponses.default;
      const messageLower = message.toLowerCase();
      
      if (messageLower.includes('html')) {
        fallbackMessage = fallbackResponses.html;
      } else if (messageLower.includes('css')) {
        fallbackMessage = fallbackResponses.css;
      } else if (messageLower.includes('javascript') || messageLower.includes('js')) {
        fallbackMessage = fallbackResponses.javascript;
      }
      
      // Adicionar resposta de fallback ao histórico
      conversations[currentConversationId].messages.push({
        role: 'assistant',
        content: fallbackMessage
      });
      
      // Enviar resposta de fallback para o cliente
      return res.json({
        message: fallbackMessage,
        conversationId: currentConversationId,
        fallback: true,
        provider: LLM_PROVIDER
      });
    }
    
  } catch (error) {
    console.error('Erro geral na API de chat:', error);
    res.status(500).json({ 
      error: "Erro interno do servidor", 
      details: process.env.NODE_ENV === 'development' ? error.message : null 
    });
  }
});

// Rota para obter desafios
app.get('/api/challenges', (req, res) => {
  const { topic, level } = req.query;
  
  let filteredChallenges = [...allChallenges];
  
  // Filtrar por tópico se fornecido
  if (topic && topic !== 'all') {
    filteredChallenges = filteredChallenges.filter(challenge => challenge.topic === topic);
  }
  
  // Filtrar por nível se fornecido
  if (level) {
    filteredChallenges = filteredChallenges.filter(challenge => challenge.level === level);
  }
  
  // Limitar a quantidade de desafios retornados para evitar sobrecarga
  if (filteredChallenges.length > 50) {
    // Embaralhar os desafios para sempre obter um conjunto diferente
    const shuffled = [...filteredChallenges].sort(() => 0.5 - Math.random());
    filteredChallenges = shuffled.slice(0, 50);
  }
  
  res.json(filteredChallenges);
});

// Rota para obter um desafio específico
app.get('/api/challenge/:id', (req, res) => {
  const { id } = req.params;
  
  // Encontrar o desafio pelo ID
  const challenge = allChallenges.find(c => c.id === id);
  
  if (!challenge) {
    return res.status(404).json({ error: "Desafio não encontrado" });
  }
  
  res.json(challenge);
});

// Rota para obter um desafio aleatório
app.get('/api/random-challenge', (req, res) => {
  const { topic, type } = req.query;
  
  let filteredChallenges = [...allChallenges];
  
  // Filtrar por tópico se fornecido
  if (topic && topic !== 'all') {
    filteredChallenges = filteredChallenges.filter(challenge => challenge.topic === topic);
  }
  
  // Filtrar por tipo se fornecido
  if (type) {
    filteredChallenges = filteredChallenges.filter(challenge => challenge.type === type);
  }
  
  if (filteredChallenges.length === 0) {
    return res.status(404).json({ error: "Nenhum desafio encontrado com os critérios fornecidos" });
  }
  
  // Selecionar um desafio aleatório
  const randomIndex = Math.floor(Math.random() * filteredChallenges.length);
  const randomChallenge = filteredChallenges[randomIndex];
  
  res.json(randomChallenge);
});

// Rota para verificar resposta de desafio
app.post('/api/check-challenge', (req, res) => {
  try {
    const { challengeId, userAnswer } = req.body;
    
    // Encontra o desafio pelo ID
    const challenge = allChallenges.find(c => c.id === challengeId);
    
    if (!challenge) {
      return res.status(404).json({ error: "Desafio não encontrado" });
    }
    
    // Se for questão de múltipla escolha
    if (challenge.type === 'multipleChoice') {
      const isCorrect = userAnswer === challenge.correctAnswer;
      
      return res.json({
        isCorrect,
        feedback: isCorrect ? challenge.successFeedback : challenge.failureFeedback,
        motivationalText: isCorrect ? getRandomMotivationalText() : null
      });
    }
    
    // Se for questão de código
    if (challenge.type === 'codeCompletion') {
      // Verificação simplificada - apenas verifica se contém partes da solução esperada
      const expectedSolutionClean = challenge.expectedSolution.replace(/\s+/g, '').toLowerCase();
      const userAnswerClean = userAnswer.replace(/\s+/g, '').toLowerCase();
      
      // Se a resposta contiver os elementos chave da solução
      const isCorrect = userAnswerClean.includes(expectedSolutionClean.substring(0, Math.min(expectedSolutionClean.length, 50)));
      
      return res.json({
        isCorrect,
        feedback: isCorrect ? challenge.successFeedback : 
          `Sua resposta não está correta. Tente novamente! Dica: ${challenge.hints?.[0] || 'Reveja o enunciado com atenção.'}`,
        motivationalText: isCorrect ? getRandomMotivationalText() : null
      });
    }
    
    return res.status(400).json({ error: "Tipo de desafio não suportado" });
    
  } catch (error) {
    console.error('Erro ao verificar resposta:', error);
    res.status(500).json({ error: "Erro ao verificar resposta" });
  }
});

// Rota para obter dica sobre um desafio
app.get('/api/challenge-hint/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Encontra o desafio pelo ID
    const challenge = allChallenges.find(c => c.id === id);
    
    if (!challenge) {
      return res.status(404).json({ error: "Desafio não encontrado" });
    }
    
    // Retorna a primeira dica disponível ou uma mensagem genérica
    const hint = challenge.hints?.[0] || 
      "Reveja o enunciado com atenção e pense no conceito básico que está sendo testado.";
    
    return res.json({ hint });
  } catch (error) {
    console.error('Erro ao obter dica:', error);
    res.status(500).json({ error: "Erro ao obter dica" });
  }
});

// Rota para obter a solução de um desafio
app.get('/api/challenge-solution/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Encontra o desafio pelo ID
    const challenge = allChallenges.find(c => c.id === id);
    
    if (!challenge) {
      return res.status(404).json({ error: "Desafio não encontrado" });
    }
    
    // Se for questão de múltipla escolha, retorna a resposta correta
    if (challenge.type === 'multipleChoice') {
      const correctOption = challenge.options.find(opt => opt.id === challenge.correctAnswer);
      
      return res.json({ 
        solution: `A resposta correta é: ${correctOption?.text || challenge.correctAnswer}`,
        explanation: challenge.explanation || "Esta é a resposta correta para o desafio."
      });
    }
    
    // Se for questão de código, retorna a solução esperada
    if (challenge.type === 'codeCompletion') {
      return res.json({ 
        solution: challenge.expectedSolution,
        explanation: challenge.explanation || "Esta é uma possível solução para o desafio."
      });
    }
    
    return res.status(400).json({ error: "Tipo de desafio não suportado" });
    
  } catch (error) {
    console.error('Erro ao obter solução:', error);
    res.status(500).json({ error: "Erro ao obter solução" });
  }
});

// Rota para obter um texto motivacional aleatório
app.get('/api/motivational-text', (req, res) => {
  try {
    const text = getRandomMotivationalText();
    res.json({ text });
  } catch (error) {
    console.error('Erro ao obter texto motivacional:', error);
    res.status(500).json({ error: "Erro ao obter texto motivacional" });
  }
});

// Rota para obter informações do LLM atual
app.get('/api/llm-info', (req, res) => {
  try {
    const info = {
      provider: LLM_PROVIDER,
      model: LLM_PROVIDER === 'groq' ? GROQ_MODEL : OPENAI_MODEL
    };
    res.json(info);
  } catch (error) {
    console.error('Erro ao obter informações do LLM:', error);
    res.status(500).json({ error: "Erro ao obter informações do LLM" });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Modo: Otimizado para educação`);
  console.log(`Provedor de LLM: ${LLM_PROVIDER}`);
  
  if (LLM_PROVIDER === 'groq') {
    console.log(`API Groq: Ativa (${GROQ_MODEL})`);
  } else {
    console.log(`API OpenAI: Ativa (${OPENAI_MODEL})`);
  }
  
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Desafios: ${allChallenges.length} desafios carregados`);
});