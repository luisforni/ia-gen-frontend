FROM node:20-alpine

WORKDIR /app

COPY ia-gen-frontend/package*.json ./

RUN npm install

COPY ia-gen-frontend/ ./

EXPOSE 3000

CMD ["npm", "run", "dev"]