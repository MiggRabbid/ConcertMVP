# Design QA — главная страница Концертного центра «Сириус»

**Статус: PASS**

Проверены production-сборки Astro и Gatsby. Обе реализации используют один UI-контракт и одинаковые данные, стили, адаптивное поведение и интерактивные сценарии.

## Область проверки

- Эталон: материалы и снимки главной страницы из `reference-assets/concert-home`.
- Astro: `http://127.0.0.1:4321/`.
- Gatsby: `http://127.0.0.1:9000/`.
- Desktop viewport: 1440 × 1000.
- Mobile viewport: iPhone 13, layout viewport 391 × 666.

## Результаты

| Область | Astro | Gatsby |
| --- | --- | --- |
| Композиция, секции, типографика и изображения | PASS | PASS |
| БЭМ-классы через `bnc` | PASS | PASS |
| Desktop-адаптив без горизонтального переполнения | PASS | PASS |
| Mobile-адаптив без горизонтального переполнения страницы | PASS | PASS |
| Мобильная горизонтальная лента событий | PASS | PASS |
| Меню и закрытие меню | PASS | PASS |
| Переключение RU/EN с повторным Axios-запросом | PASS | PASS |
| Модальное окно события | PASS | PASS |
| Анимации появления при прокрутке | PASS, 37/37 | PASS, 37/37 |
| Ошибки JavaScript и console errors | 0 | 0 |
| Изображения без `alt` | 0 | 0 |
| Ссылки без `href` | 0 | 0 |

Проверены визуальные состояния hero, открытого меню, афиши, модального окна, архитектурного блока и полной страницы. Для mobile отдельно проверены селект программ, скрытие desktop-вкладок и фактический скролл ленты событий. Предусмотрен `prefers-reduced-motion`.

Классы компонентов формируются через `bnc`: блоки — `block`, элементы — `block__element`, модификаторы — `block-modifier` согласно соглашению библиотеки. Для совместимости старого CommonJS-пакета с Astro SSR и Gatsby используется единый адаптер `src/app/lib/bem.ts`.

Данные живого сайта и переходы на внешние страницы намеренно заменены моковым Axios API и ссылками-заглушками по условиям MVP.

## Дефекты

| Severity | Открыто |
| --- | ---: |
| P0 | 0 |
| P1 | 0 |
| P2 | 0 |
| P3 | 0 |
| P4 | 0 |

## Артефакты

Скриншоты и автоматизированный сценарий проверки находятся в `reference-assets/implementation-qa`:

- `astro-desktop-hero.png`, `gatsby-desktop-hero.png`;
- `astro-desktop-programme.png`, `gatsby-desktop-programme.png`;
- `astro-desktop-modal.png`, `gatsby-desktop-modal.png`;
- `astro-desktop-full.png`, `gatsby-desktop-full.png`;
- `astro-mobile-hero.png`, `gatsby-mobile-hero.png`;
- `astro-mobile-menu.png`, `gatsby-mobile-menu.png`;
- `astro-mobile-full.png`, `gatsby-mobile-full.png`;
- `qa.mjs` — воспроизводимый Playwright-сценарий.
