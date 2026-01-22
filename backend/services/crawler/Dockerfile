# Playwright Dockerfile for Cloud Run
FROM mcr.microsoft.com/playwright:v1.41.0-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (production only)
RUN npm install --omit=dev

# Copy application source
COPY crawler.js ./

# Set Environment Variables default (will be overridden by Cloud Run)
ENV NODE_ENV=production

# Run the crawler
CMD ["node", "crawler.js"]
