const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Import OpenAI service
const openaiService = require("./services/openaiService");

// Import i18n middleware and services
const {
  i18nMiddleware,
  sendI18nError,
  sendI18nSuccess,
} = require("./middleware/i18n");
const i18nService = require("./services/i18nService");

// Middleware de CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept-Language",
      "X-Language",
    ],
  }),
);
app.use(bodyParser.json({ limit: "5mb" })); // Aumentado para suportar uploads de arquivos maiores

// Apply i18n middleware to all API routes
app.use("/api", i18nMiddleware);

// Create the src directory if it doesn't exist
const srcDir = path.join(__dirname, "src");
const routesDir = path.join(srcDir, "routes");

// Ensure directories exist (for fresh installations)
fs.mkdir(srcDir, { recursive: true })
  .then(() => fs.mkdir(routesDir, { recursive: true }))
  .catch((err) => {
    if (err.code !== "EEXIST") {
      console.error("Error creating directories:", err);
    }
  });

// Caminho para o arquivo de desafios pré-gerados
const CHALLENGES_FILE = path.join(__dirname, "challenges.json");

// Função para carregar os desafios pré-gerados
let allChallenges = [];

const loadChallenges = async () => {
  try {
    const data = await fs.readFile(CHALLENGES_FILE, "utf8");
    allChallenges = JSON.parse(data);
    console.log(`Carregados ${allChallenges.length} desafios pré-gerados.`);
    console.log(
      `- HTML: ${allChallenges.filter((c) => c.topic === "html").length} desafios`,
    );
    console.log(
      `- CSS: ${allChallenges.filter((c) => c.topic === "css").length} desafios`,
    );
    console.log(
      `- JavaScript: ${allChallenges.filter((c) => c.topic === "javascript").length} desafios`,
    );
  } catch (error) {
    console.error("Erro ao carregar desafios:", error);
    // Fallback para os desafios base caso não consiga carregar o arquivo
    allChallenges = predefinedChallenges;
  }
};

// Carregar desafios ao iniciar o servidor
loadChallenges();

// Desafios predefinidos (fallback)
const predefinedChallenges = [
  {
    id: "1",
    topic: "html",
    title: "Primeira Tag HTML",
    description:
      "Qual tag HTML é usada para criar um título de primeiro nível?",
    type: "multipleChoice",
    options: [
      { id: "a", text: "<h1>" },
      { id: "b", text: "<title>" },
      { id: "c", text: "<header>" },
      { id: "d", text: "<main>" },
    ],
    correctAnswer: "a",
    successFeedback:
      "Correto! A tag <h1> é usada para criar o título principal de uma página. É importante ter apenas um h1 por página para manter uma boa estrutura.",
    failureFeedback:
      "Não é essa. A tag para criar um título de primeiro nível é a <h1>. É o título mais importante da página.",
    explanation:
      "A tag <h1> define o título principal e é importante para SEO e acessibilidade.",
  },
  {
    id: "2",
    topic: "css",
    title: "Seletores CSS",
    description:
      "Qual seletor CSS é usado para selecionar elementos com uma classe específica?",
    type: "multipleChoice",
    options: [
      { id: "a", text: "#nome" },
      { id: "b", text: ".nome" },
      { id: "c", text: "$nome" },
      { id: "d", text: "*nome" },
    ],
    correctAnswer: "b",
    successFeedback:
      "Exatamente! O ponto (.) é usado para selecionar elementos por classe em CSS.",
    failureFeedback:
      "Não é esse. Para selecionar elementos por classe no CSS, usamos o ponto (.) seguido do nome da classe.",
    explanation:
      "Em CSS, usamos # para IDs, . para classes, e nada para elementos/tags.",
  },
  // Outros desafios predefinidos...
];

// Função para gerar ID de desafio
const generateChallengeId = () => {
  return "c-" + Math.random().toString(36).substring(2, 10);
};

