# Gatsby MVP

Статическое приложение на TypeScript, Gatsby и React. Главная страница и страницы концертов полностью формируются при production-сборке.

```bash
npm install
npm run dev
```

Проверка типов и production-сборка:

```bash
npm run typecheck
npm run build
```

Страницы концертов создаются в `gatsby-node.ts` и используют шаблон `src/templates/concert.tsx`.
