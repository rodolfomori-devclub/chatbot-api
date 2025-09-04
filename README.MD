# Chatbot Giovanna - Assistente de Programação

Um chatbot educacional desenvolvido para ajudar alunos da Missão Programação do Zero, focado em explicar conceitos de programação de forma simples e acessível para iniciantes.

## Funcionalidades

- **Chat com IA**: Interface de chat com streaming de mensagens em tempo real
- **Tópicos Sugeridos**: Sugestões de perguntas para ajudar os alunos a começar
- **Desafios Interativos**: Exercícios de programação com feedback automático
- **Explicações Detalhadas**: Respostas formatadas com destaque de sintaxe para códigos

## Tecnologias Utilizadas

### Frontend
- React 18+ com Vite
- Tailwind CSS para estilização
- React Router para navegação
- Axios para requisições HTTP
- React Syntax Highlighter para formatação de código
- React Markdown para formatação de texto

### Backend
- Node.js
- Express
- OpenAI API (GPT-5 Nano) para processamento de linguagem natural
- Groq API (alternativa) para processamento de linguagem natural
- Arquitetura flexível para substituição da IA

## Pré-requisitos

- Node.js 18.x ou superior
- NPM ou Yarn
- Chave de API da OpenAI (você pode obtê-la em [platform.openai.com](https://platform.openai.com))
- Ou chave de API da Groq (alternativa, você pode obtê-la em [console.groq.com](https://console.groq.com))

## Configuração e Execução

### Backend
1. Entre no diretório do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente copiando o arquivo `env.example` para `.env` e adicionando sua chave de API:
```bash
cp env.example .env
```

4. Edite o arquivo `.env` e adicione sua chave de API:
```
PORT=3001
LLM_PROVIDER=openai
OPENAI_API_KEY=sua_chave_api_aqui
OPENAI_MODEL=gpt-5o-nano
NODE_ENV=development
```

**Nota**: Você pode escolher entre OpenAI (GPT-5 Nano) ou Groq como provedor de IA. Para usar Groq, configure:
```
LLM_PROVIDER=groq
GROQ_API_KEY=sua_chave_groq_aqui
GROQ_MODEL=llama2-70b-4096
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

### Frontend
1. Entre no diretório do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse a aplicação em `http://localhost:3000`

## Estrutura do Projeto

### Backend
```
backend/
├── .env               # Variáveis de ambiente
├── package.json       # Dependências e scripts
└── server.js          # Servidor Express e integração com OpenAI
```

### Frontend
```
frontend/
├── public/            # Arqu