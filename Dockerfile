# -----------------------
# Step 1: Build the app
# -----------------------
    FROM node:22.15.0-alpine AS builder

    # Install pnpm globally
    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    # Set working directory
    WORKDIR /app
    
    # Copy only the files needed for installing dependencies
    COPY pnpm-lock.yaml package.json ./
    
    # Install dependencies
    RUN pnpm install --frozen-lockfile
    
    # Copy the rest of the project files
    COPY . .
    
    # Build the app
    RUN pnpm build
    
    # -----------------------
    # Step 2: Run the app
    # -----------------------
    FROM node:22.15.0-alpine
    
    # Install pnpm
    RUN corepack enable && corepack prepare pnpm@latest --activate
    
    # Set working directory
    WORKDIR /app
    
    # Copy only necessary files from builder
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
    COPY --from=builder /app/node_modules ./node_modules
    
    # Expose port (change to your NestJS app port)
    EXPOSE 4000
    
    # Run the app
    CMD ["node", "dist/main"]
    