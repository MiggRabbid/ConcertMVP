import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ru: {
    translation: {
      header: { menu: "Открыть меню", close: "Закрыть меню" },
      hero: { more: "Подробнее", previous: "Предыдущий слайд", next: "Следующий слайд" },
      programme: { title: "Афиша", all: "Все мероприятия", eventDetails: "Подробнее", choose: "Выберите программу" },
      mission: { read: "Читать полностью…" },
      common: { loading: "Загружаем афишу", error: "Не удалось загрузить данные", retry: "Повторить", close: "Закрыть", tickets: "Купить билет", social: "Социальные сети" },
    },
  },
  en: {
    translation: {
      header: { menu: "Open menu", close: "Close menu" },
      hero: { more: "Discover", previous: "Previous slide", next: "Next slide" },
      programme: { title: "Programme", all: "All events", eventDetails: "Details", choose: "Choose a programme" },
      mission: { read: "Read the full address…" },
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
