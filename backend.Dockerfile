FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

ARG DATABASE_URL
ARG SECRET
ARG RABBITMQ_HOST
ARG RABBITMQ_USER
ARG RABBITMQ_PASSWORD

ARG DB_HOST
ARG DB_USER
ARG DB_PASSWORD
ARG DB_PORT
ARG DB_NAME

ENV DB_URL=postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}

RUN corepack enable
RUN pnpm install

COPY . .

RUN pnpm prisma migrate
RUN pnpm prisma generate
RUN pnpm build todo-hotels

ENTRYPOINT [ "pnpm", "start:todo-hotels" ]
