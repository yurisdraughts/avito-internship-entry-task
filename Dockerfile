FROM node:21-alpine
ARG TOKEN
ENV TOKEN=${TOKEN}
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 7070
CMD [ "npx", "serve", "dist", "-l", "7070" ]