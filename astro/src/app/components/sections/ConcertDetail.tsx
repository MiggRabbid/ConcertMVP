import { useTranslation } from "react-i18next";
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin } from "react-icons/fi";

import type { ConcertPageData } from "../../types/concert";
import { bnc } from "../../lib/bem";
import { toIsoDate } from "../../lib/date";
import { StubLink } from "../ui/StubLink";

interface ConcertDetailProps {
  data: ConcertPageData;
  homeHref: string;
}

const concertDetail = new bnc("concert-detail");
const primaryButton = new bnc("primary-button");

export function ConcertDetail({ data, homeHref }: ConcertDetailProps) {
  const { t } = useTranslation();
  const { event, project } = data;

  return (
    <main className={concertDetail} id="top">
      <a className={concertDetail.el("back")} href={`${homeHref}#programme`}>
        <FiArrowLeft aria-hidden="true" />
        {t("concert.back")}
      </a>

      <div className={concertDetail.el("layout")}>
        <div className={concertDetail.el("visual")}>
          <img className={concertDetail.el("image")} src={event.image} alt={event.title} fetchPriority="high" />
        </div>

        <article className={concertDetail.el("content")}>
          <p className={concertDetail.el("project")}>{project.title}</p>
          <h1 className={concertDetail.el("title")}>{event.title}</h1>

          <dl className={concertDetail.el("facts")}>
            <div className={concertDetail.el("fact")}>
              <FiCalendar className={concertDetail.el("fact-icon")} aria-hidden="true" />
              <dt>{t("concert.date")}</dt>
              <dd><time dateTime={toIsoDate(event.date)}>{event.date}</time></dd>
            </div>
            <div className={concertDetail.el("fact")}>
              <FiClock className={concertDetail.el("fact-icon")} aria-hidden="true" />
              <dt>{t("concert.time")}</dt>
              <dd>{event.time}</dd>
            </div>
            <div className={concertDetail.el("fact")}>
              <FiMapPin className={concertDetail.el("fact-icon")} aria-hidden="true" />
              <dt>{t("concert.venue")}</dt>
              <dd>{event.venue}, {event.age}</dd>
            </div>
          </dl>

          <section className={concertDetail.el("programme")} aria-labelledby="concert-programme-title">
            <h2 className={concertDetail.el("programme-title")} id="concert-programme-title">{t("concert.programme")}</h2>
            <p className={concertDetail.el("programme-name")}>{event.program}</p>
            <p className={concertDetail.el("description")}>{event.description}</p>
          </section>

          <StubLink className={primaryButton}>{t("common.tickets")}</StubLink>
        </article>
      </div>
    </main>
  );
}
