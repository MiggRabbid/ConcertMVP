# Astro MVP

Статическое приложение на TypeScript, Astro и React. Главная страница и страницы концертов генерируются через SSG; React используется для hydration интерактивных элементов и i18n.

```bash
npm install
npm run dev
```

Проверка типов и production-сборка:

```bash
npm run check
npm run build
```

Страницы концертов определены файловым маршрутом `src/pages/projects/[projectId]/concerts/[concertId].astro` и генерируются через `getStaticPaths`.
