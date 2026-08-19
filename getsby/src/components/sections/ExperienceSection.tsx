import React from "react";
import { Reveal } from "../ui/Reveal";
import { StubLink } from "../ui/StubLink";
import { bnc } from "../../lib/bem";
import type { ExperienceContent } from "../../types/home";

const experience = new bnc("experience");
const architecturePanel = new bnc("architecture-panel");
const acousticsPanel = new bnc("acoustics-panel");
const hallsPanel = new bnc("halls-panel");
const hallCard = new bnc("hall-card");

interface ExperienceSectionProps {
  content: ExperienceContent;
  assetBase: string;
}

export function ExperienceSection({ content, assetBase }: ExperienceSectionProps) {
  return (
    <section className={experience} id="architecture">
      <div className={architecturePanel}>
        <div className={architecturePanel.el("scrim")} />
        <Reveal className={architecturePanel.el("copy")}>
          <p className={architecturePanel.el("eyebrow")}>{content.architecturePrefix}</p>
          <h2 className={architecturePanel.el("title")}>{content.architecture}</h2>
          <span className={architecturePanel.el("description")}>{content.architectureText}</span>
        </Reveal>
      </div>

      <div className={acousticsPanel}>
        <Reveal>
          <p className={acousticsPanel.el("eyebrow")}>{content.acousticsPrefix}</p>
          <h2 className={acousticsPanel.el("title")}>{content.acoustics}</h2>
          <span className={acousticsPanel.el("description")}>{content.acousticsText}</span>
        </Reveal>
      </div>

      <div className={hallsPanel}>
        <Reveal><h2 className={hallsPanel.el("title")}>{content.halls}</h2></Reveal>
        <div className={hallsPanel.el("grid")}>
          <Reveal className={hallCard}>
            <img className={hallCard.el("image")} src={`${assetBase}concert-assets/004-dc99272e.webp`} alt={content.mainHall} loading="lazy" />
            <StubLink className={hallCard.el("link")}>{content.mainHall}</StubLink>
          </Reveal>
          <Reveal className={hallCard} delay={130}>
            <img className={hallCard.el("image")} src={`${assetBase}concert-assets/084-f97dddcf.webp`} alt={content.chamberHall} loading="lazy" />
            <StubLink className={hallCard.el("link")}>{content.chamberHall}</StubLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
