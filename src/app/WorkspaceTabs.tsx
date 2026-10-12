import { BookOpen, Swords } from "lucide-react";
import { useTranslation } from "../i18n/LanguageProvider";

export type Workspace = "play" | "opening";

export function WorkspaceTabs({
  active,
  onChange,
}: {
  active: Workspace;
  onChange: (workspace: Workspace) => void;
}) {
  const { t } = useTranslation();
  const tabs = ["play", "opening"] as const;
  return (
    <div
      className="workspace-tabs"
      role="tablist"
      aria-label={t("workspace.tabs.label")}
      onKeyDown={(event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
          return;
        event.preventDefault();
        const next =
          event.key === "Home"
            ? "play"
            : event.key === "End"
              ? "opening"
              : active === "play"
                ? "opening"
                : "play";
        onChange(next);
        document.getElementById(`${next}-tab`)?.focus();
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          id={`${tab}-tab`}
          type="button"
          role="tab"
          aria-selected={active === tab}
          aria-controls={`${tab}-workspace`}
          tabIndex={active === tab ? 0 : -1}
          onClick={() => onChange(tab)}
        >
          {tab === "play" ? <Swords size={17} /> : <BookOpen size={17} />}
          {t(tab === "play" ? "workspace.tabs.play" : "workspace.tabs.opening")}
        </button>
      ))}
    </div>
  );
}
