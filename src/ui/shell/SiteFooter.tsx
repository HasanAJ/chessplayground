import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { languagePath } from "../../i18n/routes.ts";
import { AnalyticsConsent } from "./AnalyticsConsent.tsx";
export function SiteFooter() {
  const { t, language } = useTranslation();
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-identity">
          <a
            className="footer-brand"
            href={languagePath(language)}
            aria-label={t("header.home")}
          >
            <img src="/favicon.svg" alt="" />
            <span>Tempo</span>
          </a>
          <p className="footer-copyright">© {new Date().getFullYear()} Tempo</p>
        </div>
        <div className="footer-details">
          <p className="footer-engine">{t("footer.engine")}</p>
          <div className="footer-privacy">
            <AnalyticsConsent />
          </div>
        </div>
      </div>
    </footer>
  );
}
