Переключатель формата страницы «Человек / Агент»: та же страница для человека или в Markdown для ИИ-агента.

Передаёт потребитель: `value` (`"human"` | `"agent"`), `onChange` (если страница показывает Markdown у себя), иначе ссылки `humanHref` и `agentHref` (по умолчанию `index.md`, `type="text/markdown"`).

- Стоит вверху SideNav сразу под логотипом (`format` и `onFormat` у SideNav), на каждой странице сайта.
- Агентская версия каждой страницы лежит рядом с ней: `/` → `/index.md`, `/product` → `/product.md`. В `<head>` — `<link rel="alternate" type="text/markdown">` на неё и на `/llms.txt`.
- Активный пункт — пилюля `paper` с рамкой `line` на подложке `surface`.
