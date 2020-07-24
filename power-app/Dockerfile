FROM node:14

WORKDIR /app

COPY . /app

RUN npm install && npm run build

ENV NODE_ENV=production

EXPOSE 9999

CMD ["node", "build/app.js"]
