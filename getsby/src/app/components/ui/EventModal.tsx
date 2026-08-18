import React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiCalendar, FiClock, FiMapPin, FiX } from "react-icons/fi";

import type { ConcertEvent } from "../../types/home";
import { bnc } from "../../lib/bem";

interface EventModalProps {
  event: ConcertEvent | null;
  onClose: () => void;
}

const eventModal = new bnc("event-modal");
const eyebrow = new bnc("eyebrow");
const primaryButton = new bnc("primary-button");

export function EventModal({ event, onClose }: EventModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!event) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (keyboardEvent: KeyboardEvent) => keyboardEvent.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div className={eventModal} role="dialog" aria-modal="true" aria-labelledby="event-title" onMouseDown={onClose}>
      <div className={eventModal.el("panel")} onMouseDown={(mouseEvent) => mouseEvent.stopPropagation()}>
        <button className={eventModal.el("close")} type="button" onClick={onClose} aria-label={t("common.close")}>
          <FiX className={eventModal.el("close-icon")} aria-hidden="true" />
        </button>
        <div className={eventModal.el("visual")}><img className={eventModal.el("image")} src={event.image} alt="" /></div>
        <div className={eventModal.el("content")}>
          <p className={eyebrow}>{event.program}</p>
          <h2 className={eventModal.el("title")} id="event-title">{event.title}</h2>
          <div className={eventModal.el("facts")}>
            <span className={eventModal.el("fact")}><FiCalendar className={eventModal.el("fact-icon")} aria-hidden="true" />{event.date}</span>
            <span className={eventModal.el("fact")}><FiClock className={eventModal.el("fact-icon")} aria-hidden="true" />{event.time}</span>
            <span className={eventModal.el("fact")}><FiMapPin className={eventModal.el("fact-icon")} aria-hidden="true" />{event.venue}, {event.age}</span>
          </div>
          <p className={eventModal.el("description")}>{event.description}</p>
          <button className={primaryButton} type="button" onClick={(clickEvent) => clickEvent.preventDefault()}>{t("common.tickets")}</button>
        </div>
      </div>
    </div>
  );
}
