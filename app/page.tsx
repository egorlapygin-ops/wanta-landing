export default function Home() {
  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner">
          <div className="brand">
            Андрей <b>Борзов</b>
          </div>
          <div className="nav-links">
            <a href="#services">Услуги</a>
            <a href="#process">Процесс</a>
            <a href="#pricing">Стоимость</a>
          </div>
          <a href="#contact" className="nav-cta">
            Связаться
          </a>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">Стратегические отчёты для CEO</div>
            <h1 className="hero-title">
              От рынка <em>до плана действий</em> — за 4–6 недель.
            </h1>
            <p className="hero-sub">
              Готовлю глубокие стратегические отчёты для рекламных, медийных и
              adtech-компаний: рынок, конкуренты, смежные сегменты, план роста и
              обоснование инвестиций. Оформляю так, что не стыдно положить на
              стол совету директоров.
            </p>
            <div className="hero-cta">
              <a href="#contact" className="btn btn-primary">
                Обсудить задачу <span className="arrow">→</span>
              </a>
              <a href="#services" className="btn btn-ghost">
                Что я делаю
              </a>
            </div>
          </div>
          <div className="portrait">
            <img
              src="/portrait.jpg"
              alt="Андрей Борзов"
              className="portrait-img"
            />
            <div className="portrait-frame"></div>
            <div className="portrait-meta">
              <span>Москва</span>
              <span>2026</span>
            </div>
          </div>
        </div>
      </header>

      <div className="trust">
        <div className="wrap trust-inner">
          <div className="trust-label">Работаю на стыке</div>
          <div className="trust-tags">
            Programmatic <span>·</span> CTV <span>·</span> Retail Media{" "}
            <span>·</span> DOOH <span>·</span> AdTech <span>·</span> Digital
            Strategy
          </div>
        </div>
      </div>

      <section id="services">
        <div className="wrap">
          <div className="section-head">
            <div className="section-num">01 — Что я делаю</div>
            <div>
              <h2>
                Три формата работы. <em>Один результат —</em> ясность на 3 года
                вперёд.
              </h2>
              <p className="section-lead">
                От разовой стратегической карты до полноценного отчёта, который
                ложится в основу совета директоров и питча инвесторам.
              </p>
            </div>
          </div>

          <div className="services">
            <div className="service">
              <div className="service-num">— 01</div>
              <h3>Стратегический отчёт</h3>
              <p>
                Полный документ 60–80 страниц: рынок, конкуренты, позиция
                компании, смежные сегменты, ценностное предложение, план
                действий 2026–2029, юнит-экономика, риски.
              </p>
              <div className="meta">
                <span>Срок</span>
                <b>4–6 недель</b>
              </div>
            </div>
            <div className="service">
              <div className="service-num">— 02</div>
              <h3>Конкурентный аудит</h3>
              <p>
                Глубокий разбор 10–15 ключевых игроков рынка: бизнес-модели,
                выручка, маржа, продуктовая линейка, M&amp;A-активность, точки
                входа для атаки.
              </p>
              <div className="meta">
                <span>Срок</span>
                <b>2–3 недели</b>
              </div>
            </div>
            <div className="service">
              <div className="service-num">— 03</div>
              <h3>Investment memo</h3>
              <p>
                Документ для совета директоров и инвесторов: тезис, размер
                рынка, юнит-экономика, сценарии 7–10× роста, риски и допущения.
                Цифры, которые выдержат due diligence.
              </p>
              <div className="meta">
                <span>Срок</span>
                <b>3 недели</b>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="process">
        <div className="wrap">
          <div className="section-head">
            <div className="section-num">02 — Как это устроено</div>
            <div>
              <h2>
                Четыре недели. <em>Ноль воды.</em> Один документ.
              </h2>
              <p className="section-lead">
                Работаю один или с узкой командой аналитиков. Отчётность каждую
                неделю, без агентских накруток.
              </p>
            </div>
          </div>

          <div className="process">
            <div className="step">
              <div className="step-num">01</div>
              <h4>Распаковка</h4>
              <p>
                Интервью с CEO, разбор внутренних данных, формулировка ключевых
                вопросов, на которые должен ответить отчёт.
              </p>
              <span className="duration">Неделя 1</span>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <h4>Сбор и валидация</h4>
              <p>
                Первичные источники, отраслевые отчёты, экспертные интервью.
                Проверка цифр в трёх независимых источниках.
              </p>
              <span className="duration">Недели 2–3</span>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <h4>Синтез и модель</h4>
              <p>
                Тезисы, конкурентная карта, юнит-экономика, сценарии. Сверка с
                заказчиком на промежуточных вехах.
              </p>
              <span className="duration">Неделя 4</span>
            </div>
            <div className="step">
              <div className="step-num">04</div>
              <h4>Сборка и защита</h4>
              <p>
                Финальный PDF + презентация для совета. Сопровождаю защиту
                перед board или инвесторами.
              </p>
              <span className="duration">Неделя 5–6</span>
            </div>
          </div>
        </div>
      </section>

      <div className="quote">
        <div className="wrap">
          <blockquote>
            «Хорошая стратегия — это <em>не предсказание будущего</em>, а
            перечень решений, которые компания может принять уже завтра утром.»
          </blockquote>
          <cite>— рабочий принцип</cite>
        </div>
      </div>

      <section id="pricing">
        <div className="wrap">
          <div className="section-head">
            <div className="section-num">03 — Стоимость</div>
            <div>
              <h2>
                Прозрачно. <em>Без агентских накруток.</em>
              </h2>
              <p className="section-lead">
                Цены — ориентир. Финальная стоимость зависит от глубины и
                сроков. Аванс 50%, остаток — после защиты.
              </p>
            </div>
          </div>

          <div className="pricing">
            <div className="plan">
              <h4>Аудит</h4>
              <p className="desc">Конкурентный разбор + позиционная карта.</p>
              <div className="price">
                от <em>650</em> т.₽
              </div>
              <div className="price-note">2–3 недели · 25–35 страниц</div>
              <ul>
                <li>10–15 конкурентов</li>
                <li>Финансовые показатели</li>
                <li>Карта M&amp;A активности</li>
                <li>Презентация на 1 час</li>
              </ul>
              <a href="#contact" className="btn btn-ghost">
                Запросить <span className="arrow">→</span>
              </a>
            </div>

            <div className="plan featured">
              <h4>Стратегический отчёт</h4>
              <p className="desc">
                Полный документ для CEO и совета директоров.
              </p>
              <div className="price">
                от <em>1.8</em> млн ₽
              </div>
              <div className="price-note">4–6 недель · 60–80 страниц</div>
              <ul>
                <li>Рынок, конкуренты, смежные сегменты</li>
                <li>Ценностное предложение</li>
                <li>План действий на 3 года</li>
                <li>Юнит-экономика и сценарии</li>
                <li>Сопровождение защиты на board</li>
              </ul>
              <a href="#contact" className="btn btn-primary">
                Обсудить <span className="arrow">→</span>
              </a>
            </div>

            <div className="plan">
              <h4>Investment memo</h4>
              <p className="desc">
                Документ под раунд или внутреннее обоснование.
              </p>
              <div className="price">
                от <em>1.2</em> млн ₽
              </div>
              <div className="price-note">3 недели · 25–40 страниц</div>
              <ul>
                <li>Тезис и market sizing</li>
                <li>Юнит-экономика</li>
                <li>Три сценария</li>
                <li>Карта рисков и допущений</li>
              </ul>
              <a href="#contact" className="btn btn-ghost">
                Запросить <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="wrap">
          <div
            className="section-num"
            style={{ display: "inline-block", marginBottom: 24 }}
          >
            04 — Связаться
          </div>
          <h2>
            Расскажите задачу — <em>верну план на одной странице</em> за 48
            часов.
          </h2>
          <p className="contact-lead">
            Бесплатная диагностическая встреча 30 минут. По итогам — короткое
            резюме: что делать, в каком объёме, сроки и стоимость. Без
            обязательств.
          </p>
          <div className="contact-cta">
            <a
              href="mailto:Andrey.borzov@gmail.com"
              className="btn btn-primary"
            >
              Написать на почту <span className="arrow">→</span>
            </a>
            <a href="https://t.me/" className="btn btn-ghost">
              Telegram
            </a>
          </div>
          <div className="contact-meta">
            <a href="mailto:Andrey.borzov@gmail.com">
              Andrey.borzov@gmail.com
            </a>
            {" · "}Москва
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap foot-inner">
          <div>© 2026 Андрей Борзов · Независимая стратегическая практика</div>
          <div>Сделано в Москве</div>
        </div>
      </footer>
    </>
  );
}
