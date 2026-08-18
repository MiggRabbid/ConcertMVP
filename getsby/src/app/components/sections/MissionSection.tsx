import React from "react";
import { useTranslation } from "react-i18next";
import { FiArrowUpRight } from "react-icons/fi";

import type { MissionContent } from "../../types/home";
import { Reveal } from "../ui/Reveal";
import { StubLink } from "../ui/StubLink";
import { bnc } from "../../lib/bem";

interface MissionSectionProps {
  content: MissionContent;
  assetBase: string;
}

const mission = new bnc("mission");

export function MissionSection({ content, assetBase }: MissionSectionProps) {
  const { t } = useTranslation();

  return (
    <section className={mission} id="mission">
      <div className={mission.el("copy")}>
        <Reveal>
          <h2 className={mission.el("title")}>{content.title}</h2>
          <div className={mission.el("lead")}>
            {content.paragraphs.map((paragraph) => <p className={mission.el("paragraph")} key={paragraph}>{paragraph}</p>)}
          </div>
        </Reveal>
        <Reveal className={mission.el("greeting")} delay={140}>
          <img className={mission.el("greeting-image")} src={`${assetBase}concert-assets/085-c0c24317.webp`} alt={content.greetingName} loading="lazy" />
          <div className={mission.el("greeting-copy")}>
            <span className={mission.el("greeting-label")}>{content.greetingLabel}</span>
            <strong className={mission.el("greeting-name")}>{content.greetingName}</strong>
            <small className={mission.el("greeting-role")}>{content.greetingRole}</small>
            <StubLink className={mission.el("greeting-link")}>{t("mission.read")} <FiArrowUpRight aria-hidden="true" /></StubLink>
          </div>
        </Reveal>
      </div>
      <Reveal className={mission.el("image")}>
        <img className={mission.el("image-picture")} src={`${assetBase}concert-assets/084-f97dddcf.webp`} alt={content.title} loading="lazy" />
      </Reveal>
    </section>
  );
}
