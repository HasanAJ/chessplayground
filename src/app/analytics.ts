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

function withoutQuery(url: string) {
  if (!url) return "";
  const parsed = new URL(url);
  return `${parsed.origin}${parsed.pathname}`;
}

function clearAnalyticsCookies() {
  const host = window.location.hostname.split(".");
  const domains = [
    "",
    ...host.slice(0, -1).map((_, i) => host.slice(i).join(".")),
  ];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!/^_ga(?:_|$)/.test(name)) continue;
    for (const domain of domains)
      document.cookie = `${name}=; Max-Age=0; Path=/;${domain ? ` Domain=${domain};` : ""}`;
  }
}

export function createAnalytics(measurementId: string) {
  let initialized = false;
  let enabled = false;
  let lastPage = "";
  const analyticsWindow = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  function command(..._args: unknown[]) {
    analyticsWindow.dataLayer!.push(arguments);
  }
  const denied = {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
  function pageView() {
    if (!enabled) return;
    const canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    // Wait for the lesson's metadata, including its title, to match navigation.
    if (
      canonical &&
      new URL(canonical.href).pathname !== window.location.pathname
    )
      return;
    const page = `${window.location.origin}${window.location.pathname}`;
    if (page === lastPage) return;
    const details = {
      page_location: page,
      page_title: document.title,
      page_referrer: lastPage || withoutQuery(document.referrer),
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
      Object.assign(window, { [`ga-disable-${measurementId}`]: false });
      if (!initialized) {
        initialized = true;
        analyticsWindow.dataLayer = [];
        analyticsWindow.gtag = command;
        command("consent", "default", denied);
        command("consent", "update", {
          ...denied,
          analytics_storage: "granted",
        });
        command("js", new Date());
        command("config", measurementId, {
          send_page_view: false,
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
          page_location: `${window.location.origin}${window.location.pathname}`,
          page_referrer: withoutQuery(document.referrer),
        });
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.append(script);
      } else {
        command("consent", "update", {
          ...denied,
          analytics_storage: "granted",
        });
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
      Object.assign(window, { [`ga-disable-${measurementId}`]: true });
      if (initialized) command("consent", "update", denied);
      clearAnalyticsCookies();
    },
  };
}
