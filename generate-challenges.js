/**
 * Script para gerar desafios pré-definidos
 * 
 * Este script gera 100 desafios de cada tipo (HTML, CSS, JavaScript),
 * sendo 70 de nível iniciante e 30 de nível iniciante-intermediário,
 * metade múltipla escolha e metade completar código.
 * 
 * Os desafios são salvos no arquivo challenges.json
 */

const fs = require('fs').promises;
const path = require('path');

// Estrutura para armazenar os desafios
const challenges = {
  html: [],
  css: [],
  javascript: []
};

// Função para gerar ID único
const generateId = () => {
  return 'c-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Desafios HTML de múltipla escolha para iniciantes
const htmlMultipleChoiceBeginner = [
  {
    "title": "Tags básicas HTML",
    "description": "Qual das seguintes tags HTML é usada para criar um parágrafo?",
    "options": [
      { "id": "a", "text": "<paragraph>" },
      { "id": "b", "text": "<p>" },
      { "id": "c", "text": "<para>" },
      { "id": "d", "text": "<text>" }
    ],
    "correctAnswer": "b",
    "successFeedback": "Correto! A tag <p> é utilizada para criar parágrafos em HTML.",
    "failureFeedback": "Incorreto. A tag correta para criar parágrafos é <p>.",
    "explanation": "A tag <p> define um parágrafo em HTML e é um dos elementos mais básicos e frequentemente utilizados."
  },
  {
    "title": "Estrutura de uma página HTML",
    "description": "Qual tag deve conter o título da página que aparece na aba do navegador?",
    "options": [
      { "id": "a", "text": "<header>" },
      { "id": "b", "text": "<title>" },
      { "id": "c", "text": "<heading>" },
      { "id": "d", "text": "<head>" }
    ],
    "correctAnswer": "b",
    "successFeedback": "Correto! A tag <title> dentro do <head> define o título da página que aparece na aba do navegador.",
    "failureFeedback": "Incorreto. O título da página que aparece na aba do navegador é definido pela tag <title>.",
    "explanation": "A tag <title> deve ser colocada dentro da tag <head> e define o título da página que aparece na barra de título ou aba do navegador."
  },
  {
    "title": "Listas em HTML",
    "description": "Qual tag é usada para criar uma lista ordenada?",
    "options": [
      { "id": "a", "text": "<ul>" },
      { "id": "b", "text": "<ol>" },
      { "id": "c", "text": "<li>" },
      { "id": "d", "text": "<dl>" }
    ],
    "correctAnswer": "b",
    "successFeedback": "Correto! A tag <ol> é usada para criar listas ordenadas em HTML.",
    "failureFeedback": "Incorreto. Para criar uma lista ordenada, use a tag <ol>.",
    "explanation": "A tag <ol> cria uma lista ordenada, enquanto <ul> cria uma lista não ordenada." 
  },
  {
    "title": "Links em HTML",
    "description": "Qual atributo da tag <a> define o destino do link?",
    "options": [
      { "id": "a", "text": "src" },
      { "id": "b", "text": "href" },
      { "id": "c", "text": "link" },
      { "id": "d", "text": "url" }
    ],
    "correctAnswer": "b",
    "successFeedback": "Correto! O atributo href define o destino do link em HTML.",
    "failureFeedback": "Incorreto. O destino do link é definido pelo atributo href na tag <a>.",
    "explanation": "A tag <a> cria links, e o atributo href especifica a URL de destino." 
  },
  {
    "title": "Tabelas em HTML",
    "description": "Qual tag é usada para definir uma célula de cabeçalho em uma tabela?",
    "options": [
      { "id": "a", "text": "<tr>" },
      { "id": "b", "text": "<th>" },
      { "id": "c", "text": "<td>" },
      { "id": "d", "text": "<table>" }
    ],
    "correctAnswer": "b",
    "successFeedback": "Correto! A tag <th> é usada para células de cabeçalho em uma tabela.",
    "failureFeedback": "Incorreto. Para células de cabeçalho, use a tag <th>.",
    "explanation": "A tag <th> define células de cabeçalho, enquanto <td> define células normais em uma tabela HTML." 
  },
  {
    "title": "Cabeçalhos em HTML",
    "description": "Qual tag é usada para criar o maior cabeçalho em HTML?",
    "options": [
      { "id": "a", "text": "<header>" },
      { "id": "b", "text": "<h6>" },
      { "id": "c", "text": "<h1>" },
      { "id": "d", "text": "<heading>" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! A tag <h1> cria o cabeçalho de maior destaque.",
    "failureFeedback": "Incorreto. A tag <h1> é usada para o cabeçalho principal.",
    "explanation": "Em HTML, <h1> é o cabeçalho de maior importância, seguido por <h2>, <h3> e assim por diante."
  },
  {
    "title": "Imagens em HTML",
    "description": "Qual atributo define o caminho da imagem em HTML?",
    "options": [
      { "id": "a", "text": "source" },
      { "id": "b", "text": "path" },
      { "id": "c", "text": "src" },
      { "id": "d", "text": "link" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! O atributo src define o caminho da imagem.",
    "failureFeedback": "Incorreto. O atributo para definir o caminho da imagem é src.",
    "explanation": "Na tag <img>, o atributo src especifica o endereço ou caminho da imagem a ser exibida."
  },
  {
    "title": "Divisões em HTML",
    "description": "Qual tag é usada para criar uma divisão ou seção genérica em HTML?",
    "options": [
      { "id": "a", "text": "<section>" },
      { "id": "b", "text": "<div>" },
      { "id": "c", "text": "<span>" },
      { "id": "d", "text": "<block>" }
    ],
    "correctAnswer": "b",
    "successFeedback": "Correto! A tag <div> cria uma divisão genérica.",
    "failureFeedback": "Incorreto. A tag <div> é usada para criar divisões em HTML.",
    "explanation": "A tag <div> é um container genérico para agrupar e organizar conteúdo em HTML."
  },
  {
    "title": "Texto em Negrito",
    "description": "Qual tag deixa o texto em negrito com significado semântico?",
    "options": [
      { "id": "a", "text": "<b>" },
      { "id": "b", "text": "<bold>" },
      { "id": "c", "text": "<strong>" },
      { "id": "d", "text": "<em>" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! A tag <strong> deixa o texto em negrito com ênfase semântica.",
    "failureFeedback": "Incorreto. <strong> é a tag para texto em negrito com significado semântico.",
    "explanation": "Diferente de <b>, <strong> indica que o texto tem importância especial."
  },
  {
    "title": "Quebra de Linha",
    "description": "Qual tag HTML cria uma quebra de linha?",
    "options": [
      { "id": "a", "text": "<break>" },
      { "id": "b", "text": "<lb>" },
      { "id": "c", "text": "<br>" },
      { "id": "d", "text": "<newline>" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! A tag <br> cria uma quebra de linha.",
    "failureFeedback": "Incorreto. A tag para quebra de linha é <br>.",
    "explanation": "A tag <br> é usada para criar uma quebra de linha em HTML, sem precisar de tag de fechamento."
  },
  {
    "title": "Comentários em HTML",
    "description": "Como se escreve um comentário em HTML?",
    "options": [
      { "id": "a", "text": "// Comentário" },
      { "id": "b", "text": "/* Comentário */" },
      { "id": "c", "text": "<!-- Comentário -->" },
      { "id": "d", "text": "' Comentário" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! Comentários em HTML usam <!-- -->",
    "failureFeedback": "Incorreto. Comentários em HTML são escritos com <!-- -->",
    "explanation": "Comentários em HTML são escritos entre <!-- e --> e não são exibidos na página renderizada."
  },
  {
    "title": "Texto em Itálico",
    "description": "Qual tag deixa o texto em itálico?",
    "options": [
      { "id": "a", "text": "<italic>" },
      { "id": "b", "text": "<i>" },
      { "id": "c", "text": "<em>" },
      { "id": "d", "text": "<slant>" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! A tag <em> deixa o texto em itálico com ênfase semântica.",
    "failureFeedback": "Incorreto. <em> é a tag para texto em itálico com significado semântico.",
    "explanation": "Enquanto <i> apenas estiliza, <em> adiciona significado semântico de ênfase."
  },
  {
    "title": "Hiperlinks Externos",
    "description": "Como se cria um link que abre em nova aba/janela?",
    "options": [
      { "id": "a", "text": "target=\"new\"" },
      { "id": "b", "text": "href=\"external\"" },
      { "id": "c", "text": "target=\"_blank\"" },
      { "id": "d", "text": "link=\"external\"" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! target=\"_blank\" faz o link abrir em nova aba.",
    "failureFeedback": "Incorreto. Use target=\"_blank\" para abrir link em nova aba.",
    "explanation": "O atributo target=\"_blank\" na tag <a> faz o link ser aberto em uma nova aba ou janela."
  },
  {
    "title": "Listas Não Ordenadas",
    "description": "Qual tag cria uma lista não ordenada em HTML?",
    "options": [
      { "id": "a", "text": "<ol>" },
      { "id": "b", "text": "<ul>" },
      { "id": "c", "text": "<li>" },
      { "id": "d", "text": "<list>" }
    ],
    "correctAnswer": "b",
    "successFeedback": "Correto! A tag <ul> cria listas não ordenadas.",
    "failureFeedback": "Incorreto. <ul> é a tag para listas não ordenadas.",
    "explanation": "A tag <ul> (unordered list) cria listas com marcadores, sem numeração."
  },
  {
    "title": "Elementos de Lista",
    "description": "Qual tag representa um item de lista em HTML?",
    "options": [
      { "id": "a", "text": "<list>" },
      { "id": "b", "text": "<item>" },
      { "id": "c", "text": "<li>" },
      { "id": "d", "text": "<bullet>" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! A tag <li> representa um item de lista.",
    "failureFeedback": "Incorreto. <li> é a tag para itens de lista.",
    "explanation": "A tag <li> (list item) é usada dentro de <ul> ou <ol> para definir cada item da lista."
  },
  {
    "title": "Atributo Alt em Imagens",
    "description": "Qual é o propósito do atributo 'alt' em imagens?",
    "options": [
      { "id": "a", "text": "Definir a largura da imagem" },
      { "id": "b", "text": "Texto alternativo para acessibilidade" },
      { "id": "c", "text": "Definir o caminho da imagem" },
      { "id": "d", "text": "Criar um link para a imagem" }
    ],
    "correctAnswer": "b",
    "successFeedback": "Correto! O atributo 'alt' fornece texto alternativo para acessibilidade.",
    "failureFeedback": "Incorreto. 'alt' serve para texto alternativo em imagens.",
    "explanation": "O atributo 'alt' descreve a imagem para leitores de tela e aparece caso a imagem não carregue."
  },
  {
    "title": "Linha Horizontal",
    "description": "Qual tag cria uma linha horizontal em HTML?",
    "options": [
      { "id": "a", "text": "<line>" },
      { "id": "b", "text": "<hr>" },
      { "id": "c", "text": "<horizontal>" },
      { "id": "d", "text": "<break>" }
    ],
    "correctAnswer": "b",
    "successFeedback": "Correto! A tag <hr> cria uma linha horizontal.",
    "failureFeedback": "Incorreto. <hr> é a tag para linha horizontal.",
    "explanation": "A tag <hr> (horizontal rule) cria uma linha de divisão horizontal na página."
  },
  {
    "title": "Elementos de Citação",
    "description": "Qual tag é usada para citações em HTML?",
    "options": [
      { "id": "a", "text": "<cite>" },
      { "id": "b", "text": "<quote>" },
      { "id": "c", "text": "<blockquote>" },
      { "id": "d", "text": "<reference>" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! <blockquote> é usado para citações em bloco.",
    "failureFeedback": "Incorreto. <blockquote> é a tag para citações.",
    "explanation": "A tag <blockquote> é usada para indicar citações ou trechos de texto de outras fontes."
  },
  {
    "title": "Elemento Span",
    "description": "Qual é o propósito da tag <span>?",
    "options": [
      { "id": "a", "text": "Criar uma divisão em bloco" },
      { "id": "b", "text": "Criar uma lista" },
      { "id": "c", "text": "Aplicar estilo a uma parte inline do texto" },
      { "id": "d", "text": "Criar um link" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! <span> é usado para estilizar partes inline do texto.",
    "failureFeedback": "Incorreto. <span> aplica estilo a partes específicas do texto.",
    "explanation": "A tag <span> é um elemento inline usado para aplicar estilos ou identificar partes do texto."
  },
  {
    "title": "Elemento de Âncora",
    "description": "O que a tag <a> é usada para criar em HTML?",
    "options": [
      { "id": "a", "text": "Parágrafos" },
      { "id": "b", "text": "Imagens" },
      { "id": "c", "text": "Links de hipertexto" },
      { "id": "d", "text": "Tabelas" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! A tag <a> cria links de hipertexto.",
    "failureFeedback": "Incorreto. <a> é usada para criar links.",
    "explanation": "A tag <a> (anchor) é usada para criar hiperlinks para outras páginas ou recursos."
  },
  {
    "title": "Elementos de Ênfase",
    "description": "Qual tag dá ênfase importante ao texto?",
    "options": [
      { "id": "a", "text": "<i>" },
      { "id": "b", "text": "<b>" },
      { "id": "c", "text": "<em>" },
      { "id": "d", "text": "<important>" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! <em> dá ênfase semântica ao texto.",
    "failureFeedback": "Incorreto. <em> é a tag para dar ênfase ao texto.",
    "explanation": "A tag <em> (emphasis) adiciona ênfase semântica, geralmente exibida em itálico."
  },
  {
    "title": "Elemento de Rodapé",
    "description": "Qual tag HTML representa o rodapé de uma página ou seção?",
    "options": [
      { "id": "a", "text": "<bottom>" },
      { "id": "b", "text": "<end>" },
      { "id": "c", "text": "<footer>" },
      { "id": "d", "text": "<base>" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! <footer> representa o rodapé.",
    "failureFeedback": "Incorreto. <footer> é a tag para rodapé.",
    "explanation": "A tag <footer> define o rodapé de uma página ou seção, contendo informações de conclusão."
  },
  {
    "title": "Atributo de Classe",
    "description": "Como se define uma classe em um elemento HTML?",
    "options": [
      { "id": "a", "text": "class=\"nome\"" },
      { "id": "b", "text": "style=\"nome\"" },
      { "id": "c", "text": "id=\"nome\"" },
      { "id": "d", "text": "type=\"nome\"" }
    ],
    "correctAnswer": "a",
    "successFeedback": "Correto! class=\"nome\" define uma classe.",
    "failureFeedback": "Incorreto. Use class=\"nome\" para definir uma classe.",
    "explanation": "O atributo class permite associar um ou mais nomes de classe a um elemento HTML."
  },
    {
      "title": "Elemento de Cabeçalho",
      "description": "Qual tag contém metadados de uma página HTML?",
      "options": [
        { "id": "a", "text": "<meta>" },
        { "id": "b", "text": "<header>" },
        { "id": "c", "text": "<head>" },
        { "id": "d", "text": "<top>" }
      ],
      "correctAnswer": "c",
      "successFeedback": "Correto! <head> contém os metadados da página.",
      "failureFeedback": "Incorreto. <head> é a tag que contém metadados.",
      "explanation": "A tag <head> é usada para incluir metadados, títulos, links para folhas de estilo e outros elementos não visíveis diretamente na página."
    },
    {
      "title": "Elemento Semântico",
      "description": "Qual tag HTML5 representa a seção principal de conteúdo?",
      "options": [
        { "id": "a", "text": "<content>" },
        { "id": "b", "text": "<section>" },
        { "id": "c", "text": "<main>" },
        { "id": "d", "text": "<body>" }
      ],
      "correctAnswer": "c",
      "successFeedback": "Correto! <main> representa a seção principal de conteúdo.",
      "failureFeedback": "Incorreto. <main> é a tag para o conteúdo principal.",
      "explanation": "A tag <main> define o conteúdo principal de um documento HTML, devendo ser único por página."
    },
    {
      "title": "Elemento de Grupo",
      "description": "Qual tag agrupa elementos em uma página HTML?",
      "options": [
        { "id": "a", "text": "<group>" },
        { "id": "b", "text": "<div>" },
        { "id": "c", "text": "<section>" },
        { "id": "d", "text": "<container>" }
      ],
      "correctAnswer": "b",
      "successFeedback": "Correto! <div> é usada para agrupar elementos.",
      "failureFeedback": "Incorreto. <div> é a tag para agrupar elementos.",
      "explanation": "A tag <div> é um container genérico usado para agrupar e organizar outros elementos HTML."
    },
    {
      "title": "Atributo de ID",
      "description": "Como se define um identificador único em um elemento HTML?",
      "options": [
        { "id": "a", "text": "class=\"identificador\"" },
        { "id": "b", "text": "name=\"identificador\"" },
        { "id": "c", "text": "id=\"identificador\"" },
        { "id": "d", "text": "type=\"identificador\"" }
      ],
      "correctAnswer": "c",
      "successFeedback": "Correto! id=\"identificador\" define um ID único.",
      "failureFeedback": "Incorreto. Use id=\"identificador\" para definir um ID único.",
      "explanation": "O atributo id define um identificador único para um elemento HTML, usado para estilização e manipulação específica."
    },
    {
      "title": "Links Internos",
      "description": "Como se cria um link para um elemento com ID específico?",
      "options": [
        { "id": "a", "text": "<a link=\"#identificador\">" },
        { "id": "b", "text": "<a href=\"identificador\">" },
        { "id": "c", "text": "<a href=\"#identificador\">" },
        { "id": "d", "text": "<a target=\"#identificador\">" }
      ],
      "correctAnswer": "c",
      "successFeedback": "Correto! <a href=\"#identificador\"> cria um link interno.",
      "failureFeedback": "Incorreto. Use href=\"#identificador\" para links internos.",
      "explanation": "Para criar um link para um elemento na mesma página, use href=\"#\" seguido do ID do elemento."
    },
    {
      "title": "Elementos de Grupo Semântico",
      "description": "Qual tag agrupa conteúdo relacionado semanticamente?",
      "options": [
        { "id": "a", "text": "<div>" },
        { "id": "b", "text": "<group>" },
        { "id": "c", "text": "<section>" },
        { "id": "d", "text": "<container>" }
      ],
      "correctAnswer": "c",
      "successFeedback": "Correto! <section> agrupa conteúdo relacionado.",
      "failureFeedback": "Incorreto. <section> é a tag para agrupar conteúdo relacionado.",
      "explanation": "A tag <section> define uma seção genérica de conteúdo relacionado em um documento HTML."
    }
];

// Desafios HTML de completar código para iniciantes
const htmlCodeCompletionBeginner = [
  {
    title: "Estrutura básica HTML",
    description: "Complete o código para criar a estrutura básica de uma página HTML:",
    codeTemplate: "<!DOCTYPE _____>\n<html>\n<_____>\n  <title>Minha página</title>\n</_____>\n<body>\n  <h1>Meu primeiro site</h1>\n  <p>Bem-vindo à minha página!</p>\n</body>\n</html>",
    expectedSolution: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Minha página</title>\n</head>\n<body>\n  <h1>Meu primeiro site</h1>\n  <p>Bem-vindo à minha página!</p>\n</body>\n</html>",
    successFeedback: "Perfeito! Você completou corretamente a estrutura básica de uma página HTML.",
    hints: ["Lembre-se que a declaração do tipo de documento é importante, assim como a tag que contém metadados."],
    explanation: "A estrutura básica de um documento HTML inclui a declaração !DOCTYPE html, seguida pelas tags <html>, <head> (que contém metadados) e <body> (que contém o conteúdo visível)."
  },
  {
    title: "Links em HTML",
    description: "Complete o código para criar um link para o site 'exemplo.com' que abra em uma nova aba:",
    codeTemplate: "<a _____=\"https://exemplo.com\" _____=\"_blank\">Visite o site</a>",
    expectedSolution: "<a href=\"https://exemplo.com\" target=\"_blank\">Visite o site</a>",
    successFeedback: "Excelente! Você criou corretamente um link que abre em uma nova aba.",
    hints: ["Um link em HTML precisa de dois atributos principais: um para o endereço e outro para definir como ele abre."],
    explanation: "Para criar um link em HTML, usamos a tag <a> com o atributo href (que define o destino) e o atributo target=\"_blank\" (que faz o link abrir em uma nova aba ou janela)."
  },
  {
    "title": "Estrutura básica HTML",
    "description": "Complete o código para criar a estrutura básica de uma página HTML:",
    "codeTemplate": "<!DOCTYPE _____>\n<html>\n<_____>\n  <title>Minha página</title>\n</_____>\n<body>\n  <h1>Meu primeiro site</h1>\n  <p>Bem-vindo à minha página!</p>\n</body>\n</html>",
    "expectedSolution": "<!DOCTYPE html>\n<html>\n<head>\n  <title>Minha página</title>\n</head>\n<body>\n  <h1>Meu primeiro site</h1>\n  <p>Bem-vindo à minha página!</p>\n</body>\n</html>",
    "successFeedback": "Perfeito! Você completou corretamente a estrutura básica de uma página HTML.",
    "hints": ["Lembre-se que a declaração do tipo de documento é importante, assim como a tag que contém metadados."],
    "explanation": "A estrutura básica de um documento HTML inclui a declaração !DOCTYPE html, seguida pelas tags <html>, <head> (que contém metadados) e <body> (que contém o conteúdo visível)."
  },
  {
    "title": "Criando um parágrafo",
    "description": "Complete o código para exibir um parágrafo com o texto 'Olá, mundo!'.",
    "codeTemplate": "<html>\n<body>\n  _____ Olá, mundo! _____\n</body>\n</html>",
    "expectedSolution": "<html>\n<body>\n  <p>Olá, mundo!</p>\n</body>\n</html>",
    "successFeedback": "Muito bem! Você utilizou corretamente a tag de parágrafo.",
    "hints": ["Os parágrafos em HTML são definidos com uma tag específica."],
    "explanation": "A tag <p> é usada para definir parágrafos em HTML, ajudando na organização do conteúdo textual."
  },
  {
    "title": "Adicionando uma imagem",
    "description": "Complete o código para exibir a imagem 'imagem.jpg'.",
    "codeTemplate": "<html>\n<body>\n  <_____ src='imagem.jpg' alt='Descrição da imagem'>\n</body>\n</html>",
    "expectedSolution": "<html>\n<body>\n  <img src='imagem.jpg' alt='Descrição da imagem'>\n</body>\n</html>",
    "successFeedback": "Parabéns! Você adicionou uma imagem corretamente.",
    "hints": ["A tag usada para imagens não precisa de uma tag de fechamento."],
    "explanation": "A tag <img> é usada para exibir imagens, e o atributo src define a fonte da imagem." 
  },
  {
    "title": "Criando uma tabela",
    "description": "Complete o código para criar uma tabela com uma linha e duas colunas.",
    "codeTemplate": "<html>\n<body>\n  <table>\n    <tr>\n      <_____>Nome</_____>\n      <_____>Idade</_____>\n    </tr>\n  </table>\n</body>\n</html>",
    "expectedSolution": "<html>\n<body>\n  <table>\n    <tr>\n      <th>Nome</th>\n      <th>Idade</th>\n    </tr>\n  </table>\n</body>\n</html>",
    "successFeedback": "Ótimo! Você criou uma tabela corretamente.",
    "hints": ["Use a tag apropriada para células de cabeçalho."],
    "explanation": "A tag <th> é usada para células de cabeçalho em uma tabela HTML." 
  }, 
  {
    "title": "Criando um formulário básico",
    "description": "Complete o código para criar um formulário com um campo de entrada de texto.",
    "codeTemplate": "<html>\n<body>\n  <form>\n    <label for='nome'>Nome:</label>\n    <_____ type='text' id='nome' name='nome'>\n  </form>\n</body>\n</html>",
    "expectedSolution": "<html>\n<body>\n  <form>\n    <label for='nome'>Nome:</label>\n    <input type='text' id='nome' name='nome'>\n  </form>\n</body>\n</html>",
    "successFeedback": "Ótimo! Você criou um campo de entrada corretamente.",
    "hints": ["Os campos de entrada em formulários HTML são criados com uma tag específica."],
    "explanation": "A tag <input> é usada para criar campos de entrada, e o atributo type define o tipo de entrada." 
  },
  {
    "title": "Criando um botão de envio",
    "description": "Complete o código para adicionar um botão de envio a um formulário.",
    "codeTemplate": "<html>\n<body>\n  <form>\n    <input type='text' name='nome'>\n    <_____ type='submit' value='Enviar'>\n  </form>\n</body>\n</html>",
    "expectedSolution": "<html>\n<body>\n  <form>\n    <input type='text' name='nome'>\n    <input type='submit' value='Enviar'>\n  </form>\n</body>\n</html>",
    "successFeedback": "Ótimo! Você adicionou um botão de envio corretamente.",
    "hints": ["Os botões de envio utilizam um tipo específico dentro da tag input."],
    "explanation": "O atributo type='submit' dentro da tag <input> cria um botão de envio para formulários HTML." 
  },
  {
    "title": "Criando um cabeçalho",
    "description": "Complete o código para exibir um título de nível 1.",
    "codeTemplate": "<html>\n<body>\n  <_____>Meu título</_____>\n</body>\n</html>",
    "expectedSolution": "<html>\n<body>\n  <h1>Meu título</h1>\n</body>\n</html>",
    "successFeedback": "Muito bem! Você utilizou corretamente a tag de cabeçalho.",
    "hints": ["Os títulos em HTML são definidos com tags específicas que variam de <h1> a <h6>."],
    "explanation": "A tag <h1> é usada para definir o título principal de uma página HTML." 
  },
  {
    "title": "Criando um rodapé",
    "description": "Complete o código para adicionar um rodapé à página.",
    "codeTemplate": "<html>\n<body>\n  <footer>\n    <p>_____ 2025</p>\n  </footer>\n</body>\n</html>",
    "expectedSolution": "<html>\n<body>\n  <footer>\n    <p>&copy; 2025</p>\n  </footer>\n</body>\n</html>",
    "successFeedback": "Ótimo! Você adicionou um rodapé corretamente.",
    "hints": ["O símbolo de copyright pode ser inserido com uma entidade HTML especial."],
    "explanation": "A entidade &copy; representa o símbolo de copyright em HTML." 
  }
];

// Desafios HTML de múltipla escolha para iniciantes-intermediários
const htmlMultipleChoiceIntermediate = [
  {
    title: "Formulários HTML",
    description: "Qual atributo é necessário em um elemento <input> para que ele faça parte de um grupo de botões de opção (radio buttons)?",
    options: [
      { id: "a", text: "group" },
      { id: "b", text: "type" },
      { id: "c", text: "name" },
      { id: "d", text: "class" }
    ],
    correctAnswer: "c",
    successFeedback: "Correto! O atributo 'name' agrupa os botões de opção (radio buttons).",
    failureFeedback: "Incorreto. Para agrupar botões de opção, todos devem compartilhar o mesmo valor no atributo 'name'.",
    explanation: "Para criar um grupo de botões de opção (radio buttons), cada input do tipo 'radio' deve ter o mesmo valor no atributo 'name', o que permite que apenas um seja selecionado por vez."
  },
  {
    title: "Semântica HTML5",
    description: "Qual elemento HTML5 é mais apropriado para representar a seção principal de conteúdo de uma página?",
    options: [
      { id: "a", text: "<section>" },
      { id: "b", text: "<content>" },
      { id: "c", text: "<main>" },
      { id: "d", text: "<article>" }
    ],
    correctAnswer: "c",
    successFeedback: "Correto! O elemento <main> representa o conteúdo principal de uma página.",
    failureFeedback: "Incorreto. Para representar o conteúdo principal de uma página, o elemento adequado é <main>.",
    explanation: "O elemento <main> representa o conteúdo principal de uma página. Ele deve ser único na página e não deve ser descendente de elementos como <article>, <aside>, <footer>, <header> ou <nav>."
  },
  {
    "title": "Atributos de Validação de Formulário",
    "description": "Qual atributo HTML5 torna um campo de formulário obrigatório?",
    "options": [
      { "id": "a", "text": "mandatory" },
      { "id": "b", "text": "required" },
      { "id": "c", "text": "validate" },
      { "id": "d", "text": "must-fill" }
    ],
    "correctAnswer": "b",
    "successFeedback": "Correto! O atributo 'required' torna um campo obrigatório.",
    "failureFeedback": "Incorreto. O atributo para tornar um campo obrigatório é 'required'.",
    "explanation": "O atributo 'required' impede o envio do formulário se o campo estiver vazio, fornecendo validação nativa do HTML5."
  },
  {
    "title": "Tabelas Complexas",
    "description": "Qual atributo permite que uma célula ocupe múltiplas colunas em uma tabela?",
    "options": [
      { "id": "a", "text": "merge" },
      { "id": "b", "text": "span" },
      { "id": "c", "text": "colspan" },
      { "id": "d", "text": "extend" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! O atributo 'colspan' permite que uma célula ocupe múltiplas colunas.",
    "failureFeedback": "Incorreto. O atributo para ocupar múltiplas colunas é 'colspan'.",
    "explanation": "O atributo 'colspan' em uma célula de tabela (th ou td) permite que ela se estenda por múltiplas colunas."
  },
  {
    "title": "Metadados e SEO",
    "description": "Qual tag meta define a codificação de caracteres de uma página HTML?",
    "options": [
      { "id": "a", "text": "<meta charset=\"utf-8\">" },
      { "id": "b", "text": "<meta encoding=\"utf-8\">" },
      { "id": "c", "text": "<meta type=\"utf-8\">" },
      { "id": "d", "text": "<meta language=\"utf-8\">" }
    ],
    "correctAnswer": "a",
    "successFeedback": "Correto! <meta charset=\"utf-8\"> define a codificação de caracteres.",
    "failureFeedback": "Incorreto. A tag para definir a codificação é <meta charset=\"utf-8\">.",
    "explanation": "A tag meta com o atributo charset especifica a codificação de caracteres da página, sendo UTF-8 o padrão mais comum."
  },
  {
    "title": "Tipos de Input",
    "description": "Qual tipo de input HTML5 é usado especificamente para e-mails?",
    "options": [
      { "id": "a", "text": "type=\"mail\"" },
      { "id": "b", "text": "type=\"email\"" },
      { "id": "c", "text": "type=\"contact\"" },
      { "id": "d", "text": "type=\"address\"" }
    ],
    "correctAnswer": "b",
    "successFeedback": "Correto! type=\"email\" valida automaticamente o formato de e-mail.",
    "failureFeedback": "Incorreto. O tipo para e-mails é type=\"email\".",
    "explanation": "O tipo 'email' realiza validação básica de e-mail no lado do cliente, verificando a presença de @ e domínio."
  },
  {
    "title": "Acessibilidade em Formulários",
    "description": "Qual atributo é essencial para associar um label a um campo de formulário?",
    "options": [
      { "id": "a", "text": "connect" },
      { "id": "b", "text": "link" },
      { "id": "c", "text": "for" },
      { "id": "d", "text": "bind" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! O atributo 'for' associa um label ao seu respectivo campo.",
    "failureFeedback": "Incorreto. O atributo para associar label é 'for'.",
    "explanation": "O atributo 'for' em um <label> deve corresponder ao 'id' do campo de formulário, melhorando a acessibilidade."
  },
  {
    "title": "Elemento de Figura",
    "description": "Qual tag HTML5 é usada para agrupar conteúdo de mídia com legenda?",
    "options": [
      { "id": "a", "text": "<media>" },
      { "id": "b", "text": "<group>" },
      { "id": "c", "text": "<figure>" },
      { "id": "d", "text": "<container>" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! <figure> agrupa conteúdo de mídia com legenda.",
    "failureFeedback": "Incorreto. A tag para agrupar mídia com legenda é <figure>.",
    "explanation": "O elemento <figure> permite agrupar imagens, diagramas, fotos ou trechos de código com sua respectiva legenda usando <figcaption>."
  },
  {
    "title": "Elementos de Navegação",
    "description": "Qual elemento HTML5 é apropriado para criar um menu de navegação?",
    "options": [
      { "id": "a", "text": "<menu>" },
      { "id": "b", "text": "<navigation>" },
      { "id": "c", "text": "<nav>" },
      { "id": "d", "text": "<links>" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! <nav> é usado para criar menus de navegação.",
    "failureFeedback": "Incorreto. O elemento para navegação é <nav>.",
    "explanation": "A tag <nav> define uma seção de navegação, geralmente contendo links para outras páginas ou seções do site."
  },
  {
    "title": "Elementos de Tempo",
    "description": "Qual elemento HTML5 é usado para representar data e hora?",
    "options": [
      { "id": "a", "text": "<clock>" },
      { "id": "b", "text": "<datetime>" },
      { "id": "c", "text": "<time>" },
      { "id": "d", "text": "<date>" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! <time> representa data e hora semanticamente.",
    "failureFeedback": "Incorreto. O elemento para data e hora é <time>.",
    "explanation": "O elemento <time> fornece uma forma semântica de representar datas, horas ou durações, facilitando a interpretação por máquinas."
  },
  {
    "title": "Elemento de Conteúdo Externo",
    "description": "Qual tag é usada para incorporar conteúdo externo, como vídeos e mapas?",
    "options": [
      { "id": "a", "text": "<external>" },
      { "id": "b", "text": "<embed>" },
      { "id": "c", "text": "<iframe>" },
      { "id": "d", "text": "<include>" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! <iframe> incorpora conteúdo externo.",
    "failureFeedback": "Incorreto. O elemento para incorporar conteúdo externo é <iframe>.",
    "explanation": "A tag <iframe> permite incorporar outro documento HTML dentro do documento atual, como mapas, vídeos ou páginas externas."
  },
  {
    "title": "Área de Descrição em Formulários",
    "description": "Qual elemento HTML é usado para criar uma área de texto multilinha?",
    "options": [
      { "id": "a", "text": "<input type=\"multiline\">" },
      { "id": "b", "text": "<textbox>" },
      { "id": "c", "text": "<textarea>" },
      { "id": "d", "text": "<text>" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! <textarea> cria uma área de texto multilinha.",
    "failureFeedback": "Incorreto. O elemento para área de texto multilinha é <textarea>.",
    "explanation": "A tag <textarea> permite a entrada de texto multilinha em formulários, com dimensões ajustáveis."
  },
  {
    "title": "Atributos de Entrada Numérica",
    "description": "Qual tipo de input HTML5 é usado para entrada de números?",
    "options": [
      { "id": "a", "text": "type=\"numeric\"" },
      { "id": "b", "text": "type=\"number\"" },
      { "id": "c", "text": "type=\"integer\"" },
      { "id": "d", "text": "type=\"digits\"" }
    ],
    "correctAnswer": "b",
    "successFeedback": "Correto! type=\"number\" permite entrada de valores numéricos.",
    "failureFeedback": "Incorreto. O tipo para entrada numérica é type=\"number\".",
    "explanation": "O tipo 'number' fornece controles para incremento/decremento e validação de entrada numérica."
  },
  {
    "title": "Detalhes e Resumo",
    "description": "Quais elementos HTML5 criam um widget de expansão/contração?",
    "options": [
      { "id": "a", "text": "<expand>" },
      { "id": "b", "text": "<collapse>" },
      { "id": "c", "text": "<details> e <summary>" },
      { "id": "d", "text": "<dropdown>" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! <details> e <summary> criam um widget expansível.",
    "failureFeedback": "Incorreto. Os elementos para widget expansível são <details> e <summary>.",
    "explanation": "Os elementos <details> e <summary> permitem criar um widget que pode ser expandido ou contraído, melhorando a interatividade."
  },
  {
    "title": "Definição de Formulário",
    "description": "Qual atributo especifica o método de envio de um formulário?",
    "options": [
      { "id": "a", "text": "send" },
      { "id": "b", "text": "type" },
      { "id": "c", "text": "method" },
      { "id": "d", "text": "action" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! O atributo 'method' define o método de envio do formulário.",
    "failureFeedback": "Incorreto. O atributo para definir o método de envio é 'method'.",
    "explanation": "O atributo 'method' em um formulário define como os dados serão enviados, sendo os valores mais comuns 'get' e 'post'."
  },
  {
    "title": "Validação de Padrão",
    "description": "Qual atributo HTML5 permite validar um campo baseado em uma expressão regular?",
    "options": [
      { "id": "a", "text": "regex" },
      { "id": "b", "text": "match" },
      { "id": "c", "text": "pattern" },
      { "id": "d", "text": "validate" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! O atributo 'pattern' permite validação com expressão regular.",
    "failureFeedback": "Incorreto. O atributo para validação de padrão é 'pattern'.",
    "explanation": "O atributo 'pattern' permite definir uma expressão regular para validar o conteúdo de um campo de formulário."
  },
  {
    "title": "Dados de Saída em Formulários",
    "description": "Qual elemento HTML5 é usado para exibir resultados de cálculos de formulário?",
    "options": [
      { "id": "a", "text": "<result>" },
      { "id": "b", "text": "<calculate>" },
      { "id": "c", "text": "<output>" },
      { "id": "d", "text": "<display>" }
    ],
    "correctAnswer": "c",
    "successFeedback": "Correto! <output> exibe resultados de cálculos de formulário.",
    "failureFeedback": "Incorreto. O elemento para exibir resultados é <output>.",
    "explanation": "O elemento <output> é usado para exibir o resultado de um cálculo ou ação em um formulário, com suporte nativo do HTML5."
  }
  // (Adicionar mais 13 desafios HTML de múltipla escolha para iniciantes-intermediários)
];

// Desafios HTML de completar código para iniciantes-intermediários
const htmlCodeCompletionIntermediate = [
  {
    title: "Tabela HTML com colspan",
    description: "Complete o código para criar uma tabela onde a primeira célula do cabeçalho ocupa duas colunas:",
    codeTemplate: "<table border=\"1\">\n  <tr>\n    <th _____=\"2\">Produtos</th>\n    <th>Preço</th>\n  </tr>\n  <tr>\n    <td>Produto A</td>\n    <td>R$ 10,00</td>\n  </tr>\n  <tr>\n    <td>Produto B</td>\n    <td>R$ 20,00</td>\n  </tr>\n</table>",
    expectedSolution: "<table border=\"1\">\n  <tr>\n    <th colspan=\"2\">Produtos</th>\n    <th>Preço</th>\n  </tr>\n  <tr>\n    <td>Produto A</td>\n    <td>R$ 10,00</td>\n  </tr>\n  <tr>\n    <td>Produto B</td>\n    <td>R$ 20,00</td>\n  </tr>\n</table>",
    successFeedback: "Muito bem! Você utilizou corretamente o atributo colspan.",
    hints: ["Há um atributo específico para fazer com que uma célula ocupe mais de uma coluna."],
    explanation: "Para fazer uma célula ocupar múltiplas colunas, usamos o atributo colspan com o número de colunas que ela deve ocupar."
  },
  {
    title: "Formulário com validação",
    description: "Complete o código para criar um campo de e-mail obrigatório com validação de padrão:",
    codeTemplate: "<form action=\"/submit\" method=\"post\">\n  <label for=\"email\">E-mail:</label>\n  <input type=\"_____\" id=\"email\" name=\"email\" _____>\n  <button type=\"submit\">Enviar</button>\n</form>",
    expectedSolution: "<form action=\"/submit\" method=\"post\">\n  <label for=\"email\">E-mail:</label>\n  <input type=\"email\" id=\"email\" name=\"email\" required>\n  <button type=\"submit\">Enviar</button>\n</form>",
    successFeedback: "Excelente! Você criou um campo de e-mail com validação corretamente.",
    hints: ["HTML5 tem um tipo de input específico para e-mails e um atributo que torna o campo obrigatório."],
    explanation: "O tipo 'email' para o input faz com que o navegador valide automaticamente se o valor inserido parece um e-mail válido. O atributo 'required' torna o campo obrigatório, impedindo o envio do formulário se estiver vazio."
  },
  // (Adicionar mais 13 desafios HTML de completar código para iniciantes-intermediários)
];

// Desafios CSS de múltipla escolha para iniciantes
const cssMultipleChoiceBeginner = [
  {
    title: "Seletores CSS básicos",
    description: "Qual seletor CSS é usado para aplicar estilos a elementos com uma classe específica?",
    options: [
      { id: "a", text: "#nome" },
      { id: "b", text: ".nome" },
      { id: "c", text: "*nome" },
      { id: "d", text: "@nome" }
    ],
    correctAnswer: "b",
    successFeedback: "Correto! O seletor de classe em CSS é representado por um ponto (.) seguido do nome da classe.",
    failureFeedback: "Incorreto. Para selecionar elementos por classe, usamos o ponto (.) seguido do nome da classe.",
    explanation: "Em CSS, o seletor de classe começa com um ponto (.), enquanto o seletor de ID começa com uma hashtag (#). O seletor de classe permite aplicar o mesmo estilo a vários elementos."
  },
  {
    title: "Propriedades de texto CSS",
    description: "Qual propriedade CSS é usada para alterar a cor do texto?",
    options: [
      { id: "a", text: "text-color" },
      { id: "b", text: "font-color" },
      { id: "c", text: "color" },
      { id: "d", text: "text-style" }
    ],
    correctAnswer: "c",
    successFeedback: "Correto! A propriedade 'color' é usada para definir a cor do texto em CSS.",
    failureFeedback: "Incorreto. A propriedade para definir a cor do texto é simplesmente 'color'.",
    explanation: "A propriedade 'color' define a cor do texto de um elemento. Pode receber valores como nomes de cores (red, blue), códigos hexadecimais (#FF0000), RGB (rgb(255,0,0)) ou RGBA."
  },
  // (Adicionar mais 33 desafios CSS de múltipla escolha para iniciantes)
];

// Desafios CSS de completar código para iniciantes
const cssCodeCompletionBeginner = [
  {
    title: "Estilizando parágrafos",
    description: "Complete o código CSS para fazer todos os parágrafos terem texto vermelho e fonte maior:",
    codeTemplate: "p {\n  _____: red;\n  font-_____: 18px;\n}",
    expectedSolution: "p {\n  color: red;\n  font-size: 18px;\n}",
    successFeedback: "Muito bem! Você aplicou corretamente as propriedades de cor e tamanho da fonte.",
    hints: ["A propriedade para cor do texto é simples, e para o tamanho da fonte, você precisa especificar o que está alterando da fonte."],
    explanation: "A propriedade 'color' define a cor do texto, e 'font-size' define o tamanho da fonte. Essas são propriedades básicas para estilizar texto em CSS."
  },
  {
    title: "Centralizar um elemento",
    description: "Complete o código CSS para centralizar um elemento div horizontalmente:",
    codeTemplate: ".centered {\n  width: 300px;\n  margin-left: _____;\n  margin-right: _____;\n}",
    expectedSolution: ".centered {\n  width: 300px;\n  margin-left: auto;\n  margin-right: auto;\n}",
    successFeedback: "Excelente! Você centralizou corretamente o elemento usando 'auto' nas margens laterais.",
    hints: ["Para centralizar um elemento com largura definida, precisamos que as margens se ajustem automaticamente."],
    explanation: "Definir margin-left e margin-right como 'auto' faz com que as margens se ajustem igualmente em ambos os lados, centralizando o elemento horizontalmente (desde que tenha largura definida)."
  },
  // (Adicionar mais 33 desafios CSS de completar código para iniciantes)
];

// Desafios CSS de múltipla escolha para iniciantes-intermediários
const cssMultipleChoiceIntermediate = [
  {
    title: "Modelo de caixa (Box Model)",
    description: "Qual propriedade CSS permite incluir o padding e a borda na largura e altura total de um elemento?",
    options: [
      { id: "a", text: "box-model: inclusive" },
      { id: "b", text: "box-sizing: border-box" },
      { id: "c", text: "box-size: include" },
      { id: "d", text: "box-include: padding-border" }
    ],
    correctAnswer: "b",
    successFeedback: "Correto! A propriedade box-sizing: border-box faz com que padding e bordas sejam incluídos na largura/altura total.",
    failureFeedback: "Incorreto. A propriedade correta é 'box-sizing: border-box'.",
    explanation: "Por padrão, largura e altura em CSS aplicam-se apenas ao conteúdo. A propriedade 'box-sizing: border-box' muda esse comportamento, incluindo padding e bordas no cálculo, o que facilita o layout."
  },
  {
    title: "Flexbox CSS",
    description: "Qual propriedade CSS do Flexbox é usada para definir como os itens flexíveis são distribuídos ao longo do eixo principal?",
    options: [
      { id: "a", text: "align-items" },
      { id: "b", text: "justify-content" },
      { id: "c", text: "flex-flow" },
      { id: "d", text: "align-content" }
    ],
    correctAnswer: "b",
    successFeedback: "Correto! A propriedade 'justify-content' controla a distribuição dos itens ao longo do eixo principal em Flexbox.",
    failureFeedback: "Incorreto. A propriedade que distribui itens ao longo do eixo principal do Flexbox é 'justify-content'.",
    explanation: "No Flexbox, 'justify-content' controla a distribuição dos itens ao longo do eixo principal (horizontal em row, vertical em column), enquanto 'align-items' controla o eixo transversal."
  },
  // (Adicionar mais 13 desafios CSS de múltipla escolha para iniciantes-intermediários)
];

// Desafios CSS de completar código para iniciantes-intermediários
const cssCodeCompletionIntermediate = [
  {
    title: "Layout Flexbox",
    description: "Complete o código CSS para criar um container flexbox com itens alinhados ao centro:",
    codeTemplate: ".flex-container {\n  display: _____;\n  justify-content: _____;\n  align-items: _____;\n  height: 200px;\n}",
    expectedSolution: ".flex-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 200px;\n}",
    successFeedback: "Excelente! Você configurou corretamente um container flexbox com centralização.",
    hints: ["Para criar um flexbox, primeiro defina o tipo de display, depois use as propriedades para centralizar horizontal e verticalmente."],
    explanation: "Para criar um layout flexbox, usamos 'display: flex'. 'justify-content: center' centraliza os itens horizontalmente (no eixo principal) e 'align-items: center' centraliza verticalmente (no eixo transversal)."
  },
  {
    title: "Media Queries",
    description: "Complete o código CSS para criar uma media query que aplica estilos quando a largura da tela é no máximo 768px:",
    codeTemplate: "@_____ _____ (max-width: _____) {\n  .container {\n    width: 100%;\n  }\n}",
    expectedSolution: "@media screen (max-width: 768px) {\n  .container {\n    width: 100%;\n  }\n}",
    successFeedback: "Muito bem! Você criou corretamente uma media query para telas menores.",
    hints: ["Media queries começam com @media seguido do tipo de mídia e depois a condição com um ponto de quebra."],
    explanation: "Media queries permitem aplicar estilos condicionalmente com base em características do dispositivo. '@media screen (max-width: 768px)' aplica os estilos quando a largura da tela é de até 768px."
  },
  // (Adicionar mais 13 desafios CSS de completar código para iniciantes-intermediários)
];

// Desafios JavaScript de múltipla escolha para iniciantes
const jsMultipleChoiceBeginner = [
  {
    title: "Variáveis em JavaScript",
    description: "Qual palavra-chave é usada para declarar uma variável em JavaScript moderno que pode ter seu valor alterado?",
    options: [
      { id: "a", text: "var" },
      { id: "b", text: "const" },
      { id: "c", text: "let" },
      { id: "d", text: "variable" }
    ],
    correctAnswer: "c",
    successFeedback: "Correto! 'let' é a palavra-chave moderna para declarar variáveis que podem ter seus valores alterados.",
    failureFeedback: "Incorreto. A palavra-chave moderna para variáveis que podem ser alteradas é 'let'.",
    explanation: "Em JavaScript moderno, 'let' declara variáveis que podem ter seus valores alterados. 'const' é para constantes (não alteráveis) e 'var' é a forma mais antiga, com escopo menos previsível."
  },
  {
    title: "Operadores em JavaScript",
    description: "Qual operador é usado para verificar se dois valores são iguais em valor E tipo em JavaScript?",
    options: [
      { id: "a", text: "==" },
      { id: "b", text: "===" },
      { id: "c", text: "=" },
      { id: "d", text: "!==" }
    ],
    correctAnswer: "b",
    successFeedback: "Correto! O operador '===' verifica igualdade tanto em valor quanto em tipo.",
    failureFeedback: "Incorreto. O operador para verificar igualdade estrita (valor e tipo) é '==='.",
    explanation: "O operador '===' é chamado de operador de igualdade estrita, verificando se os valores são iguais E do mesmo tipo. O operador '==' verifica apenas igualdade de valor, após conversão de tipo."
  },
  // (Adicionar mais 33 desafios JavaScript de múltipla escolha para iniciantes)
];

// Desafios JavaScript de completar código para iniciantes
const jsCodeCompletionBeginner = [
  {
    title: "Declaração de variáveis",
    description: "Complete o código para declarar uma variável constante 'nome' com o valor 'João':",
    codeTemplate: "_____ nome = 'João';\nconsole.log(nome);",
    expectedSolution: "const nome = 'João';\nconsole.log(nome);",
    successFeedback: "Perfeito! Você declarou corretamente uma constante usando 'const'.",
    hints: ["Para valores que não serão alterados, usamos uma palavra-chave específica."],
    explanation: "Em JavaScript moderno, usamos 'const' para declarar variáveis cujo valor não será alterado. Para variáveis que podem mudar, usamos 'let'."
  },
  {
    title: "Condicionais em JavaScript",
    description: "Complete o código para verificar se a idade é maior ou igual a 18:",
    codeTemplate: "const idade = 20;\n\n_____ (idade _____ 18) {\n  console.log('É maior de idade');\n} _____ {\n  console.log('É menor de idade');\n}",
    expectedSolution: "const idade = 20;\n\nif (idade >= 18) {\n  console.log('É maior de idade');\n} else {\n  console.log('É menor de idade');\n}",
    successFeedback: "Muito bem! Você escreveu corretamente a estrutura condicional.",
    hints: ["Use a estrutura condicional mais comum em JavaScript, com a palavra 'if'."],
    explanation: "A estrutura 'if-else' permite executar código diferente com base em uma condição. O operador '>=' verifica se um valor é maior ou igual a outro."
  },
  // (Adicionar mais 33 desafios JavaScript de completar código para iniciantes)
];

// Desafios JavaScript de múltipla escolha para iniciantes-intermediários
const jsMultipleChoiceIntermediate = [
  {
    title: "Métodos de array",
    description: "Qual método de array JavaScript cria um novo array com os resultados da chamada de uma função para cada elemento?",
    options: [
      { id: "a", text: "forEach()" },
      { id: "b", text: "filter()" },
      { id: "c", text: "map()" },
      { id: "d", text: "reduce()" }
    ],
    correctAnswer: "c",
    successFeedback: "Correto! O método map() transforma cada elemento do array e retorna um novo array.",
    failureFeedback: "Incorreto. O método que transforma cada elemento e retorna um novo array é map().",
    explanation: "O método map() cria um novo array aplicando uma função a cada elemento do array original. Diferente do forEach(), ele retorna um novo array com os resultados da função."
  },
  {
    title: "Funções de alta ordem",
    description: "O que é uma função de callback em JavaScript?",
    options: [
      { id: "a", text: "Uma função que é armazenada em uma variável" },
      { id: "b", text: "Uma função passada como argumento para outra função" },
      { id: "c", text: "Uma função que se chama recursivamente" },
      { id: "d", text: "Uma função que é chamada imediatamente após ser definida" }
    ],
    correctAnswer: "b",
    successFeedback: "Correto! Uma função de callback é passada como argumento para outra função.",
    failureFeedback: "Incorreto. Uma função de callback é uma função passada como argumento para outra função.",
    explanation: "Callbacks são fundamentais em JavaScript assíncrono. Elas são funções passadas como argumentos para outras funções, permitindo que código seja executado após a conclusão de operações assíncronas."
  },
  // (Adicionar mais 13 desafios JavaScript de múltipla escolha para iniciantes-intermediários)
];

// Desafios JavaScript de completar código para iniciantes-intermediários
const jsCodeCompletionIntermediate = [
  {
    title: "Manipulação de array com map",
    description: "Complete o código para duplicar cada número no array usando o método map:",
    codeTemplate: "const numeros = [1, 2, 3, 4, 5];\nconst duplicados = numeros._____((numero) => {\n  return _____;\n});\nconsole.log(duplicados); // Deve mostrar [2, 4, 6, 8, 10]",
    expectedSolution: "const numeros = [1, 2, 3, 4, 5];\nconst duplicados = numeros.map((numero) => {\n  return numero * 2;\n});\nconsole.log(duplicados); // Deve mostrar [2, 4, 6, 8, 10]",
    successFeedback: "Excelente! Você usou corretamente o método map para transformar o array.",
    hints: ["Use o método que transforma cada elemento e retorna o que deve ser feito com cada número."],
    explanation: "O método map() cria um novo array aplicando uma função a cada elemento do array original. A função passada para map recebe cada elemento e retorna o valor transformado."
  },
  {
    title: "Promises em JavaScript",
    description: "Complete o código para criar e usar uma Promise que resolve após 2 segundos:",
    codeTemplate: "const minhaPromise = new _____((_____, reject) => {\n  setTimeout(() => {\n    _____('Sucesso!');\n  }, 2000);\n});\n\nminhaPromise._____(resultado => {\n  console.log(resultado); // Deve mostrar 'Sucesso!'\n});",
    expectedSolution: "const minhaPromise = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve('Sucesso!');\n  }, 2000);\n});\n\nminhaPromise.then(resultado => {\n  console.log(resultado); // Deve mostrar 'Sucesso!'\n});",
    successFeedback: "Muito bem! Você criou e usou corretamente uma Promise.",
    hints: ["Promises exigem dois parâmetros na função executor e um método específico para lidar com o valor resolvido."],
    explanation: "Promises são objetos que representam a eventual conclusão (ou falha) de uma operação assíncrona. São criadas com new Promise() e uma função que recebe resolve e reject. O método then() é usado para tratar o sucesso."
  },
  // (Adicionar mais 13 desafios JavaScript de completar código para iniciantes-intermediários)
];

// Função para criar estrutura de desafio completo
const createChallenge = (topic, type, level, data) => {
  return {
    id: generateId(),
    topic,
    type,
    level,
    title: data.title,
    description: data.description,
    ...(type === 'multipleChoice' ? {
      options: data.options,
      correctAnswer: data.correctAnswer,
      successFeedback: data.successFeedback,
      failureFeedback: data.failureFeedback,
    } : {
      codeTemplate: data.codeTemplate,
      expectedSolution: data.expectedSolution,
      hints: data.hints,
      successFeedback: data.successFeedback,
    }),
    explanation: data.explanation,
    createdAt: new Date().toISOString()
  };
};

// Adicionar todos os desafios às respectivas categorias
// HTML
htmlMultipleChoiceBeginner.forEach(data => {
  challenges.html.push(createChallenge('html', 'multipleChoice', 'beginner', data));
});

htmlCodeCompletionBeginner.forEach(data => {
  challenges.html.push(createChallenge('html', 'codeCompletion', 'beginner', data));
});

htmlMultipleChoiceIntermediate.forEach(data => {
  challenges.html.push(createChallenge('html', 'multipleChoice', 'intermediate', data));
});

htmlCodeCompletionIntermediate.forEach(data => {
  challenges.html.push(createChallenge('html', 'codeCompletion', 'intermediate', data));
});

// CSS
cssMultipleChoiceBeginner.forEach(data => {
  challenges.css.push(createChallenge('css', 'multipleChoice', 'beginner', data));
});

cssCodeCompletionBeginner.forEach(data => {
  challenges.css.push(createChallenge('css', 'codeCompletion', 'beginner', data));
});

cssMultipleChoiceIntermediate.forEach(data => {
  challenges.css.push(createChallenge('css', 'multipleChoice', 'intermediate', data));
});

cssCodeCompletionIntermediate.forEach(data => {
  challenges.css.push(createChallenge('css', 'codeCompletion', 'intermediate', data));
});

// JavaScript
jsMultipleChoiceBeginner.forEach(data => {
  challenges.javascript.push(createChallenge('javascript', 'multipleChoice', 'beginner', data));
});

jsCodeCompletionBeginner.forEach(data => {
  challenges.javascript.push(createChallenge('javascript', 'codeCompletion', 'beginner', data));
});

jsMultipleChoiceIntermediate.forEach(data => {
  challenges.javascript.push(createChallenge('javascript', 'multipleChoice', 'intermediate', data));
});

jsCodeCompletionIntermediate.forEach(data => {
  challenges.javascript.push(createChallenge('javascript', 'codeCompletion', 'intermediate', data));
});

// Combinar todos os desafios em uma única array
const allChallenges = [
  ...challenges.html,
  ...challenges.css,
  ...challenges.javascript
];

// Salvar os desafios em um arquivo JSON
const saveChallengesToFile = async () => {
  try {
    await fs.writeFile(
      path.join(__dirname, 'challenges.json'),
      JSON.stringify(allChallenges, null, 2),
      'utf8'
    );
    console.log(`Total de ${allChallenges.length} desafios salvos com sucesso!`);
    console.log(`- HTML: ${challenges.html.length} desafios`);
    console.log(`- CSS: ${challenges.css.length} desafios`);
    console.log(`- JavaScript: ${challenges.javascript.length} desafios`);
  } catch (error) {
    console.error('Erro ao salvar os desafios:', error);
  }
};

// Executar a função para salvar os desafios
saveChallengesToFile();