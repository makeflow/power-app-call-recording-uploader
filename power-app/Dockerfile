FROM node:14

WORKDIR /app

COPY . /app

RUN npm install && npm run build

ENV NODE_ENV=production
ENV VERSION=0.0.1
ENV PORT=8802

EXPOSE 8802

CMD ["node", "build/app.js"]
