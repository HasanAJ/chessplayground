import { BookOpen, Swords } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import type { KeyboardEvent } from "react";
const workspaces = ["play", "opening"] as const;
type Workspace = (typeof workspaces)[number];
export function WorkspaceTabs({
  active,
  onChange,
}: {
  active: Workspace;
  onChange: (workspace: Workspace) => void;
}) {
  const { t } = useTranslation();
  function keydown(event: KeyboardEvent) {
    const index = workspaces.indexOf(active);
    const target =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 1
          : event.key === "ArrowLeft" || event.key === "ArrowRight"
            ? 1 - index
            : null;
    if (target === null) return;
    event.preventDefault();
    const next = workspaces[target];
    onChange(next);
    document.getElementById(`${next}-tab`)?.focus();
  }
  return (
    <div
      className="workspace-tabs"
      role="tablist"
      aria-label={t("workspace.tabs.label")}
      onKeyDown={keydown}
    >
      {workspaces.map((workspace) => {
        const selected = workspace === active,
          Icon = workspace === "play" ? Swords : BookOpen;
        return (
          <button
            key={workspace}
            type="button"
            id={`${workspace}-tab`}
            role="tab"
            aria-selected={selected}
            aria-controls={`${workspace}-workspace`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(workspace)}
          >
            <Icon size={17} />
            {t(
              workspace === "play"
                ? "workspace.tabs.play"
                : "workspace.tabs.opening",
            )}
          </button>
        );
      })}
    </div>
  );
}
