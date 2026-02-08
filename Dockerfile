FROM node:20-alpine

WORKDIR /app

# Copy only backend package.json first (better caching)
COPY server/package*.json ./server/

WORKDIR /app/server
RUN npm install --production

# Copy backend source
WORKDIR /app# -------- BUILD FRONTEND --------
FROM node:20-alpine AS client-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client .
RUN npm run build


# -------- BUILD BACKEND --------
FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production

# Copy backend source
WORKDIR /app
COPY server ./server

# Copy frontend build into backend public folder
COPY --from=client-build /app/client/dist ./client/dist

EXPOSE 3000

CMD ["node", "server/src/server.js"]

COPY server ./server

EXPOSE 3000

CMD ["node", "server/src/server.js"]
