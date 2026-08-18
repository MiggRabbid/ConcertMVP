import React from "react";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";

import { bnc } from "../../lib/bem";
import { cn } from "../../lib/classNames";
import { toIsoDate } from "../../lib/date";
import type { FooterData } from "../../types/home";
import { Reveal } from "../ui/Reveal";
import { StubLink } from "../ui/StubLink";

interface FooterProps {
  data: FooterData;
}

const siteFooter = new bnc("site-footer");
const infoBlock = new bnc("info-block");
const contactRow = new bnc("contact-row");
const socialInline = new bnc("social-inline");

export function Footer({ data }: FooterProps) {
  return (
    <footer className={siteFooter} id="contacts">
      <div className={siteFooter.el("sheet")}>
        <div className={siteFooter.el("grid")}>
          <Reveal className={infoBlock}>
            <h2 className={infoBlock.el("title")}>{data.contacts.title}</h2>
            <p className={contactRow}><FiMapPin className={contactRow.el("icon")} aria-hidden="true" /><StubLink className={contactRow.el("link")}>{data.contacts.address}</StubLink></p>
            <h3 className={infoBlock.el("subtitle")}>{data.contacts.ticketOfficeLabel}</h3>
            <p className={contactRow}><FiPhone className={contactRow.el("icon")} aria-hidden="true" /><StubLink className={contactRow.el("link")}>{data.contacts.ticketPhone}</StubLink></p>
            <div className={socialInline}>
              {data.contacts.socials.map((social) => <span className={socialInline.el("item")} key={social}>{social}</span>)}
            </div>
          </Reveal>

          <Reveal className={infoBlock} delay={100}>
            <h2 className={infoBlock.el("title")}>{data.additional.title}</h2>
            {data.additional.links.map((label) => <StubLink className={infoBlock.el("link")} key={label}>{label}</StubLink>)}
          </Reveal>

          <Reveal className={infoBlock}>
            <h2 className={infoBlock.el("title")}>{data.council.title}</h2>
            <p className={infoBlock.el("text")}>{data.council.text}</p>
            <StubLink className={cn(infoBlock.el("link"), infoBlock.el("link").mod("muted"))}>{data.council.membersLabel}</StubLink>
            <h3 className={infoBlock.el("subtitle")}>{data.partnership.title}</h3>
            <p className={contactRow}><FiMail className={contactRow.el("icon")} aria-hidden="true" /><StubLink className={contactRow.el("link")}>{data.partnership.email}</StubLink></p>
            <p className={cn(infoBlock.el("text"), infoBlock.el("text").mod("muted"))}>{data.partnership.audienceLabel}</p>
            <p className={contactRow}><FiPhone className={contactRow.el("icon")} aria-hidden="true" /><StubLink className={contactRow.el("link")}>{data.partnership.phone}</StubLink></p>
            <p className={contactRow}><FiMail className={contactRow.el("icon")} aria-hidden="true" /><StubLink className={contactRow.el("link")}>{data.partnership.audienceEmail}</StubLink></p>
          </Reveal>

          <Reveal className={cn(infoBlock, infoBlock.mod("news"))} delay={100}>
            <h2 className={infoBlock.el("title")}>{data.newsTitle}</h2>
            {data.news.map((item) => (
              <article className={infoBlock.el("news-item")} key={item.id}>
                <StubLink className={infoBlock.el("news-link")}>{item.title}</StubLink>
                <time className={infoBlock.el("news-date")} dateTime={toIsoDate(item.date)}>{item.date}</time>
              </article>
            ))}
          </Reveal>
        </div>

        <Reveal className={siteFooter.el("finale")}>
          <p className={siteFooter.el("finale-title")}>{data.finale.title}</p>
          <small className={siteFooter.el("copyright")}>{data.finale.year} © {data.finale.rights}</small>
        </Reveal>
      </div>
    </footer>
  );
}
