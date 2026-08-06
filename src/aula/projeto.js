/**
 * Os arquivos oficiais do projeto "Gasto na Foto", construído ao vivo na aula.
 *
 * A turma inteira precisa terminar com o MESMO código: se a Giovanna inventar
 * um CSS ou um texto de prompt diferente, a tela do aluno não bate com a do
 * telão e ele acha que errou. Por isso estes trechos são entregues literais,
 * não gerados pelo modelo.
 *
 * GERADO a partir de /Users/rodolfomori/Desktop/EVENTO/2026/AGO/PROJETO
 * Se o professor mudar o projeto, regenere este arquivo.
 */

/** O texto que vai PARA a IA do Puter. */
const PEDIDO_OFICIAL =
  "Olhe a foto deste comprovante e responda em UMA linha, sem escrever mais nada, com 2 pedaços separados por |. Primeiro pedaço: o emoji da categoria, o nome do estabelecimento dentro de <strong>, e depois cada item comprado com seu valor, um por linha usando <br>. Segundo pedaço: o total pago, só o número, com ponto e sempre com duas casas decimais. As categorias são: 🛒 Mercado, 🚗 Transporte, 🍔 Comida, 💊 Saúde, 🎉 Lazer, 🏠 Casa, 💸 Outros. Exemplo de resposta: 🍔 <strong>Padaria Pão Quente</strong><br>Pão — R$ 5,00<br>Leite — R$ 4,50|9.50";

/** styles.css completo da aula. */
const CSS_OFICIAL = `/* ===== Gasto na Foto — visual limpo de app de finanças ===== */

/* zera as margens que o navegador coloca sozinho */
* {
  margin: 0;
  padding: 0;
}

body {
  font-family: "Rubik", sans-serif;
  background-color: #f2f5f9;
  color: #22304a;
  max-width: 520px;
  margin: 0 auto;
  padding: 24px 16px;
}

/* TÍTULO */
.caixa-topo {
  text-align: center;
  margin-bottom: 20px;
}

.caixa-topo h1 {
  font-size: 28px;
}

.caixa-topo p {
  font-size: 15px;
  color: #6b7a94;
}

/* CARTÃO DO TOTAL */
.caixa-total {
  background-color: #0f766e;
  color: #ffffff;
  border-radius: 18px;
  padding: 24px;
  text-align: center;
}

.caixa-total p {
  font-size: 13px;
  color: #b9e0dc;
}

.caixa-total .total {
  font-size: 42px;
  font-weight: 700;
  color: #ffffff;
}

/* ÁREA DE FOTO */
.caixa-foto {
  display: block;
  background-color: #ffffff;
  border: 3px dashed #c3cfe0;
  border-radius: 16px;
  padding: 28px 16px;
  margin-top: 18px;
  text-align: center;
  color: #4a5b78;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
}

.caixa-foto:hover {
  border-color: #0f766e;
  background-color: #f0fdfa;
}

/* o input fica escondido: quem aparece é a caixa pontilhada */
.caixa-foto input {
  display: none;
}

.rodape {
  text-align: center;
  color: #93a1b8;
  font-size: 13px;
  margin-top: 28px;
}

/* ===========================================================
   DAQUI PRA BAIXO: OS COMPROVANTES LIDOS
   Nada disso aparece quando a página abre. Só entra na tela
   depois que a IA lê a primeira foto, porque é o JavaScript
   que cria esse pedaço de HTML.
   =========================================================== */

/* o cartão branco de cada comprovante */
.comprovante {
  background-color: #ffffff;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 12px;
}

/* o comprovante escrito pela IA: nome da loja e os itens */
.itens {
  white-space: pre-line; /* respeita as quebras de linha que a IA mandou */
  font-size: 15px;
  line-height: 1.8;
  color: #4a5b78;
}

/* o nome do estabelecimento, que a IA manda dentro de <strong> */
.itens strong {
  font-size: 17px;
  color: #22304a;
}

/* o total daquela nota: texto na esquerda, valor na direita */
.total-nota {
  display: flex;
  justify-content: space-between;
  border-top: 1px dashed #d6dee9;
  padding-top: 12px;
  margin-top: 12px;
  font-size: 15px;
  color: #6b7a94;
}

.total-nota strong {
  font-size: 20px;
  color: #0f766e;
}`;

