FROM node:18-alpine
RUN apk add openssl && apk add ffmpeg
RUN npm install -g yarn --force
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY . /app

WORKDIR /app

RUN yarn install
RUN yarn build
EXPOSE 3333
CMD ["node", "dist/main.js"]