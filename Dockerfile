######################
## production stage ##
######################
FROM oven/bun:1.0.7 AS development

# Set the working directory
WORKDIR /app

# Install Git
RUN apt-get update && apt-get install -y curl git

# Initialize an empty Git repository
# for preventing Husky install to fail
RUN git init

COPY package.json bun.lockb ./

# Install dependencies (Temporarily ignoring scripts to avoid Husky install error)
RUN bun install --ignore-scripts

COPY . .

# Run build
RUN bun run build

# Start the server
CMD ["bun", "run", "dev"]

######################
## production stage ##
######################
FROM oven/bun:1.0.7 AS production

# Set the working directory
WORKDIR /app

COPY --from=development /app/dist ./dist
COPY --from=development /app/package.json /app/bun.lockb ./

# Install dependencies
RUN bun install --production --ignore-scripts

# Start the server
CMD ["bun", "dist/server.js"]
