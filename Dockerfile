FROM oven/bun:latest AS frontend

WORKDIR /app/frontend

COPY frontend/package.json frontend/bun.lock ./

RUN bun install

COPY frontend/ ./

RUN bun run build

FROM oven/bun:latest AS backend

WORKDIR /app/backend

COPY backend/package.json backend/bun.lock ./

RUN bun install

COPY backend/ ./

COPY --from=frontend /app/frontend/dist/ /app/backend/public

CMD [ "bun","start" ]