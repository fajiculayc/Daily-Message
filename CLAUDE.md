# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page static website ("A Message For You") — a personal gift site that shows a daily love note plus mood-based messages the user can click through. No backend, no build step, no package manager.

## Files

- `index.html` — the entire page structure. Uses the Tailwind CDN script (`https://cdn.tailwindcss.com`) for utility classes, plus Google Fonts (`Dancing Script` for handwriting-style headings, `Inter` for body text).
- `script.js` — all behavior, wrapped in a single `DOMContentLoaded` listener.
- `messages.json` — all message copy (`dailyMessages`, `moodMessages`, `specialDatesMessages`), fetched at runtime by `script.js`.
- `style.css` — small set of custom rules layered on top of Tailwind (font-family bindings, fade-in keyframe animation, mood button press effect).
- `icon.png` — favicon / apple-touch-icon.

## Running / testing

There is no build, lint, or test tooling. `script.js` loads `messages.json` via `fetch()`, so the page must be served over HTTP — opening `index.html` directly via `file://` will fail to load messages due to browser CORS restrictions on local file fetches. Serve the directory with any static file server, e.g. `python3 -m http.server`, and visit it. Changes to `script.js`/`style.css`/`index.html`/`messages.json` are visible on a page reload — no compilation step.

## Architecture (script.js)

- Message copy lives entirely in `messages.json`, fetched once on load into `dailyMessages` (array), `moodMessages` (object keyed by mood id: `happy`, `sad`, `mad`, `tampo`, `doubt`, `motivation` — `tampo` is a Filipino term for sulking/subtle annoyance), and `specialDatesMessages` (keyed by `"MM-DD"`, overrides the daily message on specific calendar dates like an anniversary or birthday). Editing message text means editing `messages.json`, not `script.js`.
- All DOM wiring and the initial `selectAndDisplayDailyMessage()` call happen inside the `fetch('messages.json').then(...)` chain, since they depend on the data being loaded first. A `.catch()` shows a fallback error message if the fetch fails.
- **Daily message selection is deterministic, not random**: `getDayOfYear()` computes the day-of-year, and `(dayOfYear - 1) % dailyMessages.length` indexes into `dailyMessages`. This means the same message shows for all visitors on a given calendar day, and it will cycle back to the start once the day count exceeds the list length. There is intentionally no `localStorage` involvement for the daily message (see comment in `selectAndDisplayDailyMessage`).
- **Mood message selection is randomized but sticky per day**, using `localStorage` keys `lastShownDate_<mood>` and `lastMessageIndex_<mood>`. On first click for a mood on a given day, a new random index is chosen (avoiding immediate repeat of the previous day's index when possible) and persisted; subsequent clicks the same day replay the stored index instead of re-rolling.
- DOM elements queried once at load: `#dailyMessageDisplay`, `#dateDisplay`, `#moodMessageDisplay`, and `.mood-button` elements (each with a `data-mood` attribute), updated via direct `textContent` assignment / click listeners.

## Editing content

When asked to add/change messages, dates, or moods, edit `messages.json` — no other files need to change unless adding a wholly new mood category, which also requires a new button in `index.html` with a matching `data-mood` value.
