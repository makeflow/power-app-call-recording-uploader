FROM node:14

RUN add-apt-repository universe \
    && apt update \
    && apt install ffmpeg

WORKDIR /app

COPY . /app

RUN npm install && npm run build

ENV NODE_ENV=production \
    PORT=8802

EXPOSE 8802

CMD ["node", "build/app.js"]
