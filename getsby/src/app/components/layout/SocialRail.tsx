import React from "react";
import { useTranslation } from "react-i18next";
import { FaTelegramPlane, FaVk } from "react-icons/fa";

import { StubLink } from "../ui/StubLink";
import { bnc } from "../../lib/bem";

const socialRail = new bnc("social-rail");

export function SocialRail() {
  const { t } = useTranslation();

  return (
    <aside className={socialRail} aria-label={t("common.social")}>
      <StubLink className={socialRail.el("link")} aria-label="Telegram"><FaTelegramPlane className={socialRail.el("icon")} aria-hidden="true" /></StubLink>
      <StubLink className={socialRail.el("link")} aria-label="VK"><FaVk className={socialRail.el("icon")} aria-hidden="true" /></StubLink>
    </aside>
  );
}
