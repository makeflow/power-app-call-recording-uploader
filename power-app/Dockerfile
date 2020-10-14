FROM node:14

RUN apt-get update \
    && apt install ffmpeg -y

WORKDIR /app

COPY . /app

RUN npm install && npm run build

ENV NODE_ENV=production \
    PORT=8802

EXPOSE 8802

CMD ["node", "build/app.js"]
