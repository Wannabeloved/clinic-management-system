# Этап 1: Базовый образ с общими настройками
FROM node:18 AS base
WORKDIR /app
COPY package*.json ./
EXPOSE 3000

# Этап 2: Сборка для разработки
FROM base AS development
RUN npm install
COPY . .
CMD ["npm", "start"]

# Этап 3: Сборка для продакшена
FROM base AS production
RUN npm ci --only=production
# Копируем исходный код без тестов
COPY src ./src
# Исключаем тестовые файлы
RUN find ./src -name "*.test.js" -type f -delete
# Копируем все статические файлы
COPY public ./public
COPY views ./views
COPY resources ./resources
CMD ["npm", "start"]
