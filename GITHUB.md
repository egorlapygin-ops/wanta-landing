# Как создать репозиторий на GitHub и залить проект

## Часть 1: Создать репозиторий на сайте GitHub

1. Зайдите на **https://github.com** и войдите в аккаунт (или зарегистрируйтесь).

2. Нажмите зелёную кнопку **New** (или **+** в правом верхнем углу → **New repository**).

3. Заполните:
   - **Repository name** — например: `wanta-landing` (латиница, без пробелов).
   - **Description** — по желанию: "Лендинг Wanta".
   - Выберите **Public**.
   - **НЕ ставьте** галочки "Add a README", "Add .gitignore", "Choose a license" — у вас уже есть файлы в проекте.

4. Нажмите **Create repository**.

5. На следующей странице GitHub покажет команды. Вам понадобится **URL репозитория** — он выглядит так:
   ```
   https://github.com/ВАШ_ЛОГИН/wanta-landing.git
   ```
   Или через SSH:
   ```
   git@github.com:ВАШ_ЛОГИН/wanta-landing.git
   ```
   Подставьте свой логин вместо `ВАШ_ЛОГИН`.

---

## Часть 2: Залить проект с компьютера

Откройте **терминал** (в Cursor: Terminal → New Terminal) и выполните команды **по порядку**. Подставьте свой URL репозитория вместо `ВАШ_ЛОГИН` и `wanta-landing`, если назвали иначе.

### 1. Перейти в папку проекта

```bash
cd /Users/egorlapygin/Documents/Wanta
```

### 2. Инициализировать Git (если ещё не делали)

```bash
git init
```

### 3. Добавить все файлы

```bash
git add .
```

### 4. Сделать первый коммит

```bash
git commit -m "Первый коммит: лендинг Wanta"
```

### 5. Переименовать ветку в main (если нужно)

```bash
git branch -M main
```

### 6. Подключить удалённый репозиторий

Подставьте **свой** URL (с шага 5 из Части 1):

```bash
git remote add origin https://github.com/ВАШ_ЛОГИН/wanta-landing.git
```

Пример: если ваш логин `ivanov`, то:
```bash
git remote add origin https://github.com/ivanov/wanta-landing.git
```

### 7. Отправить код на GitHub

```bash
git push -u origin main
```

Если GitHub попросит авторизацию:
- при использовании **HTTPS** может запросить логин и пароль — пароль теперь не подходит, нужен **Personal Access Token** (см. ниже);
- либо настройте **SSH-ключ** и используйте URL вида `git@github.com:ВАШ_ЛОГИН/wanta-landing.git`.

---

## Если просят логин и пароль (GitHub больше не принимает пароль)

1. На GitHub: **Settings** (ваш профиль) → **Developer settings** → **Personal access tokens** → **Tokens (classic)**.
2. **Generate new token (classic)**.
3. Название, например: `cursor-wanta`. Выберите срок действия. Отметьте право **repo**.
4. Сгенерируйте и **скопируйте токен** (один раз показывается).
5. В терминале при `git push` в поле пароля **вставьте этот токен** (логин — ваш GitHub-логин).

---

## Проверка

Обновите страницу репозитория на GitHub — там должны появиться все файлы проекта (без папки `node_modules` — она в .gitignore).

Дальше можно подключать этот репозиторий к Vercel по инструкции в **DEPLOY.md**.
