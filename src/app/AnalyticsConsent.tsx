import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "../i18n/LanguageProvider";
import {
  createAnalytics,
  analyticsConsentKey,
  readAnalyticsConsent,
  saveAnalyticsConsent,
  type AnalyticsConsent as Consent,
} from "./analytics";

const productionId = import.meta.env?.PROD
  ? import.meta.env.VITE_GA_MEASUREMENT_ID
  : undefined;

export function AnalyticsConsent({
  measurementId = productionId,
}: {
  measurementId?: string;
}) {
  const { t } = useTranslation();
  const [consent, setConsent] = useState(readAnalyticsConsent);
  const [open, setOpen] = useState(consent === null);
  const [saved, setSaved] = useState(true);
  const trigger = useRef<HTMLButtonElement>(null);
  const analytics = useMemo(
    () => (measurementId ? createAnalytics(measurementId) : null),
    [measurementId],
  );
  useEffect(() => {
    if (!analytics) return;
    if (consent === "granted") analytics.start();
    else analytics.stop();
    return () => analytics.stop();
  }, [analytics, consent]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === analyticsConsentKey || event.key === null)
        setConsent(readAnalyticsConsent());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function choose(next: Consent) {
    setSaved(saveAnalyticsConsent(next));
    setConsent(next);
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <a className="privacy-link" href="/privacy/">
        {t("analytics.privacy")}
      </a>
      {analytics && (
        <>
          <button
            className="privacy-link"
            ref={trigger}
            aria-expanded={open}
            aria-controls="analytics-choice"
            onClick={() => setOpen(!open)}
          >
            {t("analytics.settings")}
          </button>
          {open && (
            <section
              className="analytics-choice"
              id="analytics-choice"
              aria-labelledby="analytics-heading"
            >
              <div>
                <h2 id="analytics-heading">{t("analytics.heading")}</h2>
                <p>{t("analytics.description")}</p>
                <a href="/privacy/">{t("analytics.privacy")}</a>
              </div>
              <div className="analytics-actions">
                <button onClick={() => choose("denied")}>
                  {t("analytics.decline")}
                </button>
                <button onClick={() => choose("granted")}>
                  {t("analytics.accept")}
                </button>
              </div>
            </section>
          )}
          {!saved && (
            <p className="analytics-storage-notice" role="status">
              {t("analytics.storage")}
            </p>
          )}
        </>
      )}
    </>
  );
}
