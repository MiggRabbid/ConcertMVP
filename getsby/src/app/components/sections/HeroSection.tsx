import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import type { HeroSlide } from "../../types/home";
import { StubLink } from "../ui/StubLink";
import { bnc } from "../../lib/bem";
import { cn } from "../../lib/classNames";

interface HeroSectionProps {
  slides: HeroSlide[];
  brandImage: string;
}

const hero = new bnc("hero");
const heroSlide = new bnc("hero-slide");
const textLink = new bnc("text-link");

export function HeroSection({ slides, brandImage }: HeroSectionProps) {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(
      () => setActiveSlide((value) => (value + 1) % slides.length),
      7_500,
    );
    return () => window.clearInterval(interval);
  }, [slides.length]);

  const navigate = (direction: number) => {
    setActiveSlide((value) => (value + direction + slides.length) % slides.length);
  };

  return (
    <section className={hero} id="top" aria-roledescription="carousel">
      <div className={hero.el("backdrop")} />
      <div className={hero.el("brand")} aria-hidden="true">
        <img className={hero.el("brand-image")} src={brandImage} alt="" />
        <span className={hero.el("brand-copy")}><b className={hero.el("brand-title")}>Сириус</b><small className={hero.el("brand-subtitle")}>концертный<br />центр</small></span>
      </div>
      <div className={hero.el("viewport")}>
        <div className={hero.el("track")} style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
          {slides.map((slide, index) => (
            <article className={heroSlide} key={slide.id} aria-hidden={index !== activeSlide}>
              <div className={heroSlide.el("image-wrap")}>
                <img className={heroSlide.el("image")} src={slide.image} alt="" />
              </div>
              <div className={heroSlide.el("copy")}>
                <h1 className={heroSlide.el("title")}>{slide.title}</h1>
                <p className={heroSlide.el("description")}>{slide.description}</p>
                <StubLink className={textLink}>
                  {t("hero.more")} <FiArrowUpRight className={textLink.el("icon")} aria-hidden="true" />
                </StubLink>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className={hero.el("controls")}>
        <button className={hero.el("control-button")} type="button" aria-label={t("hero.previous")} onClick={() => navigate(-1)}><FiChevronLeft className={hero.el("control-icon")} aria-hidden="true" /></button>
        <div className={hero.el("dots")}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={cn(hero.el("dot"), hero.el("dot").bod("active", activeSlide === index))}
              type="button"
              aria-label={`${index + 1}`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
        <button className={hero.el("control-button")} type="button" aria-label={t("hero.next")} onClick={() => navigate(1)}><FiChevronRight className={hero.el("control-icon")} aria-hidden="true" /></button>
      </div>
    </section>
  );
}
