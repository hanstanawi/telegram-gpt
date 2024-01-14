###################
# BASE
###################
FROM node:18-alpine AS base

# Install pnpm
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
RUN npm i -g pnpm

# Create app directory
WORKDIR /app
COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY --chown=node:node . .
RUN pnpm db:generate

###################
# BUILD STAGE
###################
FROM base AS build

ENV NODE_ENV production
RUN pnpm build

USER node

###################
# PROD-DEPENDENCIES
###################
FROM base AS prod-deps
ENV NODE_ENV production
RUN pnpm install --prod --frozen-lockfile --ignore-scripts
USER node

###################
# PRODUCTION STAGE
###################
FROM node:18-alpine AS prod

# Only copy built files and production node_modules
COPY --chown=node:node --from=build /app/dist/ ./dist
COPY --chown=node:node --from=prod-deps /app/node_modules ./node_modules

# Start the server using the production build
CMD [ "node", "dist/main.js" ]

