import type { Locale } from "../types/home";

export const messages = {
  ru: {
    header: { menu: "Открыть меню", close: "Закрыть меню", home: "Сириус — на главную", language: "Язык", navigation: "Основная навигация" },
    hero: { more: "Подробнее", previous: "Предыдущий слайд", next: "Следующий слайд", carousel: "Главные события" },
    programme: { title: "Афиша", all: "Все мероприятия", eventDetails: "Подробнее", choose: "Выберите программу" },
    mission: { read: "Читать полностью…" },
    concert: { back: "Вернуться к афише", date: "Дата", time: "Время", venue: "Место проведения", programme: "Программа концерта" },
    common: { tickets: "Купить билет", social: "Социальные сети" },
  },
  en: {
    header: { menu: "Open menu", close: "Close menu", home: "Sirius — home", language: "Language", navigation: "Main navigation" },
    hero: { more: "Discover", previous: "Previous slide", next: "Next slide", carousel: "Featured events" },
    programme: { title: "Programme", all: "All events", eventDetails: "Details", choose: "Choose a programme" },
    mission: { read: "Read the full address…" },
    concert: { back: "Back to programme", date: "Date", time: "Time", venue: "Venue", programme: "Concert programme" },
    common: { tickets: "Buy tickets", social: "Social media" },
  },
} as const;

export type Messages = (typeof messages)[Locale];

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
