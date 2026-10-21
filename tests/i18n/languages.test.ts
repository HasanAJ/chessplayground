import test from "node:test";
import assert from "node:assert/strict";
import { act, createElement } from "react";
import { Chess } from "chess.js";
import en from "../../src/i18n/locales/en";
import {
  catalogs,
  english,
  languages,
  translator,
  type Translator,
  type MessageKey,
} from "../../src/i18n/translate";
import { LanguageProvider } from "../../src/i18n/LanguageProvider";
import { languageFromPath, languagePath } from "../../src/i18n/routes";
import { siteContent } from "../../src/i18n/siteContent";
import { LanguageSelector } from "../../src/i18n/LanguageSelector";
import { translateNotice } from "../../src/i18n/notices";
import { moveDescription } from "../../src/chess/moves";
import { candidatesFor } from "../../src/features/coach/candidates";
import { localizeReview, reviewMove } from "../../src/features/coach/grading";
import { BestMoveContent } from "../../src/features/coach/BestMoveContent";
import { useGameController } from "../../src/features/game/useGameController";
import { useRecommendations } from "../../src/features/coach/useRecommendations";
import { AnalysisEngine } from "../../src/engine/AnalysisEngine";
import { createTestRoot } from "../helpers/dom";

const placeholders = (message: string) =>
  [...message.matchAll(/\{\d+\}/g)].map((match) => match[0]).sort();

test("descriptive keys resolve to English copy and every language preserves interpolation values", () => {
  for (const [key, value] of Object.entries(en)) {
    assert.match(key, /^([a-z][a-zA-Z]*\.)+[a-z][a-zA-Z]*$/);
    assert.ok(value.trim(), key);
    assert.equal(english(key as MessageKey), value);
  }
  for (const [language, catalog] of Object.entries(catalogs)) {
    assert.deepEqual(
      Object.keys(catalog).sort(),
      Object.keys(en).sort(),
      language,
    );
    for (const [key, value] of Object.entries(catalog)) {
      assert.ok(value.trim(), `${language}: ${key}`);
      assert.deepEqual(
        placeholders(value),
        placeholders(en[key as MessageKey]),
        `${language}: ${key}`,
      );
    }
  }
  assert.equal(translator("fr")("coach.move.play", "<e4>"), "Jouer <e4>");
  assert.equal(english("coach.move.play", "<e4>"), "Play <e4>");
  assert.equal(english("position.error.invalidFen"), "Invalid FEN: {0}");
  assert.equal(translateNotice("constructor", translator("fr")), "constructor");
  assert.equal(
    translateNotice("unrecognized diagnostic", translator("de")),
    "unrecognized diagnostic",
  );
});

test("each language has a distinct URL and unknown paths are not language pages", () => {
  assert.equal(languageFromPath("/"), "en");
  for (const language of Object.keys(catalogs) as (keyof typeof catalogs)[]) {
    assert.equal(languageFromPath(languagePath(language)), language);
    assert.equal(languageFromPath(`/${language}`), language);
  }
  for (const pathname of [
    "/en/",
    "/pt/",
    "/fr-CA/",
    "/constructor/",
    "/fr/missing/",
  ])
    assert.equal(languageFromPath(pathname), null);
});

test("a direct language URL controls the page language, title, and metadata", async (t) => {
  const { root, dom } = createTestRoot(t);
  dom.window.localStorage.setItem("tempo-language-v1", "de");
  dom.window.history.replaceState(null, "", "/fr/#coach");
  await act(() =>
    root.render(
      createElement(LanguageProvider, {
        children: createElement(LanguageSelector),
      }),
    ),
  );
  assert.equal(dom.window.document.querySelector("select")!.value, "fr");
  assert.equal(dom.window.document.documentElement.lang, "fr");
  assert.equal(dom.window.document.title, siteContent.fr.title);
  assert.equal(
    dom.window.document
      .querySelector('meta[name="description"]')!
      .getAttribute("content"),
    siteContent.fr.description,
  );
  assert.equal(
    dom.window.document
      .querySelector('link[rel="canonical"]')!
      .getAttribute("href"),
    "https://chessplayground.app/fr/",
  );
});

