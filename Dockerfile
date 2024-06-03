# Build stage
FROM node:20-alpine3.18 AS build

WORKDIR /app

COPY --chown=node:node package.json package-lock.json ./

RUN npm ci

COPY --chown=node:node app ./app
COPY --chown=node:node public ./public
COPY --chown=node:node schemas ./schemas
COPY --chown=node:node tsconfig.json vite.config.ts ./

RUN npm run build

# Run-time stage
FROM node:20-alpine3.18

# USER node
EXPOSE 3000

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build

RUN npm prune --omit=dev

CMD ["npm", "start"]