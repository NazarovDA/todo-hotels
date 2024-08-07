FROM golang:1.22.2-alpine

WORKDIR /golang

ARG DB_URL
# ARG SECRET
# ARG RABBITMQ_HOST
# ARG RABBITMQ_USER
# ARG RABBITMQ_PASSWORD

ARG DB_HOST
ARG DB_USER
ARG DB_PASSWORD
ARG DB_PORT
ARG DB_NAME

# RUN corepack enable
# RUN pnpm install

# COPY . .

# RUN pnpm prisma migrate
# RUN pnpm prisma generate
# RUN pnpm build todo-hotels

# ENTRYPOINT [ "pnpm", "start:todo-hotels" ]

COPY ./apps/go .
RUN go build -o main main.go
# ENTRYPOINT [ "./main" ]

