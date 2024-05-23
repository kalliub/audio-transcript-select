FROM node:20-alpine3.18

WORKDIR /app

COPY . .

RUN npm install && npm run build

RUN npx prisma db push

EXPOSE 3000

CMD ["node", "./build/server/index.js"]