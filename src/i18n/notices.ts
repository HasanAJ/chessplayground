import { english, type MessageKey, type Translator } from "./translate";

export type Notice = {
  key: MessageKey;
  values: (Notice | string | number)[];
};
export type Diagnostic = Notice | string;

export function notice(key: MessageKey, ...values: Notice["values"]): Notice {
  return { key, values };
}

export function translateNotice(
  source: Diagnostic | null | undefined,
  t: Translator,
): string {
  if (!source) return "";
  if (typeof source === "string") return source;
  return t(
    source.key,
    ...source.values.map((value) =>
      typeof value === "object" ? translateNotice(value, t) : value,
    ),
  );
}

export class NoticeError extends Error {
  constructor(
    readonly notice: Notice,
    message = translateNotice(notice, english),
  ) {
    super(message);
    this.name = "NoticeError";
  }
}

export function noticeFromError(error: unknown, fallback: Notice): Diagnostic {
  if (error instanceof NoticeError) return error.notice;
  return error instanceof Error ? error.message : fallback;
}
