FROM node:24-alpine AS builder

WORKDIR /app

RUN npm i -g corepack
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install --immutable

COPY . .

# 이 앱은 PostgreSQL에 연결해야 하므로 DATABASE_URL 같은 런타임 환경변수가 필요하다.
# NestJS는 Node 위에서 동작하지만, DB 연결 정보는 별도로 주입해야 한다.


RUN yarn build

FROM node:24-alpine AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]