FROM node:21.1.0 AS build
ENV NODE_OPTIONS=--max-old-space-size=4096

WORKDIR /app

COPY package.json package-lock.json ./

COPY . .

RUN npm ci --silent

RUN npm run build

EXPOSE 80

CMD ["npm", "run", "dev"]