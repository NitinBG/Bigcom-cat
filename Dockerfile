# Use Node 20 as base image
FROM node:20-alpine
# Set the working directory to /app
WORKDIR /app
# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate
# Copy the entire project (monorepo)
COPY . .
# Move into core folder where the actual app resides
WORKDIR /app/core
# Install dependencies and build the app
RUN pnpm install
RUN pnpm build
# Expose the app port
EXPOSE 3000
# Start the app
CMD ["pnpm", "start"]






