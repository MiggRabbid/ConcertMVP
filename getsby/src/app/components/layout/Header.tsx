import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMapPin, FiMenu, FiX } from "react-icons/fi";

import type { HeaderData, Locale } from "../../types/home";
import { bnc } from "../../lib/bem";
import { cn } from "../../lib/classNames";

interface HeaderProps {
  data: HeaderData;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const siteHeader = new bnc("site-header");
const localeSwitch = new bnc("locale-switch");
const menuTrigger = new bnc("menu-trigger");
const menuOverlay = new bnc("menu-overlay");

export function Header({ data, locale, onLocaleChange }: HeaderProps) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const updateHeader = () => setPastHero(window.scrollY > window.innerHeight * 0.82);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header className={cn(siteHeader, siteHeader.bod("scrolled", pastHero), siteHeader.bod("menu-open", menuOpen))}>
        <div className={siteHeader.el("address")}>
          <FiMapPin className={siteHeader.el("address-icon")} aria-hidden="true" />
          <span>{data.location}</span>
        </div>
        <a className={siteHeader.el("mark")} href="#top" aria-label="Сириус — наверх">
          <img className={siteHeader.el("mark-image")} src={data.logo} alt="" />
        </a>
        <div className={siteHeader.el("actions")}>
          <div className={localeSwitch} aria-label="Language">
            <button className={cn(localeSwitch.el("option"), localeSwitch.el("option").bod("active", locale === "en"))} type="button" onClick={() => onLocaleChange("en")}>EN</button>
            <span>/</span>
            <button className={cn(localeSwitch.el("option"), localeSwitch.el("option").bod("active", locale === "ru"))} type="button" onClick={() => onLocaleChange("ru")}>RU</button>
          </div>
          <button
            className={menuTrigger}
            type="button"
            aria-label={t(menuOpen ? "header.close" : "header.menu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <FiX className={menuTrigger.el("icon")} aria-hidden="true" /> : <FiMenu className={menuTrigger.el("icon")} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div className={cn(menuOverlay, menuOverlay.bod("open", menuOpen))} aria-hidden={!menuOpen}>
        <div className={menuOverlay.el("panel")}>
          <nav className={menuOverlay.el("navigation")} aria-label="Основная навигация">
            {data.navigation.map((item, index) => (
              <a
                key={item.id}
                href={item.href}
                className={menuOverlay.el("link")}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
                style={{ "--menu-index": index } as React.CSSProperties}
              >
                <span className={menuOverlay.el("index")}>0{index + 1}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <p className={menuOverlay.el("address")}>{data.location}</p>
        </div>
      </div>
    </>
  );
}
