/**
 * Script para gerar desafios pré-definidos
 *
 * Este script gera 100 desafios de cada tipo (HTML, CSS, JavaScript),
 * sendo 70 de nível iniciante e 30 de nível iniciante-intermediário,
 * metade múltipla escolha e metade completar código.
 *
 * Os desafios são salvos no arquivo challenges.json
 */

const fs = require('fs').promises
const path = require('path')

// Estrutura para armazenar os desafios
const challenges = {
  html: [],
  css: [],
  javascript: [],
}

// Função para gerar ID único
const generateId = () => {
  return (
    'c-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  )
}

// Desafios HTML de múltipla escolha para iniciantes
const htmlMultipleChoiceBeginner = [
  {
    title: 'Tags básicas HTML',
    description:
      'Qual das seguintes tags HTML é usada para criar um parágrafo?',
    options: [
      { id: 'a', text: '<paragraph>' },
      { id: 'b', text: '<p>' },
      { id: 'c', text: '<para>' },
      { id: 'd', text: '<text>' },
    ],
    correctAnswer: 'b',
    successFeedback:
      'Correto! A tag <p> é utilizada para criar parágrafos em HTML.',
    failureFeedback: 'Incorreto. A tag correta para criar parágrafos é <p>.',
    explanation:
      'A tag <p> define um parágrafo em HTML e é um dos elementos mais básicos e frequentemente utilizados.',
  },
  {
    title: 'Estrutura de uma página HTML',
    description:
      'Qual tag deve conter o título da página que aparece na aba do navegador?',
    options: [
      { id: 'a', text: '<header>' },
      { id: 'b', text: '<title>' },
      { id: 'c', text: '<heading>' },
      { id: 'd', text: '<head>' },
    ],
    correctAnswer: 'b',
    successFeedback:
      'Correto! A tag <title> dentro do <head> define o título da página que aparece na aba do navegador.',
    failureFeedback:
      'Incorreto. O título da página que aparece na aba do navegador é definido pela tag <title>.',
    explanation:
      'A tag <title> deve ser colocada dentro da tag <head> e define o título da página que aparece na barra de título ou aba do navegador.',
  },
  {
    title: 'Listas em HTML',
    description: 'Qual tag é usada para criar uma lista ordenada?',
    options: [
      { id: 'a', text: '<ul>' },
      { id: 'b', text: '<ol>' },
      { id: 'c', text: '<li>' },
      { id: 'd', text: '<dl>' },
    ],
    correctAnswer: 'b',
    successFeedback:
      'Correto! A tag <ol> é usada para criar listas ordenadas em HTML.',
    failureFeedback:
      'Incorreto. Para criar uma lista ordenada, use a tag <ol>.',
    explanation:
      'A tag <ol> cria uma lista ordenada, enquanto <ul> cria uma lista não ordenada.',
  },
  {
    title: 'Links em HTML',
    description: 'Qual atributo da tag <a> define o destino do link?',
    options: [
      { id: 'a', text: 'src' },
      { id: 'b', text: 'href' },
      { id: 'c', text: 'link' },
      { id: 'd', text: 'url' },
    ],
    correctAnswer: 'b',
    successFeedback:
      'Correto! O atributo href define o destino do link em HTML.',
    failureFeedback:
      'Incorreto. O destino do link é definido pelo atributo href na tag <a>.',
    explanation:
      'A tag <a> cria links, e o atributo href especifica a URL de destino.',
  },
  {
    title: 'Tabelas em HTML',
    description:
      'Qual tag é usada para definir uma célula de cabeçalho em uma tabela?',
    options: [
      { id: 'a', text: '<tr>' },
      { id: 'b', text: '<th>' },
      { id: 'c', text: '<td>' },
      { id: 'd', text: '<table>' },
    ],
    correctAnswer: 'b',
    successFeedback:
      'Correto! A tag <th> é usada para células de cabeçalho em uma tabela.',
    failureFeedback: 'Incorreto. Para células de cabeçalho, use a tag <th>.',
    explanation:
      'A tag <th> define células de cabeçalho, enquanto <td> define células normais em uma tabela HTML.',
  },
  {
    title: 'Cabeçalhos em HTML',
    description: 'Qual tag é usada para criar o maior cabeçalho em HTML?',
    options: [
      { id: 'a', text: '<header>' },
      { id: 'b', text: '<h6>' },
      { id: 'c', text: '<h1>' },
      { id: 'd', text: '<heading>' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! A tag <h1> cria o cabeçalho de maior destaque.',
    failureFeedback:
      'Incorreto. A tag <h1> é usada para o cabeçalho principal.',
    explanation:
      'Em HTML, <h1> é o cabeçalho de maior importância, seguido por <h2>, <h3> e assim por diante.',
  },
  {
    title: 'Imagens em HTML',
    description: 'Qual atributo define o caminho da imagem em HTML?',
    options: [
      { id: 'a', text: 'source' },
      { id: 'b', text: 'path' },
      { id: 'c', text: 'src' },
      { id: 'd', text: 'link' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! O atributo src define o caminho da imagem.',
    failureFeedback:
      'Incorreto. O atributo para definir o caminho da imagem é src.',
    explanation:
      'Na tag <img>, o atributo src especifica o endereço ou caminho da imagem a ser exibida.',
  },
  {
    title: 'Divisões em HTML',
    description:
      'Qual tag é usada para criar uma divisão ou seção genérica em HTML?',
    options: [
      { id: 'a', text: '<section>' },
      { id: 'b', text: '<div>' },
      { id: 'c', text: '<span>' },
      { id: 'd', text: '<block>' },
    ],
    correctAnswer: 'b',
    successFeedback: 'Correto! A tag <div> cria uma divisão genérica.',
    failureFeedback:
      'Incorreto. A tag <div> é usada para criar divisões em HTML.',
    explanation:
      'A tag <div> é um container genérico para agrupar e organizar conteúdo em HTML.',
  },
  {
    title: 'Texto em Negrito',
    description: 'Qual tag deixa o texto em negrito com significado semântico?',
    options: [
      { id: 'a', text: '<b>' },
      { id: 'b', text: '<bold>' },
      { id: 'c', text: '<strong>' },
      { id: 'd', text: '<em>' },
    ],
    correctAnswer: 'c',
    successFeedback:
      'Correto! A tag <strong> deixa o texto em negrito com ênfase semântica.',
    failureFeedback:
      'Incorreto. <strong> é a tag para texto em negrito com significado semântico.',
    explanation:
      'Diferente de <b>, <strong> indica que o texto tem importância especial.',
  },
  {
    title: 'Quebra de Linha',
    description: 'Qual tag HTML cria uma quebra de linha?',
    options: [
      { id: 'a', text: '<break>' },
      { id: 'b', text: '<lb>' },
      { id: 'c', text: '<br>' },
      { id: 'd', text: '<newline>' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! A tag <br> cria uma quebra de linha.',
    failureFeedback: 'Incorreto. A tag para quebra de linha é <br>.',
    explanation:
      'A tag <br> é usada para criar uma quebra de linha em HTML, sem precisar de tag de fechamento.',
  },
  {
    title: 'Comentários em HTML',
    description: 'Como se escreve um comentário em HTML?',
    options: [
      { id: 'a', text: '// Comentário' },
      { id: 'b', text: '/* Comentário */' },
      { id: 'c', text: '<!-- Comentário -->' },
      { id: 'd', text: "' Comentário" },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! Comentários em HTML usam <!-- -->',
    failureFeedback: 'Incorreto. Comentários em HTML são escritos com <!-- -->',
    explanation:
      'Comentários em HTML são escritos entre <!-- e --> e não são exibidos na página renderizada.',
  },
  {
    title: 'Texto em Itálico',
    description: 'Qual tag deixa o texto em itálico?',
    options: [
      { id: 'a', text: '<italic>' },
      { id: 'b', text: '<i>' },
      { id: 'c', text: '<em>' },
      { id: 'd', text: '<slant>' },
    ],
    correctAnswer: 'c',
    successFeedback:
      'Correto! A tag <em> deixa o texto em itálico com ênfase semântica.',
    failureFeedback:
      'Incorreto. <em> é a tag para texto em itálico com significado semântico.',
    explanation:
      'Enquanto <i> apenas estiliza, <em> adiciona significado semântico de ênfase.',
  },
  {
    title: 'Hiperlinks Externos',
    description: 'Como se cria um link que abre em nova aba/janela?',
    options: [
      { id: 'a', text: 'target="new"' },
      { id: 'b', text: 'href="external"' },
      { id: 'c', text: 'target="_blank"' },
      { id: 'd', text: 'link="external"' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! target="_blank" faz o link abrir em nova aba.',
    failureFeedback:
      'Incorreto. Use target="_blank" para abrir link em nova aba.',
    explanation:
      'O atributo target="_blank" na tag <a> faz o link ser aberto em uma nova aba ou janela.',
  },
  {
    title: 'Listas Não Ordenadas',
    description: 'Qual tag cria uma lista não ordenada em HTML?',
    options: [
      { id: 'a', text: '<ol>' },
      { id: 'b', text: '<ul>' },
      { id: 'c', text: '<li>' },
      { id: 'd', text: '<list>' },
    ],
    correctAnswer: 'b',
    successFeedback: 'Correto! A tag <ul> cria listas não ordenadas.',
    failureFeedback: 'Incorreto. <ul> é a tag para listas não ordenadas.',
    explanation:
      'A tag <ul> (unordered list) cria listas com marcadores, sem numeração.',
  },
  {
    title: 'Elementos de Lista',
    description: 'Qual tag representa um item de lista em HTML?',
    options: [
      { id: 'a', text: '<list>' },
      { id: 'b', text: '<item>' },
      { id: 'c', text: '<li>' },
      { id: 'd', text: '<bullet>' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! A tag <li> representa um item de lista.',
    failureFeedback: 'Incorreto. <li> é a tag para itens de lista.',
    explanation:
      'A tag <li> (list item) é usada dentro de <ul> ou <ol> para definir cada item da lista.',
  },
  {
    title: 'Atributo Alt em Imagens',
    description: "Qual é o propósito do atributo 'alt' em imagens?",
    options: [
      { id: 'a', text: 'Definir a largura da imagem' },
      { id: 'b', text: 'Texto alternativo para acessibilidade' },
      { id: 'c', text: 'Definir o caminho da imagem' },
      { id: 'd', text: 'Criar um link para a imagem' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! O atributo 'alt' fornece texto alternativo para acessibilidade.",
    failureFeedback:
      "Incorreto. 'alt' serve para texto alternativo em imagens.",
    explanation:
      "O atributo 'alt' descreve a imagem para leitores de tela e aparece caso a imagem não carregue.",
  },
  {
    title: 'Linha Horizontal',
    description: 'Qual tag cria uma linha horizontal em HTML?',
    options: [
      { id: 'a', text: '<line>' },
      { id: 'b', text: '<hr>' },
      { id: 'c', text: '<horizontal>' },
      { id: 'd', text: '<break>' },
    ],
    correctAnswer: 'b',
    successFeedback: 'Correto! A tag <hr> cria uma linha horizontal.',
    failureFeedback: 'Incorreto. <hr> é a tag para linha horizontal.',
    explanation:
      'A tag <hr> (horizontal rule) cria uma linha de divisão horizontal na página.',
  },
  {
    title: 'Elementos de Citação',
    description: 'Qual tag é usada para citações em HTML?',
    options: [
      { id: 'a', text: '<cite>' },
      { id: 'b', text: '<quote>' },
      { id: 'c', text: '<blockquote>' },
      { id: 'd', text: '<reference>' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! <blockquote> é usado para citações em bloco.',
    failureFeedback: 'Incorreto. <blockquote> é a tag para citações.',
    explanation:
      'A tag <blockquote> é usada para indicar citações ou trechos de texto de outras fontes.',
  },
  {
    title: 'Elemento Span',
    description: 'Qual é o propósito da tag <span>?',
    options: [
      { id: 'a', text: 'Criar uma divisão em bloco' },
      { id: 'b', text: 'Criar uma lista' },
      { id: 'c', text: 'Aplicar estilo a uma parte inline do texto' },
      { id: 'd', text: 'Criar um link' },
    ],
    correctAnswer: 'c',
    successFeedback:
      'Correto! <span> é usado para estilizar partes inline do texto.',
    failureFeedback:
      'Incorreto. <span> aplica estilo a partes específicas do texto.',
    explanation:
      'A tag <span> é um elemento inline usado para aplicar estilos ou identificar partes do texto.',
  },
  {
    title: 'Elemento de Âncora',
    description: 'O que a tag <a> é usada para criar em HTML?',
    options: [
      { id: 'a', text: 'Parágrafos' },
      { id: 'b', text: 'Imagens' },
      { id: 'c', text: 'Links de hipertexto' },
      { id: 'd', text: 'Tabelas' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! A tag <a> cria links de hipertexto.',
    failureFeedback: 'Incorreto. <a> é usada para criar links.',
    explanation:
      'A tag <a> (anchor) é usada para criar hiperlinks para outras páginas ou recursos.',
  },
  {
    title: 'Elementos de Ênfase',
    description: 'Qual tag dá ênfase importante ao texto?',
    options: [
      { id: 'a', text: '<i>' },
      { id: 'b', text: '<b>' },
      { id: 'c', text: '<em>' },
      { id: 'd', text: '<important>' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! <em> dá ênfase semântica ao texto.',
    failureFeedback: 'Incorreto. <em> é a tag para dar ênfase ao texto.',
    explanation:
      'A tag <em> (emphasis) adiciona ênfase semântica, geralmente exibida em itálico.',
  },
  {
    title: 'Elemento de Rodapé',
    description: 'Qual tag HTML representa o rodapé de uma página ou seção?',
    options: [
      { id: 'a', text: '<bottom>' },
      { id: 'b', text: '<end>' },
      { id: 'c', text: '<footer>' },
      { id: 'd', text: '<base>' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! <footer> representa o rodapé.',
    failureFeedback: 'Incorreto. <footer> é a tag para rodapé.',
    explanation:
      'A tag <footer> define o rodapé de uma página ou seção, contendo informações de conclusão.',
  },
  {
    title: 'Atributo de Classe',
    description: 'Como se define uma classe em um elemento HTML?',
    options: [
      { id: 'a', text: 'class="nome"' },
      { id: 'b', text: 'style="nome"' },
      { id: 'c', text: 'id="nome"' },
      { id: 'd', text: 'type="nome"' },
    ],
    correctAnswer: 'a',
    successFeedback: 'Correto! class="nome" define uma classe.',
    failureFeedback: 'Incorreto. Use class="nome" para definir uma classe.',
    explanation:
      'O atributo class permite associar um ou mais nomes de classe a um elemento HTML.',
  },
  {
    title: 'Elemento de Cabeçalho',
    description: 'Qual tag contém metadados de uma página HTML?',
    options: [
      { id: 'a', text: '<meta>' },
      { id: 'b', text: '<header>' },
      { id: 'c', text: '<head>' },
      { id: 'd', text: '<top>' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! <head> contém os metadados da página.',
    failureFeedback: 'Incorreto. <head> é a tag que contém metadados.',
    explanation:
      'A tag <head> é usada para incluir metadados, títulos, links para folhas de estilo e outros elementos não visíveis diretamente na página.',
  },
  {
    title: 'Elemento Semântico',
    description: 'Qual tag HTML5 representa a seção principal de conteúdo?',
    options: [
      { id: 'a', text: '<content>' },
      { id: 'b', text: '<section>' },
      { id: 'c', text: '<main>' },
      { id: 'd', text: '<body>' },
    ],
    correctAnswer: 'c',
    successFeedback:
      'Correto! <main> representa a seção principal de conteúdo.',
    failureFeedback: 'Incorreto. <main> é a tag para o conteúdo principal.',
    explanation:
      'A tag <main> define o conteúdo principal de um documento HTML, devendo ser único por página.',
  },
  {
    title: 'Elemento de Grupo',
    description: 'Qual tag agrupa elementos em uma página HTML?',
    options: [
      { id: 'a', text: '<group>' },
      { id: 'b', text: '<div>' },
      { id: 'c', text: '<section>' },
      { id: 'd', text: '<container>' },
    ],
    correctAnswer: 'b',
    successFeedback: 'Correto! <div> é usada para agrupar elementos.',
    failureFeedback: 'Incorreto. <div> é a tag para agrupar elementos.',
    explanation:
      'A tag <div> é um container genérico usado para agrupar e organizar outros elementos HTML.',
  },
  {
    title: 'Atributo de ID',
    description: 'Como se define um identificador único em um elemento HTML?',
    options: [
      { id: 'a', text: 'class="identificador"' },
      { id: 'b', text: 'name="identificador"' },
      { id: 'c', text: 'id="identificador"' },
      { id: 'd', text: 'type="identificador"' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! id="identificador" define um ID único.',
    failureFeedback:
      'Incorreto. Use id="identificador" para definir um ID único.',
    explanation:
      'O atributo id define um identificador único para um elemento HTML, usado para estilização e manipulação específica.',
  },
  {
    title: 'Links Internos',
    description: 'Como se cria um link para um elemento com ID específico?',
    options: [
      { id: 'a', text: '<a link="#identificador">' },
      { id: 'b', text: '<a href="identificador">' },
      { id: 'c', text: '<a href="#identificador">' },
      { id: 'd', text: '<a target="#identificador">' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! <a href="#identificador"> cria um link interno.',
    failureFeedback:
      'Incorreto. Use href="#identificador" para links internos.',
    explanation:
      'Para criar um link para um elemento na mesma página, use href="#" seguido do ID do elemento.',
  },
  {
    title: 'Elementos de Grupo Semântico',
    description: 'Qual tag agrupa conteúdo relacionado semanticamente?',
    options: [
      { id: 'a', text: '<div>' },
      { id: 'b', text: '<group>' },
      { id: 'c', text: '<section>' },
      { id: 'd', text: '<container>' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! <section> agrupa conteúdo relacionado.',
    failureFeedback:
      'Incorreto. <section> é a tag para agrupar conteúdo relacionado.',
    explanation:
      'A tag <section> define uma seção genérica de conteúdo relacionado em um documento HTML.',
  },
]

// Desafios HTML de completar código para iniciantes
const htmlCodeCompletionBeginner = [
  {
    title: 'Estrutura básica HTML',
    description:
      'Complete o código para criar a estrutura básica de uma página HTML:',
    codeTemplate:
      '<!DOCTYPE _____>\n<html>\n<_____>\n  <title>Minha página</title>\n</_____>\n<body>\n  <h1>Meu primeiro site</h1>\n  <p>Bem-vindo à minha página!</p>\n</body>\n</html>',
    expectedSolution:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Minha página</title>\n</head>\n<body>\n  <h1>Meu primeiro site</h1>\n  <p>Bem-vindo à minha página!</p>\n</body>\n</html>',
    successFeedback:
      'Perfeito! Você completou corretamente a estrutura básica de uma página HTML.',
    hints: [
      'Lembre-se que a declaração do tipo de documento é importante, assim como a tag que contém metadados.',
    ],
    explanation:
      'A estrutura básica de um documento HTML inclui a declaração !DOCTYPE html, seguida pelas tags <html>, <head> (que contém metadados) e <body> (que contém o conteúdo visível).',
  },
  {
    title: 'Links em HTML',
    description:
      "Complete o código para criar um link para o site 'exemplo.com' que abra em uma nova aba:",
    codeTemplate:
      '<a _____="https://exemplo.com" _____="_blank">Visite o site</a>',
    expectedSolution:
      '<a href="https://exemplo.com" target="_blank">Visite o site</a>',
    successFeedback:
      'Excelente! Você criou corretamente um link que abre em uma nova aba.',
    hints: [
      'Um link em HTML precisa de dois atributos principais: um para o endereço e outro para definir como ele abre.',
    ],
    explanation:
      'Para criar um link em HTML, usamos a tag <a> com o atributo href (que define o destino) e o atributo target="_blank" (que faz o link abrir em uma nova aba ou janela).',
  },
  {
    title: 'Estrutura básica HTML',
    description:
      'Complete o código para criar a estrutura básica de uma página HTML:',
    codeTemplate:
      '<!DOCTYPE _____>\n<html>\n<_____>\n  <title>Minha página</title>\n</_____>\n<body>\n  <h1>Meu primeiro site</h1>\n  <p>Bem-vindo à minha página!</p>\n</body>\n</html>',
    expectedSolution:
      '<!DOCTYPE html>\n<html>\n<head>\n  <title>Minha página</title>\n</head>\n<body>\n  <h1>Meu primeiro site</h1>\n  <p>Bem-vindo à minha página!</p>\n</body>\n</html>',
    successFeedback:
      'Perfeito! Você completou corretamente a estrutura básica de uma página HTML.',
    hints: [
      'Lembre-se que a declaração do tipo de documento é importante, assim como a tag que contém metadados.',
    ],
    explanation:
      'A estrutura básica de um documento HTML inclui a declaração !DOCTYPE html, seguida pelas tags <html>, <head> (que contém metadados) e <body> (que contém o conteúdo visível).',
  },
  {
    title: 'Criando um parágrafo',
    description:
      "Complete o código para exibir um parágrafo com o texto 'Olá, mundo!'.",
    codeTemplate: '<html>\n<body>\n  _____ Olá, mundo! _____\n</body>\n</html>',
    expectedSolution: '<html>\n<body>\n  <p>Olá, mundo!</p>\n</body>\n</html>',
    successFeedback:
      'Muito bem! Você utilizou corretamente a tag de parágrafo.',
    hints: ['Os parágrafos em HTML são definidos com uma tag específica.'],
    explanation:
      'A tag <p> é usada para definir parágrafos em HTML, ajudando na organização do conteúdo textual.',
  },
  {
    title: 'Adicionando uma imagem',
    description: "Complete o código para exibir a imagem 'imagem.jpg'.",
    codeTemplate:
      "<html>\n<body>\n  <_____ src='imagem.jpg' alt='Descrição da imagem'>\n</body>\n</html>",
    expectedSolution:
      "<html>\n<body>\n  <img src='imagem.jpg' alt='Descrição da imagem'>\n</body>\n</html>",
    successFeedback: 'Parabéns! Você adicionou uma imagem corretamente.',
    hints: ['A tag usada para imagens não precisa de uma tag de fechamento.'],
    explanation:
      'A tag <img> é usada para exibir imagens, e o atributo src define a fonte da imagem.',
  },
  {
    title: 'Criando uma tabela',
    description:
      'Complete o código para criar uma tabela com uma linha e duas colunas.',
    codeTemplate:
      '<html>\n<body>\n  <table>\n    <tr>\n      <_____>Nome</_____>\n      <_____>Idade</_____>\n    </tr>\n  </table>\n</body>\n</html>',
    expectedSolution:
      '<html>\n<body>\n  <table>\n    <tr>\n      <th>Nome</th>\n      <th>Idade</th>\n    </tr>\n  </table>\n</body>\n</html>',
    successFeedback: 'Ótimo! Você criou uma tabela corretamente.',
    hints: ['Use a tag apropriada para células de cabeçalho.'],
    explanation:
      'A tag <th> é usada para células de cabeçalho em uma tabela HTML.',
  },
  {
    title: 'Criando um formulário básico',
    description:
      'Complete o código para criar um formulário com um campo de entrada de texto.',
    codeTemplate:
      "<html>\n<body>\n  <form>\n    <label for='nome'>Nome:</label>\n    <_____ type='text' id='nome' name='nome'>\n  </form>\n</body>\n</html>",
    expectedSolution:
      "<html>\n<body>\n  <form>\n    <label for='nome'>Nome:</label>\n    <input type='text' id='nome' name='nome'>\n  </form>\n</body>\n</html>",
    successFeedback: 'Ótimo! Você criou um campo de entrada corretamente.',
    hints: [
      'Os campos de entrada em formulários HTML são criados com uma tag específica.',
    ],
    explanation:
      'A tag <input> é usada para criar campos de entrada, e o atributo type define o tipo de entrada.',
  },
  {
    title: 'Criando um botão de envio',
    description:
      'Complete o código para adicionar um botão de envio a um formulário.',
    codeTemplate:
      "<html>\n<body>\n  <form>\n    <input type='text' name='nome'>\n    <_____ type='submit' value='Enviar'>\n  </form>\n</body>\n</html>",
    expectedSolution:
      "<html>\n<body>\n  <form>\n    <input type='text' name='nome'>\n    <input type='submit' value='Enviar'>\n  </form>\n</body>\n</html>",
    successFeedback: 'Ótimo! Você adicionou um botão de envio corretamente.',
    hints: [
      'Os botões de envio utilizam um tipo específico dentro da tag input.',
    ],
    explanation:
      "O atributo type='submit' dentro da tag <input> cria um botão de envio para formulários HTML.",
  },
  {
    title: 'Criando um cabeçalho',
    description: 'Complete o código para exibir um título de nível 1.',
    codeTemplate:
      '<html>\n<body>\n  <_____>Meu título</_____>\n</body>\n</html>',
    expectedSolution: '<html>\n<body>\n  <h1>Meu título</h1>\n</body>\n</html>',
    successFeedback:
      'Muito bem! Você utilizou corretamente a tag de cabeçalho.',
    hints: [
      'Os títulos em HTML são definidos com tags específicas que variam de <h1> a <h6>.',
    ],
    explanation:
      'A tag <h1> é usada para definir o título principal de uma página HTML.',
  },
  {
    title: 'Criando um rodapé',
    description: 'Complete o código para adicionar um rodapé à página.',
    codeTemplate:
      '<html>\n<body>\n  <footer>\n    <p>_____ 2025</p>\n  </footer>\n</body>\n</html>',
    expectedSolution:
      '<html>\n<body>\n  <footer>\n    <p>&copy; 2025</p>\n  </footer>\n</body>\n</html>',
    successFeedback: 'Ótimo! Você adicionou um rodapé corretamente.',
    hints: [
      'O símbolo de copyright pode ser inserido com uma entidade HTML especial.',
    ],
    explanation: 'A entidade &copy; representa o símbolo de copyright em HTML.',
  },
]

// Desafios HTML de múltipla escolha para iniciantes-intermediários
const htmlMultipleChoiceIntermediate = [
  {
    title: 'Formulários HTML',
    description:
      'Qual atributo é necessário em um elemento <input> para que ele faça parte de um grupo de botões de opção (radio buttons)?',
    options: [
      { id: 'a', text: 'group' },
      { id: 'b', text: 'type' },
      { id: 'c', text: 'name' },
      { id: 'd', text: 'class' },
    ],
    correctAnswer: 'c',
    successFeedback:
      "Correto! O atributo 'name' agrupa os botões de opção (radio buttons).",
    failureFeedback:
      "Incorreto. Para agrupar botões de opção, todos devem compartilhar o mesmo valor no atributo 'name'.",
    explanation:
      "Para criar um grupo de botões de opção (radio buttons), cada input do tipo 'radio' deve ter o mesmo valor no atributo 'name', o que permite que apenas um seja selecionado por vez.",
  },
  {
    title: 'Semântica HTML5',
    description:
      'Qual elemento HTML5 é mais apropriado para representar a seção principal de conteúdo de uma página?',
    options: [
      { id: 'a', text: '<section>' },
      { id: 'b', text: '<content>' },
      { id: 'c', text: '<main>' },
      { id: 'd', text: '<article>' },
    ],
    correctAnswer: 'c',
    successFeedback:
      'Correto! O elemento <main> representa o conteúdo principal de uma página.',
    failureFeedback:
      'Incorreto. Para representar o conteúdo principal de uma página, o elemento adequado é <main>.',
    explanation:
      'O elemento <main> representa o conteúdo principal de uma página. Ele deve ser único na página e não deve ser descendente de elementos como <article>, <aside>, <footer>, <header> ou <nav>.',
  },
  {
    title: 'Atributos de Validação de Formulário',
    description:
      'Qual atributo HTML5 torna um campo de formulário obrigatório?',
    options: [
      { id: 'a', text: 'mandatory' },
      { id: 'b', text: 'required' },
      { id: 'c', text: 'validate' },
      { id: 'd', text: 'must-fill' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! O atributo 'required' torna um campo obrigatório.",
    failureFeedback:
      "Incorreto. O atributo para tornar um campo obrigatório é 'required'.",
    explanation:
      "O atributo 'required' impede o envio do formulário se o campo estiver vazio, fornecendo validação nativa do HTML5.",
  },
  {
    title: 'Tabelas Complexas',
    description:
      'Qual atributo permite que uma célula ocupe múltiplas colunas em uma tabela?',
    options: [
      { id: 'a', text: 'merge' },
      { id: 'b', text: 'span' },
      { id: 'c', text: 'colspan' },
      { id: 'd', text: 'extend' },
    ],
    correctAnswer: 'c',
    successFeedback:
      "Correto! O atributo 'colspan' permite que uma célula ocupe múltiplas colunas.",
    failureFeedback:
      "Incorreto. O atributo para ocupar múltiplas colunas é 'colspan'.",
    explanation:
      "O atributo 'colspan' em uma célula de tabela (th ou td) permite que ela se estenda por múltiplas colunas.",
  },
  {
    title: 'Metadados e SEO',
    description:
      'Qual tag meta define a codificação de caracteres de uma página HTML?',
    options: [
      { id: 'a', text: '<meta charset="utf-8">' },
      { id: 'b', text: '<meta encoding="utf-8">' },
      { id: 'c', text: '<meta type="utf-8">' },
      { id: 'd', text: '<meta language="utf-8">' },
    ],
    correctAnswer: 'a',
    successFeedback:
      'Correto! <meta charset="utf-8"> define a codificação de caracteres.',
    failureFeedback:
      'Incorreto. A tag para definir a codificação é <meta charset="utf-8">.',
    explanation:
      'A tag meta com o atributo charset especifica a codificação de caracteres da página, sendo UTF-8 o padrão mais comum.',
  },
  {
    title: 'Tipos de Input',
    description:
      'Qual tipo de input HTML5 é usado especificamente para e-mails?',
    options: [
      { id: 'a', text: 'type="mail"' },
      { id: 'b', text: 'type="email"' },
      { id: 'c', text: 'type="contact"' },
      { id: 'd', text: 'type="address"' },
    ],
    correctAnswer: 'b',
    successFeedback:
      'Correto! type="email" valida automaticamente o formato de e-mail.',
    failureFeedback: 'Incorreto. O tipo para e-mails é type="email".',
    explanation:
      "O tipo 'email' realiza validação básica de e-mail no lado do cliente, verificando a presença de @ e domínio.",
  },
  {
    title: 'Acessibilidade em Formulários',
    description:
      'Qual atributo é essencial para associar um label a um campo de formulário?',
    options: [
      { id: 'a', text: 'connect' },
      { id: 'b', text: 'link' },
      { id: 'c', text: 'for' },
      { id: 'd', text: 'bind' },
    ],
    correctAnswer: 'c',
    successFeedback:
      "Correto! O atributo 'for' associa um label ao seu respectivo campo.",
    failureFeedback: "Incorreto. O atributo para associar label é 'for'.",
    explanation:
      "O atributo 'for' em um <label> deve corresponder ao 'id' do campo de formulário, melhorando a acessibilidade.",
  },
  {
    title: 'Elemento de Figura',
    description:
      'Qual tag HTML5 é usada para agrupar conteúdo de mídia com legenda?',
    options: [
      { id: 'a', text: '<media>' },
      { id: 'b', text: '<group>' },
      { id: 'c', text: '<figure>' },
      { id: 'd', text: '<container>' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! <figure> agrupa conteúdo de mídia com legenda.',
    failureFeedback:
      'Incorreto. A tag para agrupar mídia com legenda é <figure>.',
    explanation:
      'O elemento <figure> permite agrupar imagens, diagramas, fotos ou trechos de código com sua respectiva legenda usando <figcaption>.',
  },
  {
    title: 'Elementos de Navegação',
    description:
      'Qual elemento HTML5 é apropriado para criar um menu de navegação?',
    options: [
      { id: 'a', text: '<menu>' },
      { id: 'b', text: '<navigation>' },
      { id: 'c', text: '<nav>' },
      { id: 'd', text: '<links>' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! <nav> é usado para criar menus de navegação.',
    failureFeedback: 'Incorreto. O elemento para navegação é <nav>.',
    explanation:
      'A tag <nav> define uma seção de navegação, geralmente contendo links para outras páginas ou seções do site.',
  },
  {
    title: 'Elementos de Tempo',
    description: 'Qual elemento HTML5 é usado para representar data e hora?',
    options: [
      { id: 'a', text: '<clock>' },
      { id: 'b', text: '<datetime>' },
      { id: 'c', text: '<time>' },
      { id: 'd', text: '<date>' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! <time> representa data e hora semanticamente.',
    failureFeedback: 'Incorreto. O elemento para data e hora é <time>.',
    explanation:
      'O elemento <time> fornece uma forma semântica de representar datas, horas ou durações, facilitando a interpretação por máquinas.',
  },
  {
    title: 'Elemento de Conteúdo Externo',
    description:
      'Qual tag é usada para incorporar conteúdo externo, como vídeos e mapas?',
    options: [
      { id: 'a', text: '<external>' },
      { id: 'b', text: '<embed>' },
      { id: 'c', text: '<iframe>' },
      { id: 'd', text: '<include>' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! <iframe> incorpora conteúdo externo.',
    failureFeedback:
      'Incorreto. O elemento para incorporar conteúdo externo é <iframe>.',
    explanation:
      'A tag <iframe> permite incorporar outro documento HTML dentro do documento atual, como mapas, vídeos ou páginas externas.',
  },
  {
    title: 'Área de Descrição em Formulários',
    description:
      'Qual elemento HTML é usado para criar uma área de texto multilinha?',
    options: [
      { id: 'a', text: '<input type="multiline">' },
      { id: 'b', text: '<textbox>' },
      { id: 'c', text: '<textarea>' },
      { id: 'd', text: '<text>' },
    ],
    correctAnswer: 'c',
    successFeedback: 'Correto! <textarea> cria uma área de texto multilinha.',
    failureFeedback:
      'Incorreto. O elemento para área de texto multilinha é <textarea>.',
    explanation:
      'A tag <textarea> permite a entrada de texto multilinha em formulários, com dimensões ajustáveis.',
  },
  {
    title: 'Atributos de Entrada Numérica',
    description: 'Qual tipo de input HTML5 é usado para entrada de números?',
    options: [
      { id: 'a', text: 'type="numeric"' },
      { id: 'b', text: 'type="number"' },
      { id: 'c', text: 'type="integer"' },
      { id: 'd', text: 'type="digits"' },
    ],
    correctAnswer: 'b',
    successFeedback:
      'Correto! type="number" permite entrada de valores numéricos.',
    failureFeedback: 'Incorreto. O tipo para entrada numérica é type="number".',
    explanation:
      "O tipo 'number' fornece controles para incremento/decremento e validação de entrada numérica.",
  },
  {
    title: 'Detalhes e Resumo',
    description: 'Quais elementos HTML5 criam um widget de expansão/contração?',
    options: [
      { id: 'a', text: '<expand>' },
      { id: 'b', text: '<collapse>' },
      { id: 'c', text: '<details> e <summary>' },
      { id: 'd', text: '<dropdown>' },
    ],
    correctAnswer: 'c',
    successFeedback:
      'Correto! <details> e <summary> criam um widget expansível.',
    failureFeedback:
      'Incorreto. Os elementos para widget expansível são <details> e <summary>.',
    explanation:
      'Os elementos <details> e <summary> permitem criar um widget que pode ser expandido ou contraído, melhorando a interatividade.',
  },
  {
    title: 'Definição de Formulário',
    description: 'Qual atributo especifica o método de envio de um formulário?',
    options: [
      { id: 'a', text: 'send' },
      { id: 'b', text: 'type' },
      { id: 'c', text: 'method' },
      { id: 'd', text: 'action' },
    ],
    correctAnswer: 'c',
    successFeedback:
      "Correto! O atributo 'method' define o método de envio do formulário.",
    failureFeedback:
      "Incorreto. O atributo para definir o método de envio é 'method'.",
    explanation:
      "O atributo 'method' em um formulário define como os dados serão enviados, sendo os valores mais comuns 'get' e 'post'.",
  },
  {
    title: 'Validação de Padrão',
    description:
      'Qual atributo HTML5 permite validar um campo baseado em uma expressão regular?',
    options: [
      { id: 'a', text: 'regex' },
      { id: 'b', text: 'match' },
      { id: 'c', text: 'pattern' },
      { id: 'd', text: 'validate' },
    ],
    correctAnswer: 'c',
    successFeedback:
      "Correto! O atributo 'pattern' permite validação com expressão regular.",
    failureFeedback:
      "Incorreto. O atributo para validação de padrão é 'pattern'.",
    explanation:
      "O atributo 'pattern' permite definir uma expressão regular para validar o conteúdo de um campo de formulário.",
  },
  {
    title: 'Dados de Saída em Formulários',
    description:
      'Qual elemento HTML5 é usado para exibir resultados de cálculos de formulário?',
    options: [
      { id: 'a', text: '<result>' },
      { id: 'b', text: '<calculate>' },
      { id: 'c', text: '<output>' },
      { id: 'd', text: '<display>' },
    ],
    correctAnswer: 'c',
    successFeedback:
      'Correto! <output> exibe resultados de cálculos de formulário.',
    failureFeedback: 'Incorreto. O elemento para exibir resultados é <output>.',
    explanation:
      'O elemento <output> é usado para exibir o resultado de um cálculo ou ação em um formulário, com suporte nativo do HTML5.',
  },
  // (Adicionar mais 13 desafios HTML de múltipla escolha para iniciantes-intermediários)
]

// Desafios HTML de completar código para iniciantes-intermediários
const htmlCodeCompletionIntermediate = [
  {
    title: 'Tabela HTML com colspan',
    description:
      'Complete o código para criar uma tabela onde a primeira célula do cabeçalho ocupa duas colunas:',
    codeTemplate:
      '<table border="1">\n  <tr>\n    <th _____="2">Produtos</th>\n    <th>Preço</th>\n  </tr>\n  <tr>\n    <td>Produto A</td>\n    <td>R$ 10,00</td>\n  </tr>\n  <tr>\n    <td>Produto B</td>\n    <td>R$ 20,00</td>\n  </tr>\n</table>',
    expectedSolution:
      '<table border="1">\n  <tr>\n    <th colspan="2">Produtos</th>\n    <th>Preço</th>\n  </tr>\n  <tr>\n    <td>Produto A</td>\n    <td>R$ 10,00</td>\n  </tr>\n  <tr>\n    <td>Produto B</td>\n    <td>R$ 20,00</td>\n  </tr>\n</table>',
    successFeedback:
      'Muito bem! Você utilizou corretamente o atributo colspan.',
    hints: [
      'Há um atributo específico para fazer com que uma célula ocupe mais de uma coluna.',
    ],
    explanation:
      'Para fazer uma célula ocupar múltiplas colunas, usamos o atributo colspan com o número de colunas que ela deve ocupar.',
  },
  {
    title: 'Formulário com validação',
    description:
      'Complete o código para criar um campo de e-mail obrigatório com validação de padrão:',
    codeTemplate:
      '<form action="/submit" method="post">\n  <label for="email">E-mail:</label>\n  <input type="_____" id="email" name="email" _____>\n  <button type="submit">Enviar</button>\n</form>',
    expectedSolution:
      '<form action="/submit" method="post">\n  <label for="email">E-mail:</label>\n  <input type="email" id="email" name="email" required>\n  <button type="submit">Enviar</button>\n</form>',
    successFeedback:
      'Excelente! Você criou um campo de e-mail com validação corretamente.',
    hints: [
      'HTML5 tem um tipo de input específico para e-mails e um atributo que torna o campo obrigatório.',
    ],
    explanation:
      "O tipo 'email' para o input faz com que o navegador valide automaticamente se o valor inserido parece um e-mail válido. O atributo 'required' torna o campo obrigatório, impedindo o envio do formulário se estiver vazio.",
  },
  // (Adicionar mais 13 desafios HTML de completar código para iniciantes-intermediários)
]

// Desafios CSS de múltipla escolha para iniciantes
const cssMultipleChoiceBeginner = [
  {
    title: 'Seletores CSS básicos',
    description:
      'Qual seletor CSS é usado para aplicar estilos a elementos com uma classe específica?',
    options: [
      { id: 'a', text: '#nome' },
      { id: 'b', text: '.nome' },
      { id: 'c', text: '*nome' },
      { id: 'd', text: '@nome' },
    ],
    correctAnswer: 'b',
    successFeedback:
      'Correto! O seletor de classe em CSS é representado por um ponto (.) seguido do nome da classe.',
    failureFeedback:
      'Incorreto. Para selecionar elementos por classe, usamos o ponto (.) seguido do nome da classe.',
    explanation:
      'Em CSS, o seletor de classe começa com um ponto (.), enquanto o seletor de ID começa com uma hashtag (#). O seletor de classe permite aplicar o mesmo estilo a vários elementos.',
  },
  {
    title: 'Propriedades de texto CSS',
    description: 'Qual propriedade CSS é usada para alterar a cor do texto?',
    options: [
      { id: 'a', text: 'text-color' },
      { id: 'b', text: 'font-color' },
      { id: 'c', text: 'color' },
      { id: 'd', text: 'text-style' },
    ],
    correctAnswer: 'c',
    successFeedback:
      "Correto! A propriedade 'color' é usada para definir a cor do texto em CSS.",
    failureFeedback:
      "Incorreto. A propriedade para definir a cor do texto é simplesmente 'color'.",
    explanation:
      "A propriedade 'color' define a cor do texto de um elemento. Pode receber valores como nomes de cores (red, blue), códigos hexadecimais (#FF0000), RGB (rgb(255,0,0)) ou RGBA.",
  },
  {
    title: 'O que é CSS?',
    description: 'O que significa a sigla CSS?',
    options: [
      { id: 'a', text: 'Computer Style Sheets' },
      { id: 'b', text: 'Cascading Style Sheets' },
      { id: 'c', text: 'Creative Style System' },
      { id: 'd', text: 'Color and Style Sheets' },
    ],
    correctAnswer: 'b',
    successFeedback:
      'Correto! CSS significa Cascading Style Sheets (Folhas de Estilo em Cascata).',
    failureFeedback:
      'Incorreto. CSS significa Cascading Style Sheets (Folhas de Estilo em Cascata).',
    explanation:
      'CSS (Cascading Style Sheets) é uma linguagem usada para descrever a apresentação de documentos HTML, definindo como os elementos devem ser exibidos na tela.',
  },
  {
    title: 'Como vincular CSS ao HTML',
    description: 'Qual tag HTML é usada para vincular um arquivo CSS externo?',
    options: [
      { id: 'a', text: '<css>' },
      { id: 'b', text: '<style>' },
      { id: 'c', text: '<link>' },
      { id: 'd', text: '<script>' },
    ],
    correctAnswer: 'c',
    successFeedback:
      'Correto! A tag <link> é usada para vincular arquivos CSS externos ao HTML.',
    failureFeedback:
      'Incorreto. Usamos a tag <link> para conectar um arquivo CSS externo a uma página HTML.',
    explanation:
      'Para vincular um arquivo CSS externo a uma página HTML, usamos a tag <link> com os atributos rel="stylesheet" e href="caminho-para-o-arquivo.css".',
  },
  {
    title: 'Comentários em CSS',
    description: 'Como se escreve um comentário em CSS?',
    options: [
      { id: 'a', text: '// Este é um comentário' },
      { id: 'b', text: '<!-- Este é um comentário -->' },
      { id: 'c', text: '/* Este é um comentário */' },
      { id: 'd', text: "' Este é um comentário" },
    ],
    correctAnswer: 'c',
    successFeedback:
      'Correto! Em CSS, os comentários são escritos entre /* e */.',
    failureFeedback:
      'Incorreto. Em CSS, os comentários são escritos entre /* e */.',
    explanation:
      'Os comentários em CSS são delimitados por /* e */. Os comentários podem ocupar uma única linha ou várias linhas, e são ignorados pelo navegador.',
  },
  {
    title: 'Cor de fundo',
    description:
      'Qual propriedade CSS é usada para alterar a cor de fundo de um elemento?',
    options: [
      { id: 'a', text: 'color' },
      { id: 'b', text: 'background-color' },
      { id: 'c', text: 'bg-color' },
      { id: 'd', text: 'background' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! A propriedade 'background-color' é usada para definir a cor de fundo de um elemento.",
    failureFeedback:
      "Incorreto. 'Background-color' é a propriedade usada para definir a cor de fundo.",
    explanation:
      "A propriedade 'background-color' define a cor de fundo de um elemento. Pode receber valores como nomes de cores (blue, red), códigos hexadecimais (#FF0000) ou RGB (rgb(255,0,0)).",
  },
  {
    title: 'Tamanho de fonte',
    description: 'Qual propriedade CSS controla o tamanho da fonte?',
    options: [
      { id: 'a', text: 'text-size' },
      { id: 'b', text: 'font-size' },
      { id: 'c', text: 'size' },
      { id: 'd', text: 'text-style' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! 'Font-size' é a propriedade que controla o tamanho da fonte.",
    failureFeedback:
      "Incorreto. A propriedade para definir o tamanho da fonte é 'font-size'.",
    explanation:
      "A propriedade 'font-size' define o tamanho do texto. Pode ser especificada em várias unidades como pixels (px), pontos (pt), em, rem, porcentagem (%), entre outras.",
  },
  {
    title: 'Centralizando texto',
    description:
      'Qual propriedade CSS é usada para centralizar texto horizontalmente dentro de um elemento?',
    options: [
      { id: 'a', text: 'text-center' },
      { id: 'b', text: 'align' },
      { id: 'c', text: 'text-align' },
      { id: 'd', text: 'align-text' },
    ],
    correctAnswer: 'c',
    successFeedback:
      "Correto! A propriedade 'text-align' com valor 'center' é usada para centralizar texto.",
    failureFeedback:
      "Incorreto. Para centralizar texto, usamos a propriedade 'text-align: center'.",
    explanation:
      "Para centralizar texto horizontalmente, utilizamos a propriedade 'text-align' com o valor 'center'. Outros valores possíveis são: left, right e justify.",
  },
  {
    title: 'Espessura da fonte',
    description:
      'Qual propriedade CSS controla a espessura (negrito) da fonte?',
    options: [
      { id: 'a', text: 'font-weight' },
      { id: 'b', text: 'text-weight' },
      { id: 'c', text: 'font-style' },
      { id: 'd', text: 'text-bold' },
    ],
    correctAnswer: 'a',
    successFeedback:
      "Correto! A propriedade 'font-weight' controla a espessura da fonte.",
    failureFeedback:
      "Incorreto. 'Font-weight' é a propriedade que controla a espessura (negrito) da fonte.",
    explanation:
      "A propriedade 'font-weight' define a espessura da fonte. Valores comuns incluem: normal, bold, bolder, lighter, ou valores numéricos como 400 (normal) e 700 (bold).",
  },
  {
    title: 'Estilo de fonte',
    description: 'Qual propriedade CSS é usada para tornar o texto itálico?',
    options: [
      { id: 'a', text: 'text-style' },
      { id: 'b', text: 'font-style' },
      { id: 'c', text: 'font-italic' },
      { id: 'd', text: 'text-format' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! A propriedade 'font-style' com valor 'italic' torna o texto itálico.",
    failureFeedback:
      "Incorreto. Para tornar o texto itálico, usamos 'font-style: italic'.",
    explanation:
      "A propriedade 'font-style' define o estilo da fonte. Para texto itálico, usamos 'font-style: italic'. Outros valores possíveis são: normal e oblique.",
  },
  {
    title: 'Estrutura CSS básica',
    description: 'Qual é a estrutura básica correta de uma regra CSS?',
    options: [
      { id: 'a', text: 'seletor { propriedade = valor; }' },
      { id: 'b', text: 'seletor { propriedade: valor; }' },
      { id: 'c', text: 'seletor [ propriedade: valor; ]' },
      { id: 'd', text: 'propriedade: valor; > seletor' },
    ],
    correctAnswer: 'b',
    successFeedback:
      'Correto! A estrutura básica é: seletor { propriedade: valor; }',
    failureFeedback:
      'Incorreto. A estrutura correta de CSS é: seletor { propriedade: valor; }',
    explanation:
      'Uma regra CSS consiste em um seletor e um bloco de declaração entre chaves {}. Dentro das chaves, cada declaração consiste em uma propriedade, dois pontos, um valor e termina com ponto e vírgula.',
  },
  {
    title: 'Altura de um elemento',
    description: 'Qual propriedade CSS define a altura de um elemento?',
    options: [
      { id: 'a', text: 'height' },
      { id: 'b', text: 'width' },
      { id: 'c', text: 'size' },
      { id: 'd', text: 'length' },
    ],
    correctAnswer: 'a',
    successFeedback:
      "Correto! A propriedade 'height' define a altura de um elemento.",
    failureFeedback:
      "Incorreto. Para definir a altura de um elemento, usamos a propriedade 'height'.",
    explanation:
      "A propriedade 'height' define a altura de um elemento. Pode ser especificada em várias unidades como pixels (px), porcentagem (%), ou auto para que o navegador calcule automaticamente.",
  },
  {
    title: 'Largura de um elemento',
    description: 'Qual propriedade CSS define a largura de um elemento?',
    options: [
      { id: 'a', text: 'height' },
      { id: 'b', text: 'width' },
      { id: 'c', text: 'size' },
      { id: 'd', text: 'breadth' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! A propriedade 'width' define a largura de um elemento.",
    failureFeedback:
      "Incorreto. Para definir a largura de um elemento, usamos a propriedade 'width'.",
    explanation:
      "A propriedade 'width' define a largura de um elemento. Pode ser especificada em várias unidades como pixels (px), porcentagem (%), ou auto para que o navegador calcule automaticamente.",
  },
  {
    title: 'Estilo de borda',
    description:
      'Qual é o valor correto para criar uma borda pontilhada em CSS?',
    options: [
      { id: 'a', text: 'border-style: dots;' },
      { id: 'b', text: 'border-style: dotted;' },
      { id: 'c', text: 'border-style: point;' },
      { id: 'd', text: 'border-style: dashed;' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! 'Border-style: dotted;' cria uma borda pontilhada.",
    failureFeedback:
      "Incorreto. Para criar uma borda pontilhada, usamos 'border-style: dotted;'.",
    explanation:
      "A propriedade 'border-style' define o estilo da borda. O valor 'dotted' cria uma borda pontilhada. Outros valores comuns incluem: solid, dashed, double, groove, ridge, inset e outset.",
  },
  {
    title: 'Espaço entre letras',
    description: 'Qual propriedade CSS controla o espaço entre as letras?',
    options: [
      { id: 'a', text: 'letter-spacing' },
      { id: 'b', text: 'word-spacing' },
      { id: 'c', text: 'text-spacing' },
      { id: 'd', text: 'character-spacing' },
    ],
    correctAnswer: 'a',
    successFeedback:
      "Correto! A propriedade 'letter-spacing' controla o espaço entre as letras.",
    failureFeedback:
      "Incorreto. Para ajustar o espaço entre letras, usamos 'letter-spacing'.",
    explanation:
      "A propriedade 'letter-spacing' ajusta o espaço entre caracteres em um texto. Pode ter valores positivos (mais espaço) ou negativos (menos espaço).",
  },
  {
    title: 'Decoração de texto',
    description:
      'Qual propriedade CSS é usada para adicionar sublinhado a um texto?',
    options: [
      { id: 'a', text: 'font-decoration' },
      { id: 'b', text: 'text-style' },
      { id: 'c', text: 'text-decoration' },
      { id: 'd', text: 'underline' },
    ],
    correctAnswer: 'c',
    successFeedback:
      "Correto! A propriedade 'text-decoration' com valor 'underline' adiciona sublinhado ao texto.",
    failureFeedback:
      "Incorreto. 'Text-decoration: underline;' é usado para adicionar sublinhado a um texto.",
    explanation:
      "A propriedade 'text-decoration' adiciona decoração ao texto. Para sublinhado, usamos 'text-decoration: underline;'. Outros valores incluem: none, overline, line-through.",
  },
  {
    title: 'Alinhamento vertical',
    description:
      'Qual propriedade CSS alinha texto verticalmente em uma célula de tabela?',
    options: [
      { id: 'a', text: 'text-align' },
      { id: 'b', text: 'align' },
      { id: 'c', text: 'vertical-align' },
      { id: 'd', text: 'v-align' },
    ],
    correctAnswer: 'c',
    successFeedback:
      "Correto! A propriedade 'vertical-align' alinha texto verticalmente em células de tabela e alguns outros elementos.",
    failureFeedback:
      "Incorreto. 'Vertical-align' é a propriedade para alinhamento vertical em células de tabela.",
    explanation:
      "A propriedade 'vertical-align' define o alinhamento vertical de um elemento. É comumente usada em células de tabela e elementos inline. Valores incluem: top, middle, bottom, baseline.",
  },
  {
    title: 'Tipo de fonte',
    description:
      'Qual propriedade CSS é usada para especificar a família de fontes?',
    options: [
      { id: 'a', text: 'font' },
      { id: 'b', text: 'font-family' },
      { id: 'c', text: 'text-font' },
      { id: 'd', text: 'type-face' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! A propriedade 'font-family' especifica a família de fontes a ser usada.",
    failureFeedback:
      "Incorreto. 'Font-family' é a propriedade que define qual família de fontes usar.",
    explanation:
      "A propriedade 'font-family' define qual família de fontes deve ser usada para exibir texto. Podemos especificar múltiplas fontes como fallback, separadas por vírgulas.",
  },
  {
    title: 'Maiúsculas e minúsculas',
    description: 'Qual propriedade CSS transforma todo o texto em maiúsculas?',
    options: [
      { id: 'a', text: 'text-uppercase' },
      { id: 'b', text: 'text-transform' },
      { id: 'c', text: 'font-case' },
      { id: 'd', text: 'text-case' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! A propriedade 'text-transform' com valor 'uppercase' transforma texto em maiúsculas.",
    failureFeedback:
      "Incorreto. Para transformar texto em maiúsculas, usamos 'text-transform: uppercase;'.",
    explanation:
      "A propriedade 'text-transform' controla a capitalização do texto. Para texto todo em maiúsculas, usamos 'text-transform: uppercase;'. Outros valores incluem: lowercase, capitalize, none.",
  },
  {
    title: 'Cor de borda',
    description: 'Qual propriedade CSS define a cor da borda?',
    options: [
      { id: 'a', text: 'border' },
      { id: 'b', text: 'border-color' },
      { id: 'c', text: 'border-style-color' },
      { id: 'd', text: 'color-border' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! A propriedade 'border-color' define a cor da borda.",
    failureFeedback:
      "Incorreto. Para definir a cor da borda, usamos 'border-color'.",
    explanation:
      "A propriedade 'border-color' define a cor da borda de um elemento. Pode ser usada junto com 'border-style' e 'border-width', ou através da propriedade abreviada 'border'.",
  },
  {
    title: 'Arredondamento de bordas',
    description: 'Qual propriedade CSS arredonda os cantos de um elemento?',
    options: [
      { id: 'a', text: 'border-round' },
      { id: 'b', text: 'corner-radius' },
      { id: 'c', text: 'border-radius' },
      { id: 'd', text: 'rounded-corners' },
    ],
    correctAnswer: 'c',
    successFeedback:
      "Correto! A propriedade 'border-radius' arredonda os cantos de um elemento.",
    failureFeedback:
      "Incorreto. 'Border-radius' é a propriedade correta para arredondar cantos.",
    explanation:
      "A propriedade 'border-radius' adiciona cantos arredondados a um elemento. Pode ser definida com um único valor para todos os cantos ou valores diferentes para cada canto.",
  },
  {
    title: 'Espaço externo',
    description:
      'Qual propriedade CSS adiciona espaço ao redor de um elemento, fora de sua borda?',
    options: [
      { id: 'a', text: 'spacing' },
      { id: 'b', text: 'margin' },
      { id: 'c', text: 'padding' },
      { id: 'd', text: 'border-spacing' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! A propriedade 'margin' adiciona espaço ao redor de um elemento, fora de sua borda.",
    failureFeedback:
      "Incorreto. 'Margin' é a propriedade que adiciona espaço externo ao redor de um elemento.",
    explanation:
      "A propriedade 'margin' define o espaço ao redor de um elemento, fora de qualquer borda definida. Cria espaço entre elementos. Pode ser definida para cada lado separadamente: margin-top, margin-right, etc.",
  },
  // (Adicionar mais 33 desafios CSS de múltipla escolha para iniciantes)
]

// Desafios CSS de completar código para iniciantes
const cssCodeCompletionBeginner = [
  {
    title: 'Estilizando parágrafos',
    description:
      'Complete o código CSS para fazer todos os parágrafos terem texto vermelho e fonte maior:',
    codeTemplate: 'p {\n  _____: red;\n  font-_____: 18px;\n}',
    expectedSolution: 'p {\n  color: red;\n  font-size: 18px;\n}',
    successFeedback:
      'Muito bem! Você aplicou corretamente as propriedades de cor e tamanho da fonte.',
    hints: [
      'A propriedade para cor do texto é simples, e para o tamanho da fonte, você precisa especificar o que está alterando da fonte.',
    ],
    explanation:
      "A propriedade 'color' define a cor do texto, e 'font-size' define o tamanho da fonte. Essas são propriedades básicas para estilizar texto em CSS.",
  },
  {
    title: 'Centralizar um elemento',
    description:
      'Complete o código CSS para centralizar um elemento div horizontalmente:',
    codeTemplate:
      '.centered {\n  width: 300px;\n  margin-left: _____;\n  margin-right: _____;\n}',
    expectedSolution:
      '.centered {\n  width: 300px;\n  margin-left: auto;\n  margin-right: auto;\n}',
    successFeedback:
      "Excelente! Você centralizou corretamente o elemento usando 'auto' nas margens laterais.",
    hints: [
      'Para centralizar um elemento com largura definida, precisamos que as margens se ajustem automaticamente.',
    ],
    explanation:
      "Definir margin-left e margin-right como 'auto' faz com que as margens se ajustem igualmente em ambos os lados, centralizando o elemento horizontalmente (desde que tenha largura definida).",
  },
  {
    title: 'Cor de fundo básica',
    description:
      'Complete o código CSS para dar uma cor de fundo azul a todos os elementos div:',
    codeTemplate: 'div {\n  _____: blue;\n}',
    expectedSolution: 'div {\n  background-color: blue;\n}',
    successFeedback:
      'Muito bem! Você aplicou corretamente a propriedade de cor de fundo.',
    hints: [
      'Esta propriedade define a cor que aparece atrás do conteúdo do elemento.',
    ],
    explanation:
      "A propriedade 'background-color' define a cor de fundo de um elemento. Neste caso, todos os elementos div terão um fundo azul.",
  },
  {
    title: 'Borda simples',
    description:
      'Complete o código CSS para adicionar uma borda preta sólida de 1 pixel a todos os parágrafos:',
    codeTemplate: 'p {\n  _____: 1px solid black;\n}',
    expectedSolution: 'p {\n  border: 1px solid black;\n}',
    successFeedback:
      'Muito bem! Você aplicou corretamente a propriedade de borda.',
    hints: [
      'Esta propriedade abreviada permite definir espessura, estilo e cor da borda em uma única declaração.',
    ],
    explanation:
      "A propriedade 'border' é uma forma abreviada de definir largura, estilo e cor da borda em uma única propriedade. Neste caso, todos os parágrafos terão uma borda preta sólida com 1 pixel de espessura.",
  },
  {
    title: 'Texto centralizado',
    description:
      'Complete o código CSS para centralizar o texto em todos os cabeçalhos h1:',
    codeTemplate: 'h1 {\n  _____: center;\n}',
    expectedSolution: 'h1 {\n  text-align: center;\n}',
    successFeedback:
      'Excelente! Você centralizou corretamente o texto usando a propriedade adequada.',
    hints: ['Esta propriedade controla o alinhamento horizontal do texto.'],
    explanation:
      "A propriedade 'text-align' define o alinhamento horizontal do texto dentro de um elemento. O valor 'center' centraliza o texto.",
  },
  {
    title: 'Tamanho da fonte',
    description:
      'Complete o código CSS para fazer todos os parágrafos terem uma fonte de 16 pixels:',
    codeTemplate: 'p {\n  _____: 16px;\n}',
    expectedSolution: 'p {\n  font-size: 16px;\n}',
    successFeedback: 'Muito bem! Você aplicou corretamente o tamanho da fonte.',
    hints: ['Esta propriedade define o tamanho do texto.'],
    explanation:
      "A propriedade 'font-size' define o tamanho da fonte. Neste caso, todos os parágrafos terão texto com 16 pixels de tamanho.",
  },
  {
    title: 'Espaçamento interno',
    description:
      'Complete o código CSS para adicionar 10 pixels de espaço interno (entre o conteúdo e a borda) a todos os divs:',
    codeTemplate: 'div {\n  _____: 10px;\n}',
    expectedSolution: 'div {\n  padding: 10px;\n}',
    successFeedback:
      'Muito bem! Você aplicou corretamente o espaçamento interno.',
    hints: [
      'Esta propriedade adiciona espaço entre o conteúdo e a borda de um elemento.',
    ],
    explanation:
      "A propriedade 'padding' adiciona espaço entre o conteúdo de um elemento e sua borda. Neste caso, todos os divs terão 10 pixels de espaço em todos os lados.",
  },
  {
    title: 'Margem externa',
    description:
      'Complete o código CSS para adicionar 20 pixels de margem na parte superior dos cabeçalhos h2:',
    codeTemplate: 'h2 {\n  _____: 20px;\n}',
    expectedSolution: 'h2 {\n  margin-top: 20px;\n}',
    successFeedback: 'Excelente! Você aplicou corretamente a margem superior.',
    hints: [
      'Esta propriedade adiciona espaço fora da borda, apenas na parte superior do elemento.',
    ],
    explanation:
      "A propriedade 'margin-top' adiciona espaço acima de um elemento, fora de sua borda. Neste caso, todos os h2 terão 20 pixels de espaço acima deles.",
  },
  {
    title: 'Estilo da fonte',
    description:
      'Complete o código CSS para fazer com que os textos em <em> fiquem em itálico:',
    codeTemplate: 'em {\n  _____: italic;\n}',
    expectedSolution: 'em {\n  font-style: italic;\n}',
    successFeedback:
      'Muito bem! Você aplicou corretamente o estilo da fonte para itálico.',
    hints: [
      'Esta propriedade controla se o texto aparece em normal ou itálico.',
    ],
    explanation:
      "A propriedade 'font-style' define o estilo da fonte. O valor 'italic' faz com que o texto apareça em itálico. Os elementos <em> já são itálicos por padrão, mas esta regra garante isso explicitamente.",
  },
  {
    title: 'Cor do texto',
    description:
      'Complete o código CSS para fazer todos os links ficarem vermelhos:',
    codeTemplate: 'a {\n  _____: red;\n}',
    expectedSolution: 'a {\n  color: red;\n}',
    successFeedback: 'Muito bem! Você aplicou corretamente a cor do texto.',
    hints: ['Esta propriedade define a cor do texto de um elemento.'],
    explanation:
      "A propriedade 'color' define a cor do texto. Neste caso, todos os links (<a>) terão texto vermelho em vez da cor padrão azul.",
  },
  {
    title: 'Altura fixa',
    description:
      "Complete o código CSS para fazer todas as divs da classe 'box' terem altura de 100 pixels:",
    codeTemplate: '.box {\n  _____: 100px;\n}',
    expectedSolution: '.box {\n  height: 100px;\n}',
    successFeedback:
      'Excelente! Você definiu corretamente a altura do elemento.',
    hints: ['Esta propriedade controla a dimensão vertical de um elemento.'],
    explanation:
      "A propriedade 'height' define a altura de um elemento. Neste caso, todos os elementos com a classe 'box' terão 100 pixels de altura.",
  },
  {
    title: 'Largura fixa',
    description:
      'Complete o código CSS para fazer todas as imagens terem largura de 200 pixels:',
    codeTemplate: 'img {\n  _____: 200px;\n}',
    expectedSolution: 'img {\n  width: 200px;\n}',
    successFeedback:
      'Muito bem! Você definiu corretamente a largura do elemento.',
    hints: ['Esta propriedade controla a dimensão horizontal de um elemento.'],
    explanation:
      "A propriedade 'width' define a largura de um elemento. Neste caso, todas as imagens terão 200 pixels de largura.",
  },
  {
    title: 'Negrito para texto',
    description:
      "Complete o código CSS para fazer todos os textos com a classe 'destacado' ficarem em negrito:",
    codeTemplate: '.destacado {\n  _____: bold;\n}',
    expectedSolution: '.destacado {\n  font-weight: bold;\n}',
    successFeedback:
      'Excelente! Você aplicou corretamente o peso da fonte para negrito.',
    hints: ['Esta propriedade controla a espessura ou o peso da fonte.'],
    explanation:
      "A propriedade 'font-weight' define a espessura da fonte. O valor 'bold' faz com que o texto apareça em negrito.",
  },
  {
    title: 'Sublinhado de texto',
    description:
      'Complete o código CSS para remover o sublinhado de todos os links:',
    codeTemplate: 'a {\n  _____: none;\n}',
    expectedSolution: 'a {\n  text-decoration: none;\n}',
    successFeedback:
      'Muito bem! Você removeu corretamente o sublinhado dos links.',
    hints: [
      'Esta propriedade controla decorações adicionais ao texto como sublinhado, tachado etc.',
    ],
    explanation:
      "A propriedade 'text-decoration' controla as decorações de texto. O valor 'none' remove todas as decorações, incluindo o sublinhado que os links têm por padrão.",
  },
  {
    title: 'Transformação de texto',
    description:
      'Complete o código CSS para fazer todos os textos em h3 ficarem em maiúsculas:',
    codeTemplate: 'h3 {\n  _____: uppercase;\n}',
    expectedSolution: 'h3 {\n  text-transform: uppercase;\n}',
    successFeedback:
      'Excelente! Você aplicou corretamente a transformação de texto para maiúsculas.',
    hints: ['Esta propriedade controla a capitalização do texto.'],
    explanation:
      "A propriedade 'text-transform' controla a capitalização do texto. O valor 'uppercase' converte todo o texto em letras maiúsculas, independentemente de como foi escrito no HTML.",
  },
  {
    title: 'Família de fontes',
    description:
      'Complete o código CSS para usar a fonte Arial em todo o corpo da página:',
    codeTemplate: 'body {\n  _____: Arial, sans-serif;\n}',
    expectedSolution: 'body {\n  font-family: Arial, sans-serif;\n}',
    successFeedback:
      'Muito bem! Você aplicou corretamente a família de fontes.',
    hints: [
      'Esta propriedade define qual tipo de fonte será usada para exibir o texto.',
    ],
    explanation:
      "A propriedade 'font-family' define a família de fontes a ser usada. O valor 'Arial, sans-serif' significa que o navegador tentará usar Arial primeiro e, se não estiver disponível, usará qualquer fonte sans-serif.",
  },
  {
    title: 'Espaçamento entre linhas',
    description:
      'Complete o código CSS para definir o espaçamento entre linhas de parágrafos como 1.5:',
    codeTemplate: 'p {\n  _____: 1.5;\n}',
    expectedSolution: 'p {\n  line-height: 1.5;\n}',
    successFeedback:
      'Excelente! Você definiu corretamente o espaçamento entre linhas.',
    hints: ['Esta propriedade controla a altura de cada linha de texto.'],
    explanation:
      "A propriedade 'line-height' define a altura de cada linha em um bloco de texto. O valor 1.5 significa que a altura da linha será 1,5 vezes o tamanho da fonte, criando um espaçamento que melhora a legibilidade.",
  },
  {
    title: 'Cantos arredondados',
    description:
      'Complete o código CSS para fazer todos os botões terem cantos arredondados de 5 pixels:',
    codeTemplate: 'button {\n  _____: 5px;\n}',
    expectedSolution: 'button {\n  border-radius: 5px;\n}',
    successFeedback:
      'Muito bem! Você aplicou corretamente os cantos arredondados.',
    hints: [
      'Esta propriedade arredonda os cantos de elementos como botões e caixas.',
    ],
    explanation:
      "A propriedade 'border-radius' arredonda os cantos de um elemento. Neste caso, todos os botões terão cantos arredondados com raio de 5 pixels.",
  },
  {
    title: 'Posição do plano de fundo',
    description:
      'Complete o código CSS para posicionar a imagem de fundo no centro do elemento:',
    codeTemplate:
      ".banner {\n  background-image: url('imagem.jpg');\n  _____: center;\n}",
    expectedSolution:
      ".banner {\n  background-image: url('imagem.jpg');\n  background-position: center;\n}",
    successFeedback:
      'Excelente! Você posicionou corretamente a imagem de fundo no centro.',
    hints: [
      'Esta propriedade controla onde a imagem de fundo aparece dentro do elemento.',
    ],
    explanation:
      "A propriedade 'background-position' define onde a imagem de fundo é posicionada dentro do elemento. O valor 'center' centraliza a imagem tanto horizontalmente quanto verticalmente.",
  },
  {
    title: 'Exibição de elementos',
    description:
      "Complete o código CSS para fazer elementos com a classe 'escondido' ficarem invisíveis:",
    codeTemplate: '.escondido {\n  _____: none;\n}',
    expectedSolution: '.escondido {\n  display: none;\n}',
    successFeedback: 'Muito bem! Você ocultou corretamente os elementos.',
    hints: [
      'Esta propriedade controla como um elemento é exibido ou não na página.',
    ],
    explanation:
      "A propriedade 'display' controla como um elemento é renderizado. O valor 'none' remove completamente o elemento do fluxo da página, como se não existisse no HTML.",
  },
  {
    title: 'Estilo do cursor',
    description:
      'Complete o código CSS para fazer o cursor se transformar em uma mãozinha ao passar sobre links:',
    codeTemplate: 'a {\n  _____: pointer;\n}',
    expectedSolution: 'a {\n  cursor: pointer;\n}',
    successFeedback:
      'Excelente! Você configurou corretamente o estilo do cursor.',
    hints: [
      'Esta propriedade muda a aparência do cursor do mouse quando ele passa sobre o elemento.',
    ],
    explanation:
      "A propriedade 'cursor' define a aparência do cursor quando o mouse está sobre o elemento. O valor 'pointer' mostra a mãozinha indicando que o elemento é clicável.",
  },
  {
    title: 'Opacidade do elemento',
    description:
      "Complete o código CSS para fazer imagens com a classe 'transparente' terem 50% de opacidade:",
    codeTemplate: '.transparente {\n  _____: 0.5;\n}',
    expectedSolution: '.transparente {\n  opacity: 0.5;\n}',
    successFeedback: 'Muito bem! Você aplicou corretamente a opacidade de 50%.',
    hints: [
      'Esta propriedade controla o quão transparente um elemento aparece (0 é invisível, 1 é totalmente visível).',
    ],
    explanation:
      "A propriedade 'opacity' define a transparência de um elemento. O valor vai de 0 (totalmente transparente) a 1 (totalmente opaco). O valor 0.5 faz com que o elemento tenha 50% de opacidade.",
  },
  // (Adicionar mais 33 desafios CSS de completar código para iniciantes)
]

// Desafios CSS de múltipla escolha para iniciantes-intermediários
const cssMultipleChoiceIntermediate = [
  {
    title: 'Propriedades de espaçamento CSS',
    description:
      'Qual propriedade CSS é usada para adicionar espaço ao redor do conteúdo de um elemento?',
    options: [
      { id: 'a', text: 'spacing' },
      { id: 'b', text: 'margin' },
      { id: 'c', text: 'padding' },
      { id: 'd', text: 'border-space' },
    ],
    correctAnswer: 'c',
    successFeedback:
      "Correto! A propriedade 'padding' adiciona espaço entre o conteúdo e a borda de um elemento.",
    failureFeedback:
      "Incorreto. 'Padding' é a propriedade que adiciona espaço interno em um elemento.",
    explanation:
      "Em CSS, 'padding' adiciona espaço interno entre o conteúdo e a borda, enquanto 'margin' adiciona espaço externo ao redor do elemento. 'Padding' pode ser definido para cada lado individualmente (padding-top, padding-right, etc.) ou com a notação abreviada.",
  },
  {
    title: 'Seletores de elementos HTML',
    description:
      "Como selecionar todos os elementos <p> dentro de um elemento com id 'container'?",
    options: [
      { id: 'a', text: 'container p' },
      { id: 'b', text: '#container p' },
      { id: 'c', text: '.container p' },
      { id: 'd', text: 'p#container' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! O seletor '#container p' seleciona todos os elementos <p> dentro de um elemento com id 'container'.",
    failureFeedback:
      "Incorreto. Para selecionar elementos <p> dentro de um elemento com id 'container', usamos '#container p'.",
    explanation:
      "Este é um exemplo de seletor descendente. O '#' indica um seletor de ID, e o espaço entre '#container' e 'p' significa 'selecione todos os elementos p que estão dentro do elemento com id container'.",
  },
  {
    title: 'Display em CSS',
    description:
      "Qual valor da propriedade 'display' faz um elemento ocupar todo o espaço disponível na largura?",
    options: [
      { id: 'a', text: 'inline' },
      { id: 'b', text: 'block' },
      { id: 'c', text: 'inline-block' },
      { id: 'd', text: 'flex' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! Elementos com 'display: block' ocupam toda a largura disponível por padrão.",
    failureFeedback:
      "Incorreto. Elementos 'block' ocupam toda a largura disponível, não elementos 'inline'.",
    explanation:
      "Elementos 'block' sempre começam em uma nova linha e ocupam toda a largura disponível. Elementos 'inline' ocupam apenas o espaço necessário para seu conteúdo e não forçam quebras de linha.",
  },
  {
    title: 'Posicionamento CSS',
    description:
      "Qual valor da propriedade 'position' remove um elemento do fluxo normal e o posiciona em relação ao viewport?",
    options: [
      { id: 'a', text: 'relative' },
      { id: 'b', text: 'absolute' },
      { id: 'c', text: 'fixed' },
      { id: 'd', text: 'static' },
    ],
    correctAnswer: 'c',
    successFeedback:
      "Correto! A posição 'fixed' remove o elemento do fluxo normal e o posiciona em relação à janela de visualização (viewport).",
    failureFeedback:
      "Incorreto. 'Position: fixed' posiciona elementos em relação ao viewport e os mantém fixos mesmo durante a rolagem.",
    explanation:
      "Um elemento com 'position: fixed' é posicionado em relação à janela de visualização, o que significa que permanece no mesmo lugar mesmo quando a página é rolada. É útil para elementos como cabeçalhos fixos ou botões de rolagem para o topo.",
  },
  {
    title: 'Unidades de medida CSS',
    description:
      'Qual unidade de medida em CSS é relativa ao tamanho da fonte do elemento pai?',
    options: [
      { id: 'a', text: 'px' },
      { id: 'b', text: 'em' },
      { id: 'c', text: 'rem' },
      { id: 'd', text: 'vh' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! A unidade 'em' é relativa ao tamanho da fonte do elemento pai.",
    failureFeedback:
      "Incorreto. A unidade 'em' é relativa à fonte do elemento pai, não 'px' que é uma unidade absoluta.",
    explanation:
      "A unidade 'em' é relativa ao tamanho da fonte do elemento pai. Por exemplo, 2em significa 2 vezes o tamanho da fonte atual. Já 'rem' é relativa ao elemento raiz (html), e 'px' é uma unidade absoluta.",
  },
  {
    title: 'Flexbox em CSS',
    description:
      'Qual propriedade CSS é usada para definir como os itens flex são distribuídos ao longo do eixo principal?',
    options: [
      { id: 'a', text: 'align-items' },
      { id: 'b', text: 'justify-content' },
      { id: 'c', text: 'flex-direction' },
      { id: 'd', text: 'flex-wrap' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! A propriedade 'justify-content' define como os itens são posicionados ao longo do eixo principal do contêiner flex.",
    failureFeedback:
      "Incorreto. 'Justify-content' é a propriedade que controla o alinhamento no eixo principal em layouts flexbox.",
    explanation:
      "Em um contêiner flexbox, 'justify-content' controla como os itens são posicionados ao longo do eixo principal (horizontal em row, vertical em column). Valores comuns incluem: flex-start, flex-end, center, space-between e space-around.",
  },
  {
    title: 'Seletores avançados CSS',
    description:
      'Qual seletor CSS é usado para selecionar apenas elementos que são filhos diretos de outro elemento?',
    options: [
      { id: 'a', text: 'elemento1 elemento2' },
      { id: 'b', text: 'elemento1 > elemento2' },
      { id: 'c', text: 'elemento1 + elemento2' },
      { id: 'd', text: 'elemento1 ~ elemento2' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! O seletor 'elemento1 > elemento2' seleciona apenas os elementos2 que são filhos diretos de elemento1.",
    failureFeedback:
      'Incorreto. O seletor filho direto (>) seleciona apenas elementos que são filhos diretos de outro elemento.',
    explanation:
      "O seletor filho (>) seleciona apenas elementos que são filhos diretos de outro elemento, não seleciona netos ou descendentes mais profundos. Por exemplo, 'div > p' selecionará somente parágrafos que são filhos diretos de um div.",
  },
  {
    title: 'Transições CSS',
    description:
      'Qual propriedade CSS é usada para especificar a duração de uma transição?',
    options: [
      { id: 'a', text: 'transition-speed' },
      { id: 'b', text: 'transition-time' },
      { id: 'c', text: 'transition-duration' },
      { id: 'd', text: 'transition-delay' },
    ],
    correctAnswer: 'c',
    successFeedback:
      "Correto! 'Transition-duration' especifica quanto tempo uma transição deve levar para completar.",
    failureFeedback:
      "Incorreto. A propriedade que define o tempo de duração de uma transição é 'transition-duration'.",
    explanation:
      "A propriedade 'transition-duration' especifica quanto tempo uma transição deve levar para completar. Pode ser definida em segundos (s) ou milissegundos (ms). Por exemplo: transition-duration: 0.5s ou transition-duration: 500ms.",
  },
  {
    title: 'Bordas em CSS',
    description:
      'Qual é a sintaxe correta para criar uma borda sólida preta com 1 pixel de largura?',
    options: [
      { id: 'a', text: 'border: 1px black solid;' },
      { id: 'b', text: 'border: solid 1px black;' },
      { id: 'c', text: 'border: black solid 1px;' },
      { id: 'd', text: 'Todas as alternativas estão corretas' },
    ],
    correctAnswer: 'd',
    successFeedback:
      "Correto! Em CSS, a ordem dos valores na propriedade 'border' não importa, todas as sintaxes mencionadas são válidas.",
    failureFeedback:
      "Incorreto. Na propriedade abreviada 'border', a ordem dos valores (largura, estilo, cor) não importa, todas as opções são válidas.",
    explanation:
      "A propriedade abreviada 'border' aceita valores de largura, estilo e cor em qualquer ordem. Portanto, todas as três sintaxes apresentadas funcionam da mesma forma: border: 1px solid black; border: solid 1px black; border: black solid 1px;",
  },
  {
    title: 'Pseudo-classes CSS',
    description:
      'Qual pseudo-classe CSS é usada para selecionar um elemento quando o usuário passa o mouse sobre ele?',
    options: [
      { id: 'a', text: ':active' },
      { id: 'b', text: ':focus' },
      { id: 'c', text: ':hover' },
      { id: 'd', text: ':visited' },
    ],
    correctAnswer: 'c',
    successFeedback:
      "Correto! A pseudo-classe ':hover' é ativada quando o usuário passa o cursor sobre um elemento.",
    failureFeedback:
      "Incorreto. A pseudo-classe para quando o mouse está sobre um elemento é ':hover'.",
    explanation:
      "A pseudo-classe ':hover' seleciona elementos quando o cursor do mouse está sobre eles. É frequentemente usada para criar efeitos interativos como mudar a cor de um botão ou link quando o usuário passa o mouse sobre ele.",
  },
  {
    title: 'Modelo de caixa (Box Model)',
    description:
      'Qual propriedade CSS permite incluir o padding e a borda na largura e altura total de um elemento?',
    options: [
      { id: 'a', text: 'box-model: inclusive' },
      { id: 'b', text: 'box-sizing: border-box' },
      { id: 'c', text: 'box-size: include' },
      { id: 'd', text: 'box-include: padding-border' },
    ],
    correctAnswer: 'b',
    successFeedback:
      'Correto! A propriedade box-sizing: border-box faz com que padding e bordas sejam incluídos na largura/altura total.',
    failureFeedback:
      "Incorreto. A propriedade correta é 'box-sizing: border-box'.",
    explanation:
      "Por padrão, largura e altura em CSS aplicam-se apenas ao conteúdo. A propriedade 'box-sizing: border-box' muda esse comportamento, incluindo padding e bordas no cálculo, o que facilita o layout.",
  },
  {
    title: 'Flexbox CSS',
    description:
      'Qual propriedade CSS do Flexbox é usada para definir como os itens flexíveis são distribuídos ao longo do eixo principal?',
    options: [
      { id: 'a', text: 'align-items' },
      { id: 'b', text: 'justify-content' },
      { id: 'c', text: 'flex-flow' },
      { id: 'd', text: 'align-content' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! A propriedade 'justify-content' controla a distribuição dos itens ao longo do eixo principal em Flexbox.",
    failureFeedback:
      "Incorreto. A propriedade que distribui itens ao longo do eixo principal do Flexbox é 'justify-content'.",
    explanation:
      "No Flexbox, 'justify-content' controla a distribuição dos itens ao longo do eixo principal (horizontal em row, vertical em column), enquanto 'align-items' controla o eixo transversal.",
  },
  // (Adicionar mais 13 desafios CSS de múltipla escolha para iniciantes-intermediários)
]

// Desafios CSS de completar código para iniciantes-intermediários
const cssCodeCompletionIntermediate = [
  {
    title: 'Layout Flexbox',
    description:
      'Complete o código CSS para criar um container flexbox com itens alinhados ao centro:',
    codeTemplate:
      '.flex-container {\n  display: _____;\n  justify-content: _____;\n  align-items: _____;\n  height: 200px;\n}',
    expectedSolution:
      '.flex-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 200px;\n}',
    successFeedback:
      'Excelente! Você configurou corretamente um container flexbox com centralização.',
    hints: [
      'Para criar um flexbox, primeiro defina o tipo de display, depois use as propriedades para centralizar horizontal e verticalmente.',
    ],
    explanation:
      "Para criar um layout flexbox, usamos 'display: flex'. 'justify-content: center' centraliza os itens horizontalmente (no eixo principal) e 'align-items: center' centraliza verticalmente (no eixo transversal).",
  },
  {
    title: 'Media Queries',
    description:
      'Complete o código CSS para criar uma media query que aplica estilos quando a largura da tela é no máximo 768px:',
    codeTemplate:
      '@_____ _____ (max-width: _____) {\n  .container {\n    width: 100%;\n  }\n}',
    expectedSolution:
      '@media screen (max-width: 768px) {\n  .container {\n    width: 100%;\n  }\n}',
    successFeedback:
      'Muito bem! Você criou corretamente uma media query para telas menores.',
    hints: [
      'Media queries começam com @media seguido do tipo de mídia e depois a condição com um ponto de quebra.',
    ],
    explanation:
      "Media queries permitem aplicar estilos condicionalmente com base em características do dispositivo. '@media screen (max-width: 768px)' aplica os estilos quando a largura da tela é de até 768px.",
  },
  // (Adicionar mais 13 desafios CSS de completar código para iniciantes-intermediários)
]

// Desafios JavaScript de múltipla escolha para iniciantes
const jsMultipleChoiceBeginner = [
  {
    title: 'Variáveis em JavaScript',
    description:
      'Qual palavra-chave é usada para declarar uma variável em JavaScript moderno que pode ter seu valor alterado?',
    options: [
      { id: 'a', text: 'var' },
      { id: 'b', text: 'const' },
      { id: 'c', text: 'let' },
      { id: 'd', text: 'variable' },
    ],
    correctAnswer: 'c',
    successFeedback:
      "Correto! 'let' é a palavra-chave moderna para declarar variáveis que podem ter seus valores alterados.",
    failureFeedback:
      "Incorreto. A palavra-chave moderna para variáveis que podem ser alteradas é 'let'.",
    explanation:
      "Em JavaScript moderno, 'let' declara variáveis que podem ter seus valores alterados. 'const' é para constantes (não alteráveis) e 'var' é a forma mais antiga, com escopo menos previsível.",
  },
  {
    title: 'Operadores em JavaScript',
    description:
      'Qual operador é usado para verificar se dois valores são iguais em valor E tipo em JavaScript?',
    options: [
      { id: 'a', text: '==' },
      { id: 'b', text: '===' },
      { id: 'c', text: '=' },
      { id: 'd', text: '!==' },
    ],
    correctAnswer: 'b',
    successFeedback:
      "Correto! O operador '===' verifica igualdade tanto em valor quanto em tipo.",
    failureFeedback:
      "Incorreto. O operador para verificar igualdade estrita (valor e tipo) é '==='.",
    explanation:
      "O operador '===' é chamado de operador de igualdade estrita, verificando se os valores são iguais E do mesmo tipo. O operador '==' verifica apenas igualdade de valor, após conversão de tipo.",
  },
    {
      "title": "Saída de dados em JavaScript",
      "description": "Qual função é usada para exibir uma mensagem no console do navegador?",
      "options": [
        { "id": "a", "text": "console.print()" },
        { "id": "b", "text": "console.log()" },
        { "id": "c", "text": "print()" },
        { "id": "d", "text": "console.write()" }
      ],
      "correctAnswer": "b",
      "successFeedback": "Correto! 'console.log()' é a função usada para exibir mensagens no console do navegador.",
      "failureFeedback": "Incorreto. A função para exibir mensagens no console é 'console.log()'.",
      "explanation": "console.log() é um método muito usado em JavaScript para depuração. Ele imprime os valores especificados no console do navegador, facilitando o teste e verificação de valores durante o desenvolvimento."
    },
    {
      "title": "Tipos de dados em JavaScript",
      "description": "Qual é o tipo de dado do valor '42' em JavaScript?",
      "options": [
        { "id": "a", "text": "number" },
        { "id": "b", "text": "string" },
        { "id": "c", "text": "boolean" },
        { "id": "d", "text": "undefined" }
      ],
      "correctAnswer": "b",
      "successFeedback": "Correto! O valor '42' (entre aspas) é uma string em JavaScript.",
      "failureFeedback": "Incorreto. Quando um número está entre aspas ('42'), ele é considerado uma string, não um número.",
      "explanation": "Em JavaScript, qualquer valor entre aspas simples ou duplas é considerado uma string, mesmo que pareça um número. Para representar o número 42, escrevemos sem aspas: 42."
    },
    {
      "title": "Comentários em JavaScript",
      "description": "Como se escreve um comentário de uma linha em JavaScript?",
      "options": [
        { "id": "a", "text": "/* Este é um comentário */" },
        { "id": "b", "text": "<!-- Este é um comentário -->" },
        { "id": "c", "text": "// Este é um comentário" },
        { "id": "d", "text": "# Este é um comentário" }
      ],
      "correctAnswer": "c",
      "successFeedback": "Correto! Comentários de uma linha em JavaScript começam com '//'.",
      "failureFeedback": "Incorreto. Para criar um comentário de uma linha em JavaScript, usamos '//'.",
      "explanation": "Em JavaScript, você pode adicionar comentários de uma linha usando duas barras (//). Tudo o que vem após essas barras na mesma linha é ignorado pelo interpretador JavaScript."
    },
    {
      "title": "Concatenação de strings",
      "description": "Qual é o operador usado para concatenar (juntar) strings em JavaScript?",
      "options": [
        { "id": "a", "text": "+" },
        { "id": "b", "text": "&" },
        { "id": "c", "text": "." },
        { "id": "d", "text": "," }
      ],
      "correctAnswer": "a",
      "successFeedback": "Correto! O operador '+' é usado para concatenar strings em JavaScript.",
      "failureFeedback": "Incorreto. Em JavaScript, usamos o operador '+' para concatenar strings.",
      "explanation": "O operador '+' em JavaScript tem dois usos: adição de números e concatenação de strings. Quando usado com strings, ele as junta. Exemplo: 'Olá ' + 'Mundo' resulta em 'Olá Mundo'."
    },
    {
      "title": "Estrutura condicional",
      "description": "Qual estrutura é usada para executar um bloco de código apenas se uma condição for verdadeira?",
      "options": [
        { "id": "a", "text": "for" },
        { "id": "b", "text": "while" },
        { "id": "c", "text": "switch" },
        { "id": "d", "text": "if" }
      ],
      "correctAnswer": "d",
      "successFeedback": "Correto! A estrutura 'if' é usada para executar código condicionalmente.",
      "failureFeedback": "Incorreto. A estrutura básica para executar código condicional em JavaScript é 'if'.",
      "explanation": "A estrutura 'if' permite executar um bloco de código apenas se uma condição especificada for verdadeira. É fundamental para criar lógica condicional em um programa."
    },
    {
      "title": "Arrays em JavaScript",
      "description": "Como se declara um array vazio em JavaScript?",
      "options": [
        { "id": "a", "text": "var arr = []" },
        { "id": "b", "text": "var arr = {}" },
        { "id": "c", "text": "var arr = new Array" },
        { "id": "d", "text": "var arr = ()" }
      ],
      "correctAnswer": "a",
      "successFeedback": "Correto! A forma mais comum de declarar um array vazio é usando '[]'.",
      "failureFeedback": "Incorreto. Um array vazio em JavaScript é declarado usando colchetes '[]'.",
      "explanation": "Em JavaScript, arrays são estruturas que armazenam múltiplos valores em uma única variável. A notação com colchetes [] é a forma literal e mais comum de criar arrays."
    },
    {
      "title": "Funções em JavaScript",
      "description": "Qual palavra-chave é usada para declarar uma função em JavaScript?",
      "options": [
        { "id": "a", "text": "method" },
        { "id": "b", "text": "func" },
        { "id": "c", "text": "function" },
        { "id": "d", "text": "def" }
      ],
      "correctAnswer": "c",
      "successFeedback": "Correto! A palavra-chave 'function' é usada para declarar funções em JavaScript.",
      "failureFeedback": "Incorreto. Em JavaScript, usamos a palavra-chave 'function' para declarar funções.",
      "explanation": "A palavra-chave 'function' define uma função em JavaScript. Funções são blocos de código reutilizáveis que executam tarefas específicas e podem retornar valores."
    },
    {
      "title": "Incremento em JavaScript",
      "description": "Qual operador é usado para incrementar uma variável em 1 unidade?",
      "options": [
        { "id": "a", "text": "++" },
        { "id": "b", "text": "+=" },
        { "id": "c", "text": "+" },
        { "id": "d", "text": "inc" }
      ],
      "correctAnswer": "a",
      "successFeedback": "Correto! O operador '++' incrementa uma variável em 1 unidade.",
      "failureFeedback": "Incorreto. Para incrementar uma variável em 1, usamos o operador '++'.",
      "explanation": "O operador '++' é usado para aumentar o valor de uma variável em 1. Pode ser usado como prefixo (++x) ou sufixo (x++), com diferenças sutis em expressões complexas."
    },
    {
      "title": "Loop em JavaScript",
      "description": "Qual loop é usado para executar um bloco de código um número específico de vezes?",
      "options": [
        { "id": "a", "text": "if" },
        { "id": "b", "text": "while" },
        { "id": "c", "text": "for" },
        { "id": "d", "text": "switch" }
      ],
      "correctAnswer": "c",
      "successFeedback": "Correto! O loop 'for' é comumente usado para executar código um número específico de vezes.",
      "failureFeedback": "Incorreto. O loop 'for' é ideal para executar código um número específico de vezes.",
      "explanation": "O loop 'for' é perfeito quando se sabe quantas vezes um bloco de código deve ser executado. Ele consiste em uma inicialização, uma condição e uma expressão de incremento."
    },
    {
      "title": "Comparação em JavaScript",
      "description": "Qual operador verifica se um valor é maior ou igual a outro?",
      "options": [
        { "id": "a", "text": ">" },
        { "id": "b", "text": "<=" },
        { "id": "c", "text": ">=" },
        { "id": "d", "text": "=>" }
      ],
      "correctAnswer": "c",
      "successFeedback": "Correto! O operador '>=' verifica se um valor é maior ou igual a outro.",
      "failureFeedback": "Incorreto. Para verificar se um valor é maior ou igual a outro, usamos o operador '>='.",
      "explanation": "O operador '>=' (maior ou igual) compara dois valores e retorna true se o primeiro valor for maior ou igual ao segundo, e false caso contrário."
    },
    {
      "title": "Conversão de tipos",
      "description": "Qual função converte uma string para um número inteiro em JavaScript?",
      "options": [
        { "id": "a", "text": "Number()" },
        { "id": "b", "text": "parseInt()" },
        { "id": "c", "text": "toInt()" },
        { "id": "d", "text": "Integer()" }
      ],
      "correctAnswer": "b",
      "successFeedback": "Correto! A função 'parseInt()' converte uma string para um número inteiro.",
      "failureFeedback": "Incorreto. A função para converter string para inteiro é 'parseInt()'.",
      "explanation": "parseInt() analisa uma string e retorna um número inteiro. Ela ignora espaços em branco iniciais e converte até o primeiro caractere não numérico."
    },
    {
      "title": "Operador lógico AND",
      "description": "Qual operador representa o AND lógico em JavaScript?",
      "options": [
        { "id": "a", "text": "&&" },
        { "id": "b", "text": "||" },
        { "id": "c", "text": "&" },
        { "id": "d", "text": "AND" }
      ],
      "correctAnswer": "a",
      "successFeedback": "Correto! O operador '&&' representa o AND lógico em JavaScript.",
      "failureFeedback": "Incorreto. O operador AND lógico em JavaScript é '&&'.",
      "explanation": "O operador '&&' (AND lógico) retorna true apenas se ambas as expressões de comparação forem verdadeiras. Caso contrário, retorna false."
    },
    {
      "title": "Acessando elementos de array",
      "description": "Como acessar o primeiro elemento de um array em JavaScript?",
      "options": [
        { "id": "a", "text": "array.1" },
        { "id": "b", "text": "array[0]" },
        { "id": "c", "text": "array[1]" },
        { "id": "d", "text": "array.first()" }
      ],
      "correctAnswer": "b",
      "successFeedback": "Correto! O primeiro elemento de um array é acessado com 'array[0]'.",
      "failureFeedback": "Incorreto. Em JavaScript, o índice do primeiro elemento de um array é 0, então usamos 'array[0]'.",
      "explanation": "JavaScript utiliza indexação baseada em zero para arrays, o que significa que o primeiro elemento está na posição 0, o segundo na posição 1, e assim por diante."
    },
    {
      "title": "Funções de String",
      "description": "Qual método de string retorna o comprimento (número de caracteres)?",
      "options": [
        { "id": "a", "text": "length()" },
        { "id": "b", "text": "count()" },
        { "id": "c", "text": "size()" },
        { "id": "d", "text": "length" }
      ],
      "correctAnswer": "d",
      "successFeedback": "Correto! 'length' é uma propriedade, não um método, que retorna o comprimento da string.",
      "failureFeedback": "Incorreto. O comprimento de uma string é obtido através da propriedade 'length', sem parênteses.",
      "explanation": "Em JavaScript, 'length' é uma propriedade (não um método) que retorna o número de caracteres em uma string. Por exemplo: 'texto'.length retorna 5."
    },
    {
      "title": "Objetos em JavaScript",
      "description": "Como se declara um objeto vazio em JavaScript?",
      "options": [
        { "id": "a", "text": "var obj = []" },
        { "id": "b", "text": "var obj = new Object()" },
        { "id": "c", "text": "var obj = {}" },
        { "id": "d", "text": "var obj = ()" }
      ],
      "correctAnswer": "c",
      "successFeedback": "Correto! Um objeto vazio é declarado usando chaves '{}' em JavaScript.",
      "failureFeedback": "Incorreto. Para declarar um objeto vazio em JavaScript, usamos '{}'.",
      "explanation": "Em JavaScript, objetos são estruturas de dados que armazenam pares de chave-valor. A forma mais comum de criar um objeto vazio é usando a notação literal de objeto, com chaves '{}'."
    },
    {
      "title": "Operador de negação",
      "description": "Qual operador nega uma expressão booleana em JavaScript?",
      "options": [
        { "id": "a", "text": "NOT" },
        { "id": "b", "text": "~" },
        { "id": "c", "text": "-" },
        { "id": "d", "text": "!" }
      ],
      "correctAnswer": "d",
      "successFeedback": "Correto! O operador '!' é usado para negar uma expressão booleana.",
      "failureFeedback": "Incorreto. O operador de negação lógica em JavaScript é '!'.",
      "explanation": "O operador '!' (NOT lógico) inverte o valor booleano de uma expressão. Se a expressão for verdadeira, '!' a torna falsa, e vice-versa."
    },
    {
      "title": "Manipulação do DOM",
      "description": "Qual método seleciona um elemento HTML pelo ID em JavaScript?",
      "options": [
        { "id": "a", "text": "document.findById()" },
        { "id": "b", "text": "document.querySelector()" },
        { "id": "c", "text": "document.getElementById()" },
        { "id": "d", "text": "document.getElement()" }
      ],
      "correctAnswer": "c",
      "successFeedback": "Correto! O método 'document.getElementById()' seleciona um elemento pelo seu ID.",
      "failureFeedback": "Incorreto. Para selecionar um elemento pelo ID, usamos 'document.getElementById()'.",
      "explanation": "document.getElementById() é um método comum para acessar elementos HTML. Ele retorna o elemento que possui o ID especificado, ou null se nenhum elemento com o ID for encontrado."
    },
    {
      "title": "Eventos em JavaScript",
      "description": "Qual é o evento disparado quando um usuário clica em um elemento HTML?",
      "options": [
        { "id": "a", "text": "onpress" },
        { "id": "b", "text": "onclick" },
        { "id": "c", "text": "ontouch" },
        { "id": "d", "text": "onselect" }
      ],
      "correctAnswer": "b",
      "successFeedback": "Correto! O evento 'onclick' é disparado quando um usuário clica em um elemento.",
      "failureFeedback": "Incorreto. O evento para capturar cliques do usuário é 'onclick'.",
      "explanation": "O evento 'onclick' é acionado quando um usuário clica em um elemento HTML. É um dos eventos mais comuns em JavaScript para interações do usuário."
    },
    {
      "title": "Operador ternário",
      "description": "Qual símbolo é usado no operador ternário em JavaScript?",
      "options": [
        { "id": "a", "text": "? :" },
        { "id": "b", "text": "if then" },
        { "id": "c", "text": "< >" },
        { "id": "d", "text": "=>" }
      ],
      "correctAnswer": "a",
      "successFeedback": "Correto! O operador ternário usa o formato '? :'.",
      "failureFeedback": "Incorreto. O operador ternário em JavaScript usa '? :' para criar expressões condicionais compactas.",
      "explanation": "O operador ternário é uma forma compacta de expressão condicional. Sua sintaxe é: condição ? valorSeVerdadeiro : valorSeFalso. É útil para atribuições condicionais simples."
    },
    {
      "title": "Método de array para adicionar elementos",
      "description": "Qual método adiciona um novo elemento ao final de um array?",
      "options": [
        { "id": "a", "text": "push()" },
        { "id": "b", "text": "add()" },
        { "id": "c", "text": "append()" },
        { "id": "d", "text": "insert()" }
      ],
      "correctAnswer": "a",
      "successFeedback": "Correto! O método 'push()' adiciona um ou mais elementos ao final de um array.",
      "failureFeedback": "Incorreto. O método para adicionar elementos ao final de um array é 'push()'.",
      "explanation": "O método push() adiciona um ou mais elementos ao final de um array e retorna o novo comprimento do array. É muito útil para crescer dinamicamente o array durante a execução do programa."
    }
  // (Adicionar mais 33 desafios JavaScript de múltipla escolha para iniciantes)
]

// Desafios JavaScript de completar código para iniciantes
const jsCodeCompletionBeginner = [
  {
    title: 'Declaração de variáveis',
    description:
      "Complete o código para declarar uma variável constante 'nome' com o valor 'João':",
    codeTemplate: "_____ nome = 'João';\nconsole.log(nome);",
    expectedSolution: "const nome = 'João';\nconsole.log(nome);",
    successFeedback:
      "Perfeito! Você declarou corretamente uma constante usando 'const'.",
    hints: [
      'Para valores que não serão alterados, usamos uma palavra-chave específica.',
    ],
    explanation:
      "Em JavaScript moderno, usamos 'const' para declarar variáveis cujo valor não será alterado. Para variáveis que podem mudar, usamos 'let'.",
  },
  {
    title: 'Condicionais em JavaScript',
    description:
      'Complete o código para verificar se a idade é maior ou igual a 18:',
    codeTemplate:
      "const idade = 20;\n\n_____ (idade _____ 18) {\n  console.log('É maior de idade');\n} _____ {\n  console.log('É menor de idade');\n}",
    expectedSolution:
      "const idade = 20;\n\nif (idade >= 18) {\n  console.log('É maior de idade');\n} else {\n  console.log('É menor de idade');\n}",
    successFeedback:
      'Muito bem! Você escreveu corretamente a estrutura condicional.',
    hints: [
      "Use a estrutura condicional mais comum em JavaScript, com a palavra 'if'.",
    ],
    explanation:
      "A estrutura 'if-else' permite executar código diferente com base em uma condição. O operador '>=' verifica se um valor é maior ou igual a outro.",
  },
  // (Adicionar mais 33 desafios JavaScript de completar código para iniciantes)
]

// Desafios JavaScript de múltipla escolha para iniciantes-intermediários
const jsMultipleChoiceIntermediate = [
  {
    title: 'Métodos de array',
    description:
      'Qual método de array JavaScript cria um novo array com os resultados da chamada de uma função para cada elemento?',
    options: [
      { id: 'a', text: 'forEach()' },
      { id: 'b', text: 'filter()' },
      { id: 'c', text: 'map()' },
      { id: 'd', text: 'reduce()' },
    ],
    correctAnswer: 'c',
    successFeedback:
      'Correto! O método map() transforma cada elemento do array e retorna um novo array.',
    failureFeedback:
      'Incorreto. O método que transforma cada elemento e retorna um novo array é map().',
    explanation:
      'O método map() cria um novo array aplicando uma função a cada elemento do array original. Diferente do forEach(), ele retorna um novo array com os resultados da função.',
  },
  {
    title: 'Funções de alta ordem',
    description: 'O que é uma função de callback em JavaScript?',
    options: [
      { id: 'a', text: 'Uma função que é armazenada em uma variável' },
      { id: 'b', text: 'Uma função passada como argumento para outra função' },
      { id: 'c', text: 'Uma função que se chama recursivamente' },
      {
        id: 'd',
        text: 'Uma função que é chamada imediatamente após ser definida',
      },
    ],
    correctAnswer: 'b',
    successFeedback:
      'Correto! Uma função de callback é passada como argumento para outra função.',
    failureFeedback:
      'Incorreto. Uma função de callback é uma função passada como argumento para outra função.',
    explanation:
      'Callbacks são fundamentais em JavaScript assíncrono. Elas são funções passadas como argumentos para outras funções, permitindo que código seja executado após a conclusão de operações assíncronas.',
  },
  // (Adicionar mais 13 desafios JavaScript de múltipla escolha para iniciantes-intermediários)
]

// Desafios JavaScript de completar código para iniciantes-intermediários
const jsCodeCompletionIntermediate = [
  {
    title: 'Manipulação de array com map',
    description:
      'Complete o código para duplicar cada número no array usando o método map:',
    codeTemplate:
      'const numeros = [1, 2, 3, 4, 5];\nconst duplicados = numeros._____((numero) => {\n  return _____;\n});\nconsole.log(duplicados); // Deve mostrar [2, 4, 6, 8, 10]',
    expectedSolution:
      'const numeros = [1, 2, 3, 4, 5];\nconst duplicados = numeros.map((numero) => {\n  return numero * 2;\n});\nconsole.log(duplicados); // Deve mostrar [2, 4, 6, 8, 10]',
    successFeedback:
      'Excelente! Você usou corretamente o método map para transformar o array.',
    hints: [
      'Use o método que transforma cada elemento e retorna o que deve ser feito com cada número.',
    ],
    explanation:
      'O método map() cria um novo array aplicando uma função a cada elemento do array original. A função passada para map recebe cada elemento e retorna o valor transformado.',
  },
  {
    title: 'Promises em JavaScript',
    description:
      'Complete o código para criar e usar uma Promise que resolve após 2 segundos:',
    codeTemplate:
      "const minhaPromise = new _____((_____, reject) => {\n  setTimeout(() => {\n    _____('Sucesso!');\n  }, 2000);\n});\n\nminhaPromise._____(resultado => {\n  console.log(resultado); // Deve mostrar 'Sucesso!'\n});",
    expectedSolution:
      "const minhaPromise = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve('Sucesso!');\n  }, 2000);\n});\n\nminhaPromise.then(resultado => {\n  console.log(resultado); // Deve mostrar 'Sucesso!'\n});",
    successFeedback: 'Muito bem! Você criou e usou corretamente uma Promise.',
    hints: [
      'Promises exigem dois parâmetros na função executor e um método específico para lidar com o valor resolvido.',
    ],
    explanation:
      'Promises são objetos que representam a eventual conclusão (ou falha) de uma operação assíncrona. São criadas com new Promise() e uma função que recebe resolve e reject. O método then() é usado para tratar o sucesso.',
  },
  // (Adicionar mais 13 desafios JavaScript de completar código para iniciantes-intermediários)
]

// Função para criar estrutura de desafio completo
const createChallenge = (topic, type, level, data) => {
  return {
    id: generateId(),
    topic,
    type,
    level,
    title: data.title,
    description: data.description,
    ...(type === 'multipleChoice'
      ? {
          options: data.options,
          correctAnswer: data.correctAnswer,
          successFeedback: data.successFeedback,
          failureFeedback: data.failureFeedback,
        }
      : {
          codeTemplate: data.codeTemplate,
          expectedSolution: data.expectedSolution,
          hints: data.hints,
          successFeedback: data.successFeedback,
        }),
    explanation: data.explanation,
    createdAt: new Date().toISOString(),
  }
}

// Adicionar todos os desafios às respectivas categorias
// HTML
htmlMultipleChoiceBeginner.forEach((data) => {
  challenges.html.push(
    createChallenge('html', 'multipleChoice', 'beginner', data),
  )
})

htmlCodeCompletionBeginner.forEach((data) => {
  challenges.html.push(
    createChallenge('html', 'codeCompletion', 'beginner', data),
  )
})

htmlMultipleChoiceIntermediate.forEach((data) => {
  challenges.html.push(
    createChallenge('html', 'multipleChoice', 'intermediate', data),
  )
})

htmlCodeCompletionIntermediate.forEach((data) => {
  challenges.html.push(
    createChallenge('html', 'codeCompletion', 'intermediate', data),
  )
})

// CSS
cssMultipleChoiceBeginner.forEach((data) => {
  challenges.css.push(
    createChallenge('css', 'multipleChoice', 'beginner', data),
  )
})

cssCodeCompletionBeginner.forEach((data) => {
  challenges.css.push(
    createChallenge('css', 'codeCompletion', 'beginner', data),
  )
})

cssMultipleChoiceIntermediate.forEach((data) => {
  challenges.css.push(
    createChallenge('css', 'multipleChoice', 'intermediate', data),
  )
})

cssCodeCompletionIntermediate.forEach((data) => {
  challenges.css.push(
    createChallenge('css', 'codeCompletion', 'intermediate', data),
  )
})

// JavaScript
jsMultipleChoiceBeginner.forEach((data) => {
  challenges.javascript.push(
    createChallenge('javascript', 'multipleChoice', 'beginner', data),
  )
})

jsCodeCompletionBeginner.forEach((data) => {
  challenges.javascript.push(
    createChallenge('javascript', 'codeCompletion', 'beginner', data),
  )
})

jsMultipleChoiceIntermediate.forEach((data) => {
  challenges.javascript.push(
    createChallenge('javascript', 'multipleChoice', 'intermediate', data),
  )
})

jsCodeCompletionIntermediate.forEach((data) => {
  challenges.javascript.push(
    createChallenge('javascript', 'codeCompletion', 'intermediate', data),
  )
})

// Combinar todos os desafios em uma única array
const allChallenges = [
  ...challenges.html,
  ...challenges.css,
  ...challenges.javascript,
]

// Salvar os desafios em um arquivo JSON
const saveChallengesToFile = async () => {
  try {
    await fs.writeFile(
      path.join(__dirname, 'challenges.json'),
      JSON.stringify(allChallenges, null, 2),
      'utf8',
    )
    console.log(`Total de ${allChallenges.length} desafios salvos com sucesso!`)
    console.log(`- HTML: ${challenges.html.length} desafios`)
    console.log(`- CSS: ${challenges.css.length} desafios`)
    console.log(`- JavaScript: ${challenges.javascript.length} desafios`)
  } catch (error) {
    console.error('Erro ao salvar os desafios:', error)
  }
}

// Executar a função para salvar os desafios
saveChallengesToFile()
