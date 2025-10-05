FROM node:21.1.0

WORKDIR /app
COPY . .

EXPOSE 80
RUN npm install
RUN npm run build
CMD ["npm", "run", "dev"]
