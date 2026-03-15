# Wanta — лендинг

Лендинг продукта, который превращает сохранённый контент в систему будущих действий.

## Стек

- Next.js 14+
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Сборка

```bash
npm run build
npm start
```

## Структура

- `app/` — страницы и layout
- `components/layout/` — Header, Footer, Section
- `components/ui/` — Button, Badge, Input
- `components/sections/` — секции лендинга
- `content/landingContent.ts` — все тексты (удобно менять без правки компонентов)
- `app/api/waitlist/` — API для waitlist (TODO: подключить Supabase/Airtable/и т.д.)

## Waitlist

Форма отправляет POST на `/api/waitlist` с полями `email` и `category`. В `app/api/waitlist/route.ts` есть TODO для интеграции с вашим бэкендом.

## Favicon

Добавьте `public/favicon.ico` для иконки во вкладке.
