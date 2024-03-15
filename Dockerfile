FROM node:lts-alpine
LABEL maintainer "linhvd"

RUN addgroup -g 1001 appuser && adduser -G appuser -g "App User" -s /bin/sh -D appuser

RUN mkdir /app
WORKDIR /app

RUN chown -R appuser:appuser /app
USER appuser

COPY package.json package-lock.json ./
COPY .env /app/.env

RUN set -x && mkdir -p /home/appuser/.npm && npm config set cache /home/appuser/.npm && npm ci

COPY . .

COPY --chown=appuser:appuser .env /app/.env

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
