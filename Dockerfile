# Build stage
FROM oven/bun:alpine AS build

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build args for Vite (must be passed during build)
ARG VITE_ARDOR_LOGS_API_URL
ARG VITE_ARDOR_SUBMIT_LOGS_KEY
ARG VITE_ARDOR_SERVICE_ID
ARG VITE_ARDOR_PROXY_ENDPOINT
ARG VITE_ARDOR_REMOTE_LOG_LEVEL=ERROR

# Set env vars for Vite build
ENV VITE_ARDOR_LOGS_API_URL=$VITE_ARDOR_LOGS_API_URL
ENV VITE_ARDOR_SUBMIT_LOGS_KEY=$VITE_ARDOR_SUBMIT_LOGS_KEY
ENV VITE_ARDOR_SERVICE_ID=$VITE_ARDOR_SERVICE_ID
ENV VITE_ARDOR_PROXY_ENDPOINT=$VITE_ARDOR_PROXY_ENDPOINT
ENV VITE_ARDOR_REMOTE_LOG_LEVEL=$VITE_ARDOR_REMOTE_LOG_LEVEL

# Build the application
RUN bun run build

# Production stage
FROM nginx:alpine

# Define ARG for port
ARG PORT=1337


# Copy nginx configuration template
COPY nginx.conf /etc/nginx/nginx.conf

# Replace placeholder with actual port value during build
RUN sed -i "s/\${PORT}/${PORT}/g" /etc/nginx/nginx.conf

# Copy built app from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose configurable port
EXPOSE ${PORT}

#Define ENV for port
ENV PORT=${PORT}

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
