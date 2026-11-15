import { english, type MessageKey, type Translator } from "./translate.ts";
export type Notice = { key: MessageKey; values: (Notice | string | number)[] };
export type Diagnostic = Notice | string;
export const notice = (
  key: MessageKey,
  ...values: Notice["values"]
): Notice => ({ key, values });
export function translateNotice(
  source: Diagnostic | null | undefined,
  t: Translator,
): string {
  if (source == null) return "";
  if (typeof source === "string") return source;
  const parameters = source.values.map((value) =>
    typeof value === "object" ? translateNotice(value, t) : value,
  );
  return t(source.key, ...parameters);
}
export class NoticeError extends Error {
  readonly notice: Notice;
  constructor(diagnostic: Notice, message?: string) {
    super(message ?? translateNotice(diagnostic, english));
    this.notice = diagnostic;
    this.name = "NoticeError";
  }
}
export function noticeFromError(error: unknown, fallback: Notice): Diagnostic {
  return error instanceof NoticeError
    ? error.notice
    : error instanceof Error
      ? error.message
      : fallback;
}
