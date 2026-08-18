# ConcertMVP

Две независимые SSG-реализации сайта Концертного центра «Сириус»:

- [Astro + React](https://miggrabbid.github.io/ConcertMVP/astro/)
- [Gatsby + React](https://miggrabbid.github.io/ConcertMVP/getsby/)

Обе версии собираются и публикуются одним workflow `.github/workflows/deploy-pages.yml`.

Каждый проект формирует на этапе сборки главную страницу и 18 страниц концертов по маршруту:

```text
/{framework}/projects/{projectId}/concerts/{concertId}/
```
