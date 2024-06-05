FROM node:lts-slim as base

ENV PNPM_HOME="/pnpm"
ENV NPM_CONFIG_LOGLEVEL=error
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ADD . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 3030
ENV NODE_ENV="production"

HEALTHCHECK --interval=12s --timeout=12s --start-period=30s CMD curl --fail http://localhost:3030/monitoring/health || exit 1

CMD [ "node", "dist/index.js" ]