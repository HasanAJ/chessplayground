import { useEffect, useMemo, useReducer } from "react";
import {
  analyticsConsentKey,
  createAnalytics,
  readAnalyticsConsent,
  saveAnalyticsConsent,
  type AnalyticsConsent,
} from "../../infrastructure/analytics/analytics.ts";

type Preferences = {
  consent: AnalyticsConsent | null;
  open: boolean;
  saved: boolean;
};
export function useConsentPreferences(measurementId?: string) {
  const [state, update] = useReducer(
    (state: Preferences, patch: Partial<Preferences>) => ({
      ...state,
      ...patch,
    }),
    measurementId,
    (id) => {
      const consent = readAnalyticsConsent();
      return { consent, saved: true, open: !!id && consent === null };
    },
  );
  const analytics = useMemo(
    () => (measurementId ? createAnalytics(measurementId) : null),
    [measurementId],
  );
  useEffect(() => {
    if (state.consent === "granted") analytics?.start();
    else analytics?.stop();
    return () => analytics?.stop();
  }, [state.consent, analytics]);
  useEffect(() => {
    const synchronize = (event: StorageEvent) => {
      if (event.key === null || event.key === analyticsConsentKey)
        update({ consent: readAnalyticsConsent() });
    };
    window.addEventListener("storage", synchronize);
    return () => window.removeEventListener("storage", synchronize);
  }, []);
  return {
    ...state,
    setOpen: (open: boolean) => update({ open }),
    choose: (consent: AnalyticsConsent) =>
      update({ consent, saved: saveAnalyticsConsent(consent), open: false }),
  };
}