// Função para obter um texto motivacional aleatório
const getRandomMotivationalText = () => {
  const randomIndex = Math.floor(Math.random() * motivationalTexts.length);
  return motivationalTexts[randomIndex];
};

// Import custom routes
const apiRoutes = require("./src/index");

// Use API routes
app.use("/api", apiRoutes);

// Rota para obter desafios
app.get("/api/challenges", (req, res) => {
  const { topic, level } = req.query;

  let filteredChallenges = [...allChallenges];

  // Filtrar por tópico se fornecido
  if (topic && topic !== "all") {
    filteredChallenges = filteredChallenges.filter(
      (challenge) => challenge.topic === topic,
    );
  }

  // Filtrar por nível se fornecido
  if (level) {
    filteredChallenges = filteredChallenges.filter(
      (challenge) => challenge.level === level,
    );
  }

  // Limitar a quantidade de desafios retornados para evitar sobrecarga
  if (filteredChallenges.length > 50) {
    // Embaralhar os desafios para sempre obter um conjunto diferente
    const shuffled = [...filteredChallenges].sort(() => 0.5 - Math.random());
    filteredChallenges = shuffled.slice(0, 50);
  }

  return res.json(filteredChallenges);
});

// Rota para obter um desafio específico
app.get("/api/challenge/:id", (req, res) => {
  const { id } = req.params;

  // Encontrar o desafio pelo ID
  const challenge = allChallenges.find((c) => c.id === id);

  if (!challenge) {
    return res.status(404).json({ error: "Desafio não encontrado" });
  }

  res.json(challenge);
});

// Rota para obter um desafio aleatório
app.get("/api/random-challenge", (req, res) => {
  const { topic, type } = req.query;

  let filteredChallenges = [...allChallenges];

  // Filtrar por tópico se fornecido
  if (topic && topic !== "all") {
    filteredChallenges = filteredChallenges.filter(
      (challenge) => challenge.topic === topic,
    );
  }

  // Filtrar por tipo se fornecido
  if (type) {
    filteredChallenges = filteredChallenges.filter(
      (challenge) => challenge.type === type,
    );
  }

  if (filteredChallenges.length === 0) {
    return res
      .status(404)
      .json({ error: "Nenhum desafio encontrado com os critérios fornecidos" });
  }

  // Selecionar um desafio aleatório
  const randomIndex = Math.floor(Math.random() * filteredChallenges.length);
  const randomChallenge = filteredChallenges[randomIndex];

  res.json(randomChallenge);
});

// Rota para verificar resposta de desafio
app.post("/api/check-challenge", (req, res) => {
  try {
    const { challengeId, userAnswer } = req.body;

    // Encontra o desafio pelo ID
    const challenge = allChallenges.find((c) => c.id === challengeId);

    if (!challenge) {
      return res.status(404).json({ error: "Desafio não encontrado" });
    }

    // Se for questão de múltipla escolha
    if (challenge.type === "multipleChoice") {
      const isCorrect = userAnswer === challenge.correctAnswer;

      return res.json({
        isCorrect,
        feedback: isCorrect
          ? challenge.successFeedback
          : challenge.failureFeedback,
        motivationalText: isCorrect ? req.t.getRandomMotivationalText() : null,
      });
    }

    // Se for questão de código
    if (challenge.type === "codeCompletion") {
      // Verificação simplificada - apenas verifica se contém partes da solução esperada
      const expectedSolutionClean = challenge.expectedSolution
        .replace(/\s+/g, "")
        .toLowerCase();
      const userAnswerClean = userAnswer.replace(/\s+/g, "").toLowerCase();

      // Se a resposta contiver os elementos chave da solução
      const isCorrect = userAnswerClean.includes(
        expectedSolutionClean.substring(
          0,
          Math.min(expectedSolutionClean.length, 50),
        ),
      );

      return res.json({
        isCorrect,
        feedback: isCorrect
          ? challenge.successFeedback
          : `Sua resposta não está correta. Tente novamente! Dica: ${challenge.hints?.[0] || "Reveja o enunciado com atenção."}`,
        motivationalText: isCorrect ? req.t.getRandomMotivationalText() : null,
      });
    }

    return res.status(400).json({ error: "Tipo de desafio não suportado" });
  } catch (error) {
    console.error("Erro ao verificar resposta:", error);
    res.status(500).json({ error: "Erro ao verificar resposta" });
  }
});