test("special moves and cached reviews translate without changing notation, evaluations, or legal lines", () => {
  const fixtures = [
    ["r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1", "O-O"],
    ["4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1", "exd6"],
    ["7k/P7/8/8/8/8/8/4K3 w - - 0 1", "a8=Q+"],
  ];
  for (const language of Object.keys(catalogs) as (keyof typeof catalogs)[]) {
    const translate = translator(language);
    const t: Translator = Object.assign(
      (key: MessageKey, ...values: (string | number)[]) => {
        assert.ok(Object.hasOwn(en, key), `Missing source message: ${key}`);
        return translate(key, ...values);
      },
      { language },
    );
    for (const [fen, san] of fixtures) {
      const game = new Chess(fen);
      const move = game.move(san);
      const description = moveDescription(move, t);
      assert.match(description, new RegExp(move.from));
      assert.match(description, new RegExp(move.to));
      assert.doesNotMatch(
        description,
        /\{\d+\}|\bfrom\b|\btaking\b|\bpromoting\b/,
      );
      const candidate = candidatesFor(
        fen,
        [{ rank: 1, depth: 12, cp: 28, pv: [move.lan] }],
        t,
      )[0];
      assert.equal(candidate.move.san, san);
      assert.equal(candidate.whiteScore, 0.28);
    }
    const before = new Chess();
    const best = candidatesFor(before.fen(), [
      { rank: 1, depth: 12, cp: 40, pv: ["e2e4", "e7e5"] },
    ])[0];
    const move = before.move("d4");
    const played = candidatesFor(move.before, [
      { rank: 2, depth: 12, cp: 10, pv: ["d2d4", "d7d5"] },
    ])[0];
    const reply = candidatesFor(move.after, [
      { rank: 1, depth: 11, cp: -10, pv: ["d7d5"] },
    ])[0];
    const review = reviewMove(move, best, reply, false, played);
    const localized = localizeReview(review, t);
    assert.equal(localized.label, review.label);
    assert.equal(localized.loss, review.loss);
    assert.equal(localized.impact, review.impact);
    assert.deepEqual(localized.reply?.pv, review.reply?.pv);
    assert.notEqual(localized.text, review.text);
    assert.doesNotMatch(localized.text, /\{\d+\}/);
  }
});

test("retained validation notices follow the selected language and preserve chess fields", () => {
  const t = translator("es");
  assert.equal(
    translateNotice("Add the black king to play or calculate.", t),
    "Añade el rey de Negras para jugar o calcular.",
  );
  assert.equal(
    translateNotice("Invalid FEN: missing white king", t),
    "FEN no válido: Falta el rey de Blancas.",
  );
  assert.match(
    translateNotice(
      "Castling right K needs the white king and rook on their original squares.",
      t,
    ),
    /K.*Blancas/,
  );
  assert.match(
    translateNotice(
      "Black can have at most 16 pieces. Remove one before adding another.",
      t,
    ),
    /Negras.*16/,
  );
});

test("raw engine and saved-game diagnostics resolve through descriptive keys", () => {
  const fixtures: [string, MessageKey][] = [
    [
      "The chess engine could not load. Check your connection and retry analysis.",
      "engine.error.load",
    ],
    [
      "The engine could not check the reply. Try again.",
      "coach.review.error.reply",
    ],
    [
      "Browser storage is unavailable or full. Your latest changes may not survive a reload.",
      "game.save.error.unavailable",
    ],
    [
      "Your saved game could not be read. The last valid position was restored, without its move history. Autosave is paused to protect the original data.",
      "game.save.error.restoredPosition",
    ],
    [
      "Your computer difficulty could not be saved in this browser.",
      "computer.error.saveDifficulty",
    ],
    ["Starting position", "game.history.startingPosition"],
    ["Position loaded", "position.notice.loaded"],
  ];
  for (const language of Object.keys(languages) as (keyof typeof languages)[]) {
    const t = translator(language);
    for (const [source, key] of fixtures)
      assert.equal(translateNotice(source, t), t(key), `${language}: ${source}`);
    assert.equal(translateNotice("engine.error.load", t), "engine.error.load");
  }
});

