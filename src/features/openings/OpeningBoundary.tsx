import { Component, type ReactNode } from "react";
import { useTranslation } from "../../i18n/LanguageProvider";
import { languagePath } from "../../i18n/routes";
import { navigate } from "../../app/navigation";

export class OpeningBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <OpeningLoadError /> : this.props.children;
  }
}

function OpeningLoadError() {
  const { t, language } = useTranslation();
  return (
    <div className="opening-load-error" role="alert">
      <h1>{t("opening.error.title")}</h1>
      <p>{t("opening.error.description")}</p>
      <div>
        <button
          className="primary-button"
          onClick={() => window.location.reload()}
        >
          {t("opening.error.reload")}
        </button>
        <button
          className="small-button"
          onClick={() => navigate(languagePath(language))}
        >
          {t("workspace.tabs.play")}
        </button>
      </div>
    </div>
  );
}