// Rota para obter dica sobre um desafio
app.get("/api/challenge-hint/:id", (req, res) => {
  try {
    const { id } = req.params;

    // Encontra o desafio pelo ID
    const challenge = allChallenges.find((c) => c.id === id);

    if (!challenge) {
      return res.status(404).json({ error: "Desafio não encontrado" });
    }

    // Retorna a primeira dica disponível ou uma mensagem genérica
    const hint =
      challenge.hints?.[0] ||
      "Reveja o enunciado com atenção e pense no conceito básico que está sendo testado.";

    return res.json({ hint });
  } catch (error) {
    console.error("Erro ao obter dica:", error);
    res.status(500).json({ error: "Erro ao obter dica" });
  }
});

// Rota para obter a solução de um desafio
app.get("/api/challenge-solution/:id", (req, res) => {
  try {
    const { id } = req.params;

    // Encontra o desafio pelo ID
    const challenge = allChallenges.find((c) => c.id === id);

    if (!challenge) {
      return res.status(404).json({ error: "Desafio não encontrado" });
    }

    // Se for questão de múltipla escolha, retorna a resposta correta
    if (challenge.type === "multipleChoice") {
      const correctOption = challenge.options.find(
        (opt) => opt.id === challenge.correctAnswer,
      );

      return res.json({
        solution: `A resposta correta é: ${correctOption?.text || challenge.correctAnswer}`,
        explanation:
          challenge.explanation || "Esta é a resposta correta para o desafio.",
      });
    }

    // Se for questão de código, retorna a solução esperada
    if (challenge.type === "codeCompletion") {
      return res.json({
        solution: challenge.expectedSolution,
        explanation:
          challenge.explanation ||
          "Esta é uma possível solução para o desafio.",
      });
    }

    return res.status(400).json({ error: "Tipo de desafio não suportado" });
  } catch (error) {
    console.error("Erro ao obter solução:", error);
    res.status(500).json({ error: "Erro ao obter solução" });
  }
});

// Rota para obter um texto motivacional aleatório
app.get("/api/motivational-text", async (req, res) => {
  try {
    const text = await req.t.getRandomMotivationalText();
    return sendI18nSuccess(res, req, { text });
  } catch (error) {
    console.error("Erro ao obter texto motivacional:", error);
    return sendI18nError(res, req, 500, "errors.serverError");
  }
});

// Rota para obter informações do LLM atual
app.get("/api/llm-info", async (req, res) => {
  try {
    const info = {
      provider: "openai",
      model: openaiService.getModel(),
      language: req.language,
      supportedLanguages: i18nService.getSupportedLanguages(),
    };
    return sendI18nSuccess(res, req, info);
  } catch (error) {
    console.error("Erro ao obter informações do LLM:", error);
    return sendI18nError(res, req, 500, "errors.serverError");
  }
});

// Route to get i18n information - Enhanced with challenge stats
app.get("/api/i18n-info", (req, res) => {
  const stats = i18nService.getCacheStats();
  res.json({
    currentLanguage: req.language,
    supportedLanguages: i18nService.getSupportedLanguages(),
    defaultLanguage: "pt",
    cacheStats: stats,
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Iniciar o servidor
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Modo: Otimizado para educação`);
  console.log(`API OpenAI: Ativa (${openaiService.getModel()})`);
  console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `Idiomas suportados: ${i18nService.getSupportedLanguages().join(", ")}`,
  );

  // Health check on startup
  const isHealthy = await openaiService.healthCheck();
  if (isHealthy) {
    console.log("✓ OpenAI API health check passed");
  } else {
    console.warn("⚠ OpenAI API health check failed - check your API key");
  }
});
