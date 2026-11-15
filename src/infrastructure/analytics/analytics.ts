export const analyticsConsentKey = "tempo-analytics-consent-v1";
export type AnalyticsConsent = "granted" | "denied";
export function readAnalyticsConsent(): AnalyticsConsent | null {
  try {
    const value = window.localStorage.getItem(analyticsConsentKey);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}
export function saveAnalyticsConsent(consent: AnalyticsConsent) {
  try {
    window.localStorage.setItem(analyticsConsentKey, consent);
    return true;
  } catch {
    return false;
  }
}
const privateConsent = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};
function pageAddress(value: string) {
  if (!value) return "";
  const url = new URL(value);
  return url.origin + url.pathname;
}
function clearCookies() {
  const labels = window.location.hostname.split(".");
  const domains = [
    "",
    ...labels.slice(0, -1).map((_, index) => labels.slice(index).join(".")),
  ];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!/^_ga(?:_|$)/.test(name)) continue;
    for (const domain of domains)
      document.cookie = `${name}=; Max-Age=0; Path=/;${domain ? ` Domain=${domain};` : ""}`;
  }
}

/** No tag, queue or remote request exists until start is called after consent. */
export function createAnalytics(measurementId: string) {
  let initialized = false,
    enabled = false,
    lastPage = "";
  const host = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  function command(..._args: unknown[]) {
    host.dataLayer!.push(arguments);
  }
  function pageView() {
    if (!enabled) return;
    const canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (
      canonical &&
      new URL(canonical.href).pathname !== window.location.pathname
    )
      return;
    const page = pageAddress(window.location.href);
    if (page === lastPage) return;
    const details = {
      page_location: page,
      page_title: document.title,
      page_referrer: lastPage || pageAddress(document.referrer),
    };
    command("set", details);
    command("event", "page_view", details);
    lastPage = page;
  }
  const observer = new window.MutationObserver(pageView);
  return {
    start() {
      if (enabled) return;
      enabled = true;
      Reflect.set(window, `ga-disable-${measurementId}`, false);
      if (initialized)
        command("consent", "update", {
          ...privateConsent,
          analytics_storage: "granted",
        });
      else {
        initialized = true;
        host.dataLayer = [];
        host.gtag = command;
        command("consent", "default", privateConsent);
        command("consent", "update", {
          ...privateConsent,
          analytics_storage: "granted",
        });
        command("js", new Date());
        command("config", measurementId, {
          send_page_view: false,
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
          page_location: pageAddress(window.location.href),
          page_referrer: pageAddress(document.referrer),
        });
        const tag = document.createElement("script");
        tag.async = true;
        tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.append(tag);
      }
      observer.observe(document.head, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["href"],
      });
      pageView();
    },
    stop() {
      enabled = false;
      observer.disconnect();
      lastPage = "";
      Reflect.set(window, `ga-disable-${measurementId}`, true);
      if (initialized) command("consent", "update", privateConsent);
      clearCookies();
    },
  };
}
