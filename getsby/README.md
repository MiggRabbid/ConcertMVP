# Gatsby MVP

Статический сайт на TypeScript, Gatsby и React. Русские и английские версии главной страницы и страниц концертов полностью формируются при production-сборке.

Структура:

- `gatsby-node.ts` — создание всех локализованных страниц;
- `src/templates/` — шаблоны главной страницы и страницы концерта;
- `src/components/layout/` — общий layout;
- `src/components/sections/` — секции страниц;
- `src/components/seo/` — единая SEO-разметка;
- `src/data/` — build-time данные.

Основной контент передаётся шаблонам через `pageContext` и не запрашивается повторно в браузере. Gatsby создаёт готовый HTML через SSG, затем гидратирует React-компоненты для интерактивности.

```bash
npm install
npm run dev
```

Проверка типов и production-сборка:

```bash
npm run typecheck
npm run build
```

Все страницы создаются в `gatsby-node.ts` и используют шаблоны из `src/templates/`.
