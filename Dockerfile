# -------- BUILD FRONTEND --------
FROM node:20-alpine AS client-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client .
RUN npm run build


# -------- BUILD BACKEND --------
FROM node:20-alpine

WORKDIR /app

COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production

WORKDIR /app
COPY server ./server

COPY --from=client-build /app/client/dist ./client/dist

EXPOSE 3000

CMD ["node", "server/src/server.js"]
