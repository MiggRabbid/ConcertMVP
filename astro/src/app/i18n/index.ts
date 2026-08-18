import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ru: {
    translation: {
      header: { menu: "Открыть меню", close: "Закрыть меню", home: "Сириус — на главную", language: "Язык", navigation: "Основная навигация" },
      hero: { more: "Подробнее", previous: "Предыдущий слайд", next: "Следующий слайд", carousel: "Главные события" },
      programme: { title: "Афиша", all: "Все мероприятия", eventDetails: "Подробнее", choose: "Выберите программу" },
      mission: { read: "Читать полностью…" },
      concert: { back: "Вернуться к афише", date: "Дата", time: "Время", venue: "Место проведения", programme: "Программа концерта" },
      common: { loading: "Загружаем афишу", error: "Не удалось загрузить данные", retry: "Повторить", close: "Закрыть", tickets: "Купить билет", social: "Социальные сети" },
    },
  },
  en: {
    translation: {
      header: { menu: "Open menu", close: "Close menu", home: "Sirius — home", language: "Language", navigation: "Main navigation" },
      hero: { more: "Discover", previous: "Previous slide", next: "Next slide", carousel: "Featured events" },
      programme: { title: "Programme", all: "All events", eventDetails: "Details", choose: "Choose a programme" },
      mission: { read: "Read the full address…" },
      concert: { back: "Back to programme", date: "Date", time: "Time", venue: "Venue", programme: "Concert programme" },
      common: { loading: "Loading the programme", error: "Unable to load data", retry: "Try again", close: "Close", tickets: "Buy tickets", social: "Social media" },
    },
  },
} as const;

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: "ru",
    fallbackLng: "ru",
    interpolation: { escapeValue: false },
  });
}

export { i18n };
