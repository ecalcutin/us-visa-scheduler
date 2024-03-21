FROM mcr.microsoft.com/playwright:v1.42.1 as Executor

WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
RUN npx playwright install --with-deps
RUN npm i
COPY src src/
RUN npm run build
CMD ["npm", "start"]
