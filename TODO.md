# Personal Portal  TODO

Everything skipped, deferred, or still to build. Check things off as they get done.

---

## Immediate / housekeeping

- [ ] Push all local commits to GitHub  currently 5 commits ahead of `origin/main`
      (Phases 15 are committed locally but never pushed)
- [ ] Add Gmail App Password to `.env.local` and verify the backup button actually
      sends an email to Gmail
- [ ] Verify JSON and Markdown export downloads work in a real browser session
- [ ] Add to home screen on phone and confirm PWA manifest works

---

## Deferred from Phase 1 (Skeleton)

- [ ] Deploy to hosting  deferred until the app is feature-complete and worth
      reaching from a phone. Recommended: Railway ($5/month, supports SQLite
      persistent volumes). Fly.io also works but no longer has a free tier.
      Steps needed when ready:
      - Create Railway/Fly project
      - Mount persistent volume, point DB_PATH at it
      - Set all env vars as platform secrets
      - Verify app loads from phone browser
      - Verify .db file survives a redeploy (volume persistence check)
      - Optional: set up a custom domain

---

## Deferred from Phase 2 (Capture UI)

- [ ] Entry editing  no way to edit a journal entry after saving. Needs an edit
      form on the /journal page (or a /journal/[id]/edit route). Note: editing
      an entry also needs to update the FTS index (the UPDATE trigger handles this
      already  just needs a UI).
- [ ] Entry deleting  no delete button anywhere. Needs confirmation dialog to
      avoid accidental deletes. Note: deleting an entry should also cascade-delete
      linked mood_entries and finance_entries if entry_id is not null.
- [ ] Mood entry editing/deleting  same gap as journal entries
- [ ] Finance entry editing/deleting  same gap as journal entries

---

## Deferred from Phase 3 (Dashboards)

- [ ] Date range picker  all charts use fixed windows (30 days, 6 months, this
      week). No way to zoom out to a custom range or look at a specific past month.
- [ ] Savings target  the finance dashboard shows income vs expenses but has no
      concept of "what I should have". Needs a target monthly savings field
      somewhere (settings page is the right place) and a progress indicator on
      the finance dashboard.
- [ ] Cross-domain correlations  the most interesting analytics feature: overlay
      mood trend with spending trend for the same week, surface patterns like
      "mood dips in high-spend weeks". Needs an /insights page. Deferred because
      it requires enough historical data to be meaningful.
- [ ] /insights page  a dedicated page for cross-domain analytics. Blocked on
      having enough data and on the date range picker above.
- [ ] Journal streak on home page  currently shows journal_days/7 for the current
      week only. A longer streak counter (e.g. "12 days in a row") would be more
      motivating but needs a streak calculation query.

---

## Deferred from Phase 4 (Search + Tags)

- [ ] Search across mood notes and finance descriptions  FTS5 currently only
      indexes journal entries (entries_fts). Mood notes and finance descriptions
      are searchable via LIKE but not full-text. Low priority since journal entries
      will contain most of what you'd search for.
- [ ] Tag editing  no way to rename a tag or change its color after creation.
      Needs a tag management UI (small table on /settings or a dedicated /tags page).
- [ ] Tag deleting  no delete button for tags. ON DELETE CASCADE on entry_tags
      means deleting a tag also removes all its associations. Needs a confirmation
      step.
- [ ] Search pagination  results are capped at 20. Fine for now; add pagination
      or infinite scroll if the journal grows large enough that 20 results isn't
      enough.
- [ ] "On this day"  currently shows nothing for the first year of use (no
      previous-year data). Consider showing "nothing yet  check back in a year"
      or surfacing entries from the same month in previous years as a fallback.

---

## Phase 6  More domains (not started)

These follow the exact same pattern as Phase 2: new DB tables, Server Actions,
capture forms, list pages, and chart additions in Phase 3 style.

### Learning & books

- [ ] New table: `learning_entries` (entry_id, type TEXT CHECK IN ('book','course',
      'article','video','podcast','other'), title, author, url, status TEXT CHECK IN
      ('reading','done','dropped'), rating INTEGER 15, notes, started_at, finished_at)
- [ ] Capture form: quick-log what you're reading/watching/listening to
- [ ] /learning list page: books read, courses done, articles saved
- [ ] Dashboard: books finished per month, reading streak, ratings histogram

### Career & job search

- [ ] New table: `career_entries` (entry_id, type TEXT CHECK IN ('application',
      'interview','offer','rejection','win','milestone'), company, role, notes,
      outcome, date)
- [ ] Capture form: log a job application, interview, result
- [ ] /career list page: full job hunt timeline
- [ ] Dashboard: applications sent, conversion funnel (applied  interview  offer),
      win/loss ratio

### Relationships & experiences

- [ ] New table: `experience_entries` (entry_id, type TEXT CHECK IN ('person','trip',
      'event','media','other'), title, people, notes, rating INTEGER 15, date)
- [ ] Capture form: person met, trip taken, film/show/book that stuck
- [ ] /experiences list page
- [ ] No dashboard needed for v1  the list is enough

---

## AI extraction layer (not started)

The biggest remaining feature. Replaces manually filling in the mood/finance/learning
forms  instead you write freely in the journal and the AI pulls structured data out.

- [ ] Wire up Claude API (claude-sonnet-4-6 model, Anthropic API key in env)
- [ ] Write extraction prompt: raw journal text in  JSON out with fields for mood
      score, energy score, finance mentions (type/amount/category), books mentioned,
      things learned, people mentioned
- [ ] Add an extraction step after journal save: call the API, parse the JSON response
- [ ] Build a review/edit screen: show what the AI extracted before committing it to
      the domain tables  extraction won't always be right
- [ ] Fallback: if extraction fails or returns garbage, allow manual entry as before
      (the Phase 2 forms stay as the fallback UI)
- [ ] AI-generated weekly recap: a "summarise my week" button on the home page that
      reads the last 7 days of entries and writes a short plain-English summary
- [ ] AI-generated yearly review: same idea but for the full year  useful around
      new year

---

## PWA / mobile (partial  manifest done, rest deferred)

- [ ] Service worker  true offline support so the app loads when there's no internet.
      Deferred because it adds complexity and the app is currently local-only anyway.
      Revisit after hosting is set up.
- [ ] Push notifications  remind yourself to write a daily entry. Requires a service
      worker and a notification permission prompt. Long-term nice-to-have.
- [ ] Habit / streak gamification  a streak counter and a simple heatmap (like
      GitHub's contribution graph) for journal consistency. Lower priority than
      the domain expansions above.

---

## General quality / polish (ongoing)

- [ ] Pagination on all list pages  /journal, /mood, /finance currently show last 30
      entries. Once you have months of data, 30 is not enough.
- [ ] Empty states on list pages  currently no message when a page has zero entries
      (only charts have empty states). Add "No entries yet" copy to list pages.
- [ ] Keyboard navigation  the app is mostly mouse/touch-driven. Tab order and
      keyboard shortcuts beyond Cmd+Enter on the journal form.
- [ ] Print / PDF export  useful for a yearly review printout. Low priority.
- [ ] Database integrity check on startup  run SQLite's built-in
      `PRAGMA integrity_check` on app start and log a warning if it fails.
      Belt-and-suspenders for a database holding irreplaceable personal data.

---

_Last updated: Phase 5 complete. Phases 15 committed locally, not pushed to GitHub._
