# ==============================================================================
# Multi-Stage Dockerfile for Reproducible Node.js + TypeScript Environment
# University Course: Software Engineering & DevOps
# ==============================================================================
#
# This project is a Node/Express API with TypeScript source in src/.
# Vite is not the server runtime. The build must compile the server itself to dist/server.js.
#
# ------------------------------------------------------------------------------
# STAGE 1: Builder
# Purpose: Compile TypeScript server to JavaScript.
# ------------------------------------------------------------------------------
  FROM node:22-bookworm-slim AS builder

  WORKDIR /usr/src/app
  
  # Copy dependency manifests first to leverage Docker layer caching
  COPY package*.json tsconfig.server.json ./
  
  # Install all dependencies
  RUN npm ci
  
  # Copy source code
  COPY src/ ./src/
  
  # Compile TypeScript server to dist/
  RUN npm run build
  
  # ------------------------------------------------------------------------------
  # STAGE 2: Production Runner
  # Purpose: Minimal runtime container with compiled Node server and production deps.
  # ------------------------------------------------------------------------------
  FROM node:22-bookworm-slim AS runner
  
  WORKDIR /usr/src/app
  
  ENV NODE_ENV=production
  ENV PORT=3000
  
  # Copy production dependencies
  COPY package*.json ./
  RUN npm ci --omit=dev && npm cache clean --force \
      && apt-get update && apt-get install -y --no-install-recommends wget \
      && rm -rf /var/lib/apt/lists/*
  
  # Copy compiled JS output from builder
  COPY --from=builder /usr/src/app/dist ./dist
  
  USER node
  
  EXPOSE 3000
  
  HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
  
  CMD ["node", "dist/server.js"]