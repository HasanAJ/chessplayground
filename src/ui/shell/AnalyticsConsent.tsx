import { useRef } from "react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { privacyPath } from "../../i18n/routes.ts";
import type { AnalyticsConsent as Consent } from "../../infrastructure/analytics/analytics.ts";
import { useConsentPreferences } from "./useConsentPreferences.ts";
const productionId = import.meta.env?.PROD
  ? import.meta.env.VITE_GA_MEASUREMENT_ID
  : undefined;
export function AnalyticsConsent({
  measurementId = productionId,
}: {
  measurementId?: string;
}) {
  const { language, t } = useTranslation();
  const preferences = useConsentPreferences(measurementId);
  const trigger = useRef<HTMLButtonElement>(null);
  const policy = privacyPath(language);
  const choose = (consent: Consent) => {
    preferences.choose(consent);
    trigger.current?.focus({ preventScroll: true });
  };
  return (
    <>
      <a className="privacy-link" href={policy}>
        {t("analytics.privacy")}
      </a>
      <button
        className="privacy-link"
        ref={trigger}
        aria-expanded={preferences.open}
        aria-controls="analytics-choice"
        onClick={() => preferences.setOpen(!preferences.open)}
      >
        {t("analytics.settings")}
      </button>
      {preferences.open && (
        <section
          className="analytics-choice"
          id="analytics-choice"
          aria-label={t("analytics.heading")}
        >
          <p>
            {t("analytics.description")}{" "}
            <a href={policy}>{t("analytics.privacy")}</a>
          </p>
          <div className="analytics-actions">
            {(["denied", "granted"] as const).map((value) => (
              <button key={value} onClick={() => choose(value)}>
                {t(
                  value === "granted"
                    ? "analytics.accept"
                    : "analytics.decline",
                )}
              </button>
            ))}
          </div>
        </section>
      )}
      {!preferences.saved && (
        <p className="analytics-storage-notice" role="status">
          {t("analytics.storage")}
        </p>
      )}
    </>
  );
}
