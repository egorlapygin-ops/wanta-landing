# Как выложить лендинг на домен

## Вариант 1: Vercel (проще всего для Next.js)

Vercel — сервис от создателей Next.js. Бесплатный тариф, свой домен, авто-деплой из GitHub.

### Шаги

1. **Зарегистрируйтесь на [vercel.com](https://vercel.com)** (можно через GitHub).

2. **Залейте проект в GitHub** (если ещё не залит):
   - На [github.com](https://github.com) нажмите **New repository**.
   - Название, например: `wanta-landing`. Создайте репозиторий.
   - В терминале в папке проекта:
   ```bash
   cd /Users/egorlapygin/Documents/Wanta
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ВАШ_ЛОГИН/wanta-landing.git
   git push -u origin main
   ```
   Подставьте свой логин и репозиторий.

3. **Подключите репозиторий к Vercel**:
   - В Vercel: **Add New… → Project**.
   - Импортируйте репозиторий с GitHub.
   - **Root Directory** оставьте как есть.
   - **Framework Preset**: Next.js (подставится сам).
   - Нажмите **Deploy**.

4. **Свой домен**:
   - В проекте Vercel: **Settings → Domains**.
   - Добавьте домен (например `wanta.ru` или `landing.wanta.ru`).
   - Vercel покажет, какие DNS-записи добавить у регистратора домена (A или CNAME).
   - В панели, где купили домен (Reg.ru, Timeweb, Cloudflare и т.д.), добавьте эти записи. Через 5–60 минут домен начнёт открываться.

Итог: при каждом `git push` в `main` Vercel сам пересоберёт и обновит сайт.

---

## Вариант 2: Netlify

1. Зарегистрируйтесь на [netlify.com](https://netlify.com).
2. **Add new site → Import an existing project** → подключите GitHub и выберите репозиторий.
3. **Build command**: `npm run build`  
   **Publish directory**: `.next` — **не подходит** для Next.js.  
   Лучше использовать **Netlify Next.js runtime**: при импорте выберите framework **Next.js**, Netlify подставит команды сам.
4. Свой домен: **Domain settings → Add custom domain** и настройте DNS по подсказкам Netlify.

---

## Вариант 3: Свой сервер (VPS)

Если есть сервер (Linux):

```bash
# На сервере: установите Node.js 18+, затем:
git clone https://github.com/ВАШ_ЛОГИН/wanta-landing.git
cd wanta-landing
npm install
npm run build
npm start
```

Приложение будет слушать порт 3000. Настройте Nginx как reverse proxy и SSL (Let's Encrypt). Для автозапуска используйте `pm2`: `pm2 start npm -- start`.

---

## Кратко

| Способ   | Сложность | Свой домен | Цена        |
|----------|-----------|------------|-------------|
| Vercel   | Легко     | Да         | Бесплатно*  |
| Netlify  | Легко     | Да         | Бесплатно*  |
| Свой VPS | Сложнее   | Да         | Платный VPS |

\* В пределах бесплатного тарифа (обычно хватает для лендинга).

**Рекомендация:** начать с **Vercel** + GitHub + свой домен по шагам выше.
