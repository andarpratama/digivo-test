FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache \
    libwebp-dev \
    jpeg-dev \
    libpng-dev \
    build-base \
    python3

COPY package*.json ./
RUN npm install

COPY . .

# Debug: Check what files are copied
RUN echo "=== Checking source files ===" && \
    ls -la && \
    ls -la src/ && \
    echo "=== Checking TypeScript config ===" && \
    cat tsconfig.json

# Create dist directory and build with better error handling
RUN mkdir -p dist && \
    echo "=== Starting TypeScript build ===" && \
    npm run build && \
    echo "=== Build completed, checking output ===" && \
    ls -la && \
    ls -la dist/ && \
    echo "=== Build completed successfully ==="

EXPOSE 5000

CMD ["node", "dist/app.js"] 