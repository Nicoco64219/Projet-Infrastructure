FROM node:20-alpine

WORKDIR /app

# On copie d'abord les manifestes pour profiter du cache Docker
COPY package*.json ./
RUN npm install --omit=dev

# Puis le reste du code
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
