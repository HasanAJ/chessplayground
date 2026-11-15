import { LanguageSelector } from "../../i18n/LanguageSelector.tsx";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { languagePath } from "../../i18n/routes.ts";
import { WorkspaceTabs } from "./WorkspaceTabs.tsx";

export function SiteHeader({
  opening,
  onWorkspace,
}: {
  opening: boolean;
  onWorkspace: (workspace: "play" | "opening") => void;
}) {
  const { t, language } = useTranslation();
  return (
    <header className="site-header">
      <a
        className="brand"
        href={languagePath(language)}
        aria-label={t("header.home")}
      >
        <img src="/favicon.svg" alt="" />
        <span>
          tempo<span className="brand-dot">.</span>
        </span>
      </a>
      <WorkspaceTabs
        active={opening ? "opening" : "play"}
        onChange={onWorkspace}
      />
      <div className="header-actions">
        <LanguageSelector />
      </div>
    </header>
  );
}
