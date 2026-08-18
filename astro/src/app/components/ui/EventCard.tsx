import { useTranslation } from "react-i18next";
import { FiArrowUpRight } from "react-icons/fi";

import type { ConcertEvent } from "../../types/home";
import { bnc } from "../../lib/bem";

interface EventCardProps {
  event: ConcertEvent;
  href: string;
}

const eventCard = new bnc("event-card");

export function EventCard({ event, href }: EventCardProps) {
  const { t } = useTranslation();

  return (
    <article className={eventCard}>
      <a className={eventCard.el("button")} href={href} aria-label={`${t("programme.eventDetails")}: ${event.title}`}>
        <span className={eventCard.el("image")}>
          <img className={eventCard.el("picture")} src={event.image} alt={event.title} loading="lazy" />
        </span>
        <span className={eventCard.el("copy")}>
          <strong className={eventCard.el("title")}>{event.title}</strong>
          <small className={eventCard.el("program")}>{event.program}</small>
          <span className={eventCard.el("meta")}>
            <span className={eventCard.el("details")}>{t("programme.eventDetails")}</span>
            <FiArrowUpRight className={eventCard.el("icon")} aria-hidden="true" />
          </span>
        </span>
      </a>
    </article>
  );
}
