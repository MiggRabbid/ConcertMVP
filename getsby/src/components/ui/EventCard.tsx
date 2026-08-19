import React from "react";
import { FiArrowUpRight } from "react-icons/fi";

import type { ConcertEvent } from "../../types/home";
import { bnc } from "../../lib/bem";

interface EventCardProps {
  event: ConcertEvent;
  href: string;
  detailsLabel: string;
}

const eventCard = new bnc("event-card");

export function EventCard({ event, href, detailsLabel }: EventCardProps) {
  return (
    <article className={eventCard}>
      <a className={eventCard.el("button")} href={href} aria-label={`${detailsLabel}: ${event.title}`}>
        <span className={eventCard.el("image")}>
          <img className={eventCard.el("picture")} src={event.image} alt={event.title} loading="lazy" />
        </span>
        <span className={eventCard.el("copy")}>
          <strong className={eventCard.el("title")}>{event.title}</strong>
          <small className={eventCard.el("program")}>{event.program}</small>
          <span className={eventCard.el("meta")}>
            <span className={eventCard.el("details")}>{detailsLabel}</span>
            <FiArrowUpRight className={eventCard.el("icon")} aria-hidden="true" />
          </span>
        </span>
      </a>
    </article>
  );
}
