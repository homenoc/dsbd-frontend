# Build from the repository root:
#   docker build -f apps/user/Dockerfile .
FROM node:26-alpine AS builder
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN npm install -g corepack && corepack enable
WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter dsbd-user build

FROM nginx:stable-alpine
COPY apps/user/nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /repo/apps/user/build /usr/share/nginx/html
