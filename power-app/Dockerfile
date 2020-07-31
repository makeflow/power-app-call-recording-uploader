FROM node:14

WORKDIR /app

COPY . /app

RUN npm install && npm run build

ENV NODE_ENV=production \
    VERSION=0.0.2 \
    PORT=8802

EXPOSE 8802

CMD ["node", "build/app.js"]
