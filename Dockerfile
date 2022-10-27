FROM node:lts-alpine as build
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY . .
RUN npm run build

FROM node:lts-alpine as prod
RUN mkdir -p /app && chown -R node:node /app
USER node
WORKDIR /app
COPY --chown=node:node .env package.json model.conf /app/
RUN npm install --only=production
COPY --chown=node:node --from=build /app/dist /app/dist
EXPOSE 3000
CMD ["node", "dist/main"]