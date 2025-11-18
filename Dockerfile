FROM node:20.12.2-alpine AS builder
WORKDIR /usr/src
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN corepack enable
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:20.12.2-alpine
WORKDIR /usr/app

# Copy package files for production dependencies
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Enable corepack and install production dependencies only
# Set CI=true to skip prepare scripts (like git hooks)
RUN corepack enable && \
    CI=true pnpm install --prod --frozen-lockfile

# Copy the built output
COPY --from=builder /usr/src/dist/output ./output

# Set environment variables with defaults
ENV HOST=0.0.0.0
ENV PORT=4444
ENV NODE_ENV=production

EXPOSE $PORT

# Verify the file exists before starting
RUN ls -la output/server/ || echo "Warning: output/server directory not found"

CMD ["node", "output/server/index.mjs"]
