FROM node:18-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN npm install --force
ADD src src
ADD tsconfig.json tsconfig.json
ADD tsconfig.build.json tsconfig.build.json
ADD nest-cli.json nest-cli.json
RUN npm run build
# RUN npm prune --omit=dev --force
CMD [ "node", "./dist/main.js" ]