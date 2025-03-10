# Система управления заявками  

Веб-приложение для управления заявками клиники, построенное с использованием Express.js, Pug и MongoDB.

## Особенности

- Создание и управление заявками
- Авторизация операторов
- Сортировка и поиск заявок
- Управление статусами заявок
- Адаптивный дизайн
- Работа без JavaScript (прогрессивное улучшение)

## Требования

- Docker
- Docker Compose

## Установка и запуск

1. Клонируйте репозиторий:

```bash
git clone <your-repo-url>
cd <repo-directory>
```

2. Запустите приложение с помощью Docker Compose:

```bash
# Для продакшн среды:
docker compose up -d

# Или для среды разработки:
docker compose -f compose.yaml -f compose.override.yaml up -d
```

3. Дождитесь полного запуска контейнеров (обычно несколько секунд). Вы можете проверить статус контейнеров командой:

```bash
docker compose ps
```

4. После того как контейнеры запущены, восстановите базу данных из дампа:

```bash
# Для среды разработки:
# 1. Копируем дамп в контейнер
docker cp ./database/dump/express-mongo-db-dev mongo-db-dev:/tmp/dump
# 2. Восстанавливаем базу данных (для Windows PowerShell)
docker exec mongo-db-dev sh -c "mongorestore --uri='mongodb://root:example@localhost:27017/express-mongo-db-dev?authSource=admin' /tmp/dump"

# Или для продакшн среды:
# 1. Копируем дамп в контейнер
docker cp ./database/dump/express-mongo-db-dev mongo-db:/tmp/dump
# 2. Восстанавливаем базу данных (для Windows PowerShell)
docker exec mongo-db sh -c "mongorestore --uri='mongodb://admin:secret@localhost:27017/express-mongo-db-prod?authSource=admin' /tmp/dump"
```

5. После успешного восстановления базы данных, приложение будет доступно по адресу: http://localhost:3000

Примечание: Если вы используете Linux или macOS, команды будут работать так же. Если у вас возникают проблемы с путями в Windows, убедитесь, что вы используете PowerShell, а не Command Prompt (cmd.exe).

## Учетные данные по умолчанию

После восстановления дампа базы данных вы можете войти в систему, используя следующие учетные данные:

- Email: example@email.com
- Пароль: 1234

## Структура проекта

- `database/dump/` - дамп базы данных
- `src/` - исходный код приложения
  - `controllers/` - контроллеры
  - `middleware/` - промежуточное ПО
  - `models/` - модели данных
  - `routes/` - маршруты
  - `utils/` - вспомогательные функции
  - `views/` - шаблоны Pug
- `compose.yaml` - конфигурация Docker для продакшена
- `compose.override.yaml` - дополнительная конфигурация для разработки
