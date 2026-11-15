# Mise: a Horeca roster planner

A demo app built on Astryx for planning a restaurant's week: who works when, who is off, and what still needs covering. It is a standalone consumer app (like the other `apps/example-*` folders), installed from the npm registry, so it is not part of the pnpm workspace.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests for the roster rules and state
npm run build      # type-check, then production build
```

Data lives in `localStorage`. Settings has a **Reset demo data** button.

## What it does

Use the **Viewing as** switch in the side nav to move between the manager and any team member.

| Area | Manager | Staff |
|------|---------|-------|
| **Roster** | Week grid per person with add, edit and delete shifts, coverage per department, hours and labour cost against a budget, conflict and warning list, publish or unpublish a week, copy last week, clear a week | Read the roster, offer own shift to the open board |
| **Time off** | Approve or decline requests, release the shifts a leave covers to the open board, record leave directly, holiday balances for everyone | Request leave with a live balance and clash check, withdraw a pending request |
| **Open shifts** | Create open shifts, assign from a ranked list (people on leave are ruled out) | Take a shift (blocked on a hard clash) |
| **Team** | Edit profiles: position, contract hours, hourly cost, holiday allowance, days they cannot work | Read the team |
| **Settings** | Minimum rest, maximum weekly hours, labour budget, closed days, minimum people per department | n/a |

### Roster rules

The grid flags problems on the shift itself, and lists them above the grid:

- **Error:** a shift on approved leave, or two overlapping shifts for one person. Publishing is blocked while errors remain.
- **Warning:** a pending leave request on that day, less than the minimum rest between shifts (it understands closes that run past midnight), a weekday the person marked unavailable, or more than the weekly hour limit.
- **Coverage:** each department needs a minimum number of people on every open day, higher Friday to Sunday. Someone on approved leave does not count.

The rules are pure functions in `src/lib/rules.ts`, covered by `tests/`.

## Structure

```text
src/
  lib/         dates, rules engine, seed data, hash routing
  state/       reducer and localStorage persistence
  components/  roster grid, phone agenda, dialogs, shared pieces
  views/       Roster, Time off, Open shifts, Team, Settings
```

The route lives in the URL hash (`#/roster?week=2026-11-16&dept=kitchen`), so a week and filter can be shared. Below 720px the seven-day grid becomes a day-by-day agenda.

## Design notes

- Theme: Astryx `stone`. App screens use Astryx components throughout, with semantic colour: department hue for shifts, red for conflicts and coverage gaps, green for covered days.
- This app compiles Astryx from source with `@astryxdesign/build`, so it does **not** import the prebuilt `@astryxdesign/core/astryx.css` (that file is for apps without the build plugin, and importing it here fails the build).
- `src/index.css` carries the Hallmark stamp and two waivers for 26b and 39b, which come from library parts. Check it with:

```bash
/design-gate src --url http://localhost:5173/#/roster --scope app --require-render
```

## Next steps

Shift swaps between two named people, recurring shift templates, per-day opening hours, an export to PDF or a calendar feed, and a real backend with sign-in in place of the viewer switch.
