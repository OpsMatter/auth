FROM node:lts

WORKDIR /usr/src/app

RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml .env ./
RUN pnpm install --prod --frozen-lockfile

ADD build .

EXPOSE 8000

ENV NODE_ENV production

CMD ["node", "src/index.js"]