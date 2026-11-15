import { Component, type ReactNode } from "react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { languagePath } from "../../i18n/routes.ts";
import { navigate } from "../../infrastructure/navigation/location.ts";
function Failure() {
  const { t, language } = useTranslation();
  const actions = [
    {
      label: t("opening.error.reload"),
      className: "primary-button",
      run: () => window.location.reload(),
    },
    {
      label: t("workspace.tabs.play"),
      className: "small-button",
      run: () => navigate(languagePath(language)),
    },
  ];
  return (
    <div className="opening-load-error" role="alert">
      <h1>{t("opening.error.title")}</h1>
      <p>{t("opening.error.description")}</p>
      <div>
        {actions.map(({ label, className, run }) => (
          <button key={label} className={className} onClick={run}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
export class OpeningBoundary extends Component<
  { children: ReactNode },
  { failure: { cause: unknown } | null }
> {
  state = { failure: null };
  static getDerivedStateFromError(cause: unknown) {
    return { failure: { cause } };
  }
  render() {
    return this.state.failure === null ? this.props.children : <Failure />;
  }
}
