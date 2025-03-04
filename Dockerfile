# Definir a imagem base do Node.js
FROM node:18-alpine

# Definir diretório de trabalho no container
WORKDIR /app

# Copiar os arquivos do projeto para o container
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código para o container
COPY . .

# Expor a porta que a aplicação utiliza
EXPOSE 3001

# Comando para rodar a aplicação
CMD ["node", "server.js"]
