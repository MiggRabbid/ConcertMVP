import React from "react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { createConcertHref } from "../../api/publicPath";
import type { ProgramCategory } from "../../types/home";
import { EventCard } from "../ui/EventCard";
import { Reveal } from "../ui/Reveal";
import { bnc } from "../../lib/bem";
import { cn } from "../../lib/classNames";

interface ProgrammeSectionProps {
  categories: ProgramCategory[];
  assetBase: string;
}

const programme = new bnc("programme");
const programmeGroup = new bnc("programme-group");
const pageShell = new bnc("page-shell");
const eyebrow = new bnc("eyebrow");
const srOnly = new bnc("sr-only");
const eventGrid = new bnc("event-grid");

export function ProgrammeSection({ categories, assetBase }: ProgrammeSectionProps) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");
  const visibleCategories = useMemo(
    () => activeCategory === "all" ? categories : categories.filter((category) => category.id === activeCategory),
    [activeCategory, categories],
  );

  return (
    <section className={programme} id="programme">
      <div className={cn(programme.el("header"), pageShell)}>
        <Reveal>
          <p className={eyebrow}>{t("programme.title")}</p>
          <h2 className={programme.el("title")}>{t("programme.all")}</h2>
        </Reveal>
        <label className={programme.el("select")}>
          <span className={srOnly}>{t("programme.choose")}</span>
          <select className={programme.el("select-control")} value={activeCategory} onChange={(event) => setActiveCategory(event.target.value)}>
            <option value="all">{t("programme.all")}</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}
          </select>
        </label>
        <div className={programme.el("tabs")} role="tablist" aria-label={t("programme.choose")}>
          <button className={cn(programme.el("tab"), programme.el("tab").bod("active", activeCategory === "all"))} type="button" onClick={() => setActiveCategory("all")}>{t("programme.all")}</button>
          {categories.map((category) => (
            <button key={category.id} className={cn(programme.el("tab"), programme.el("tab").bod("active", activeCategory === category.id))} type="button" onClick={() => setActiveCategory(category.id)}>
              {category.title}
            </button>
          ))}
        </div>
      </div>

      <div className={cn(programme.el("body"), pageShell)}>
        {visibleCategories.map((category, categoryIndex) => (
          <section className={programmeGroup} id={`category-${category.id}`} key={category.id}>
            <Reveal>
              <header className={programmeGroup.el("banner")}>
                <img className={programmeGroup.el("image")} src={category.image} alt={category.title} loading="lazy" />
                <h3 className={programmeGroup.el("title")}>{category.title}</h3>
                <p className={programmeGroup.el("period")}>{category.period}</p>
              </header>
            </Reveal>
            <div className={eventGrid}>
              {category.events.map((event, index) => (
                <Reveal key={event.id} delay={(index % 3) * 110}>
                  <EventCard event={event} href={createConcertHref(assetBase, category.id, event.id)} />
                </Reveal>
              ))}
            </div>
            {categoryIndex < visibleCategories.length - 1 && <div className={programmeGroup.el("divider")} aria-hidden="true" />}
          </section>
        ))}
      </div>
    </section>
  );
}