test("switching languages keeps the game and completed recommendations without another engine search", async (t) => {
  const { root, dom } = createTestRoot(t);
  dom.window.history.replaceState(null, "", "/?source=test#coach");
  let searches = 0;
  let callbacks!: Parameters<AnalysisEngine["analyze"]>[1];
  t.mock.method(
    AnalysisEngine.prototype,
    "analyze",
    (_fen: string, next: typeof callbacks) => {
      searches++;
      callbacks = next;
      return () => {};
    },
  );
  let current!: {
    game: ReturnType<typeof useGameController>;
    recommendations: ReturnType<typeof useRecommendations>;
  };
  function Harness() {
    const game = useGameController(() => {});
    const recommendations = useRecommendations(game, false);
    current = { game, recommendations };
    return createElement(
      "div",
      null,
      createElement(LanguageSelector),
      recommendations.best &&
        createElement(BestMoveContent, {
          candidate: recommendations.best,
          preview: null,
          forcedMove: false,
          onPlay() {},
          onInspect() {},
        }),
    );
  }
  await act(() =>
    root.render(
      createElement(LanguageProvider, { children: createElement(Harness) }),
    ),
  );
  await act(() => current.game.playMove("e2", "e4"));
  await act(() => current.recommendations.calculate());
  await act(() =>
    callbacks.onComplete([
      { rank: 1, depth: 12, cp: 24, pv: ["e7e5", "g1f3"] },
    ]),
  );
  assert.equal(searches, 1);
  const { study, analysisKey, fen } = current.game;
  const select = dom.window.document.querySelector("select")!;
  for (const language of Object.keys(languages)) {
    await act(() => {
      select.value = language;
      select.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    });
    assert.equal(dom.window.document.documentElement.lang, language);
    assert.equal(
      dom.window.location.pathname,
      languagePath(language as keyof typeof languages),
    );
    assert.equal(dom.window.location.search, "?source=test");
    assert.equal(dom.window.location.hash, "#coach");
    assert.equal(
      dom.window.document.title,
      siteContent[language as keyof typeof languages].title,
    );
    assert.equal(current.game.study, study);
    assert.equal(current.game.analysisKey, analysisKey);
    assert.equal(current.game.fen, fen);
    assert.deepEqual(current.game.game.history(), ["e4"]);
    assert.equal(current.recommendations.thinking, false);
    assert.equal(current.recommendations.best?.move.san, "e5");
    assert.equal(searches, 1);
    assert.match(
      dom.window.document.querySelector(".best-move-heading")!.textContent!,
      /e5/,
    );
    if (language !== "en")
      assert.notEqual(current.recommendations.best?.title, "Claim the center");
  }
  await act(async () => {
    const navigated = new Promise<void>((resolve) =>
      dom.window.addEventListener("popstate", () => resolve(), { once: true }),
    );
    dom.window.history.back();
    await navigated;
  });
  assert.equal(select.value, "it");
  assert.equal(dom.window.document.title, siteContent.it.title);
  assert.equal(current.game.study, study);
  assert.equal(searches, 1);
});

test("translated repetition reviews keep the original draw outcome", () => {
  const game = new Chess();
  for (const san of ["Nf3", "Nf6", "Ng1", "Ng8", "Nf3", "Nf6", "Ng1"])
    game.move(san);
  const move = game.move("Ng8");
  assert.equal(game.isThreefoldRepetition(), true);
  assert.equal(new Chess(move.after).isDraw(), false);
  const best = candidatesFor(move.before, [
    { rank: 1, depth: 12, cp: 0, pv: [move.lan] },
  ])[0];
  const review = reviewMove(move, best, undefined, true);
  const localized = localizeReview(review, translator("fr"));
  assert.equal(localized.loss, review.loss);
  assert.equal(localized.label, review.label);
  assert.match(localized.text, /Ng8/);
});
