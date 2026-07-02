FROM node:24-alpine AS builder

WORKDIR /app

RUN npm i -g corepack
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install --immutable

COPY . .

# 왜 백엔드에선 환경변수를 설정하지 않을까?
# Node에서는 .env, .env.develop 아니면 환경변수를 기본적으로 읽을 수 있다.
# NestJS > NodeJs에서 돌아감 > 반드시 환경변수가 필요 없다.


RUN yarn build

FROM node:24-alpine AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]