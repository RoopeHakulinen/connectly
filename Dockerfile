FROM node:22-alpine3.20 as ui

ENV SKIP_PUPPETEER_BROWSER_DOWNLOAD true
ENV NODE_ENV build
RUN apk update && apk upgrade && apk add python3 py3-pip build-base
RUN apk add chromium
USER node

COPY --chown=node:node ./ui /home/node/ui

WORKDIR /home/node/ui
RUN npm ci && npm run build


FROM node:22-alpine3.20 as backend

ENV NODE_ENV build

RUN apk update && apk upgrade
USER node

COPY --chown=node:node ./backend /home/node/backend

WORKDIR /home/node/backend
RUN npm ci && npm run build

FROM node:22-alpine3.20
ENV NODE_ENV production
RUN apk update && apk upgrade
RUN apk add chromium

USER node
WORKDIR /home/node
COPY --from=backend /home/node/backend/package*.json /home/node/
COPY --from=backend /home/node/backend/node_modules/ /home/node/node_modules/
COPY --from=backend /home/node/backend/dist/ /home/node/dist/
COPY --from=backend /home/node/backend/prisma/ /home/node/prisma/
COPY --from=ui /home/node/ui/dist/ui /home/node/dist/public
ENV PATH /home/node/node_modules/.bin:$PATH

CMD ["./start.sh"]