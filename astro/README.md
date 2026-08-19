# Astro MVP

Статический сайт на TypeScript и Astro. Русские и английские версии главной страницы и страниц концертов полностью генерируются через SSG.

Структура:

- `src/pages/` — файловые маршруты и `getStaticPaths()`;
- `src/templates/` — шаблоны главной страницы и страницы концерта;
- `src/layouts/` — HTML/SEO-layout и общий site layout;
- `src/components/` — layout-, section- и UI-компоненты;
- `src/app/data/` — build-time данные;
- `src/app/i18n/` — типизированные подписи RU/EN.

React и hydration не используются. Меню, карусель, фильтр и reveal-анимации реализованы небольшими нативными DOM-контроллерами.

```bash
npm install
npm run dev
```

Проверка типов и production-сборка:

```bash
npm run check
npm run build
```

Страницы концертов определены локализованными файловыми маршрутами и генерируются через `getStaticPaths()`.