/** index.html completo da aula. */
const HTML_OFICIAL = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gasto na Foto — Finanças Pessoais</title>
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <!-- Puter.js: IA de graça, sem chave -->
  <script src="https://js.puter.com/v2/"></script>
</head>
<body>

  <!-- TÍTULO -->
  <div class="caixa-topo">
    <h1>📸 Gasto na Foto</h1>
    <p>Fotografe o comprovante. A IA anota pra você.</p>
  </div>

  <!-- O TOTAL GASTO -->
  <div class="caixa-total">
    <p>Total gasto</p>
    <p class="total">R$ 0,00</p>
    <p class="quantos">0 comprovantes lidos</p>
  </div>

  <!-- ÁREA DE FOTO: tocar na caixa abre a câmera -->
  <label class="caixa-foto">
    🧾 Toque para fotografar o comprovante
    <input type="file" class="foto" accept="image/*" onchange="lerFoto()">
  </label>

  <!-- OS COMPROVANTES LIDOS -->
  <div class="lista"></div>

  <div class="rodape">Feito na aula • Missão Programação do ZERO com IA</div>

  <script src="scripts.js"></script>
</body>
</html>`;

/** scripts.js completo da aula. */
const JS_OFICIAL = `// ===== Gasto na Foto =====
// A IA vem de graça pelo Puter.js — não precisa de chave!

// O que pedimos pra IA. Ela responde o comprovante pronto, um | e o total.
let PEDIDO = 'Olhe a foto deste comprovante e responda em UMA linha, sem escrever mais nada, com 2 pedaços separados por |. Primeiro pedaço: o emoji da categoria, o nome do estabelecimento dentro de <strong>, e depois cada item comprado com seu valor, um por linha usando <br>. Segundo pedaço: o total pago, só o número, com ponto e sempre com duas casas decimais. As categorias são: 🛒 Mercado, 🚗 Transporte, 🍔 Comida, 💊 Saúde, 🎉 Lazer, 🏠 Casa, 💸 Outros. Exemplo de resposta: 🍔 <strong>Padaria Pão Quente</strong><br>Pão — R$ 5,00<br>Leite — R$ 4,50|9.50';

let total = 0;    // a soma de todos os comprovantes
let quantos = 0;  // quantos comprovantes já lemos

async function lerFoto() {
  // files[0] é a foto que a pessoa acabou de escolher
  const foto = document.querySelector(".foto").files[0];
  
  const resposta = await puter.ai.chat(PEDIDO, foto);
  const texto = resposta.message.content; // o que a IA escreveu
  const partes = texto.split("|");        // corta o texto no |

  // coloca o comprovante na tela
  document.querySelector(".lista").innerHTML += \`
    <div class="comprovante">
      <div class="itens">\${partes[0]}</div>
      <div class="total-nota"><span>Total da nota</span><strong>R$ \${partes[1]}</strong></div>
    </div>\`;

  // atualiza os números lá em cima
  total += Number(partes[1]); // Number transforma o texto em número pra somar
  quantos += 1;
  document.querySelector(".total").innerText = "R$ " + total.toFixed(2);
  document.querySelector(".quantos").innerText = quantos + " comprovantes lidos";
}`;

/** Devolve só as regras de CSS das classes citadas, na ordem do arquivo. */
const cssDasClasses = (classes) => {
  const blocos = CSS_OFICIAL.match(/[^{}]+\{[^}]*\}/g) || [];
  return blocos
    .filter((b) => classes.some((c) => b.split('{')[0].includes('.' + c)))
    .map((b) => b.trim())
    .join('\n\n');
};

module.exports = {
  PEDIDO_OFICIAL,
  CSS_OFICIAL,
  HTML_OFICIAL,
  JS_OFICIAL,
  cssDasClasses,
};
