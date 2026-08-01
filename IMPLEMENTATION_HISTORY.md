# Phisio Web — Redesign Implementation History

Honest status log for the redesign. **Build success ≠ visual parity.**  
Source of truth: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md). Preview PNGs are moodboards only.

---

## Status overview

| Phase | Description | Structure | Visual vs contract | Notes |
| :--- | :--- | :--- | :--- | :--- |
| 1–2 | Tokens + shared UI kit | ✅ | 🟢 Improved | Primitives tightened (radius/density/tokens) |
| 3 | Auth / login | ✅ | 🟢 Improved | Priority polish done |
| 4–5 | Patient shell + dashboard | ✅ | 🟢 Improved | Priority polish done |
| 6 | Workout session + completion | ✅ | 🟢 Improved | Modal quieted; session CSS intact |
| 7–8 | Library / progress | ✅ | 🟢 Improved | Real filters + real today progress (no mock charts) |
| 9 | Doctor dashboard | ✅ | 🟢 Improved | Fake metrics removed |
| 10 | Prescription dosage | ✅ | 🟢 Improved | Density polish |
| 11 | Admin CMS | ✅ | 🟢 Improved | Real stats only; CMS nav denser |
| 12 | Dark mode + motion | ✅ | 🟡 Partial | Elevated surfaces differentiated; needs user smoke QA |

**Legend:** ✅ structure · 🟢 contract-aligned polish applied · 🟡 needs smoke confirmation

**User confirmation:** still needed (light + dark) on key screens.

---

## Option A decision (2026-08-01)

1. Previews = inspiration, not pixel acceptance criteria.
2. `DESIGN_SYSTEM.md` is the acceptance contract.
3. Priority polish first, then remaining surfaces.
4. Do not re-run phases 1–12 as a rubber stamp.

---

## Verification rules (going forward)

A screen may be marked **user-confirmed ✅** only when:

1. Checked against `DESIGN_SYSTEM.md` QA checklist  
2. Side-by-side / in-app review (light; dark smoke)  
3. No hard-coded brand hex where tokens exist  
4. Product data is real (no preview-only English metrics)

Production `npm run build` alone is **not** visual verification.

---

## Execution log

### 2026-08-01 — Option A + priority polish

- Rewrote `DESIGN_SYSTEM.md` as contract (previews demoted).
- Corrected false “visual passed” claims.
- Fixed `REDESIGN_PLAN.md` asset paths → `docs/preview-assets/…`.
- Updated `.agents/AGENTS.md` for Option A rules.
- Polished shared primitives + Auth, Patient dashboard, Workout modal, Doctor home, Prescription dosage.
- Build passed.

### 2026-08-01 — Next tier (Library / Progress / Admin / dark)

- **Library:** real category filters; token chips; quieter cards.
- **Progress:** today-only real metrics (no mock charts).
- **Admin:** real stats only; denser CMS links.
- **Dark:** elevated surfaces differentiated.
- Build passed.

### 2026-08-01 — Consistency pass (global chrome)

- **Ant buttons:** default radius; **only primary** = pill.
- **Ant cards / dock / workout:** quieter elevation; token dock active state.
- **StatCard:** `styles.content` instead of deprecated `valueStyle`.
- Build + admin test passed.

### 2026-08-01 — Register / Articles / Prescription wizard

- **Register:** role pick as dense choice cards.
- **Articles / assignment wizard / exercise select:** density + `bdi` titles.
- Typecheck passed.

### 2026-08-01 — Clinical Navy palette (Option A)

- Switched from Deep Teal → Clinical Navy app-wide.
- Tokens: `design-tokens.css`, `theme.css`, `phisio-theme.ts`.
- Progress ring teal→blue; capsules remapped; EnergyWaveBg retinted.
- Primary buttons: white label on blue (dark + light).
- `DESIGN_SYSTEM.md` + `.agents/AGENTS.md` updated to Option A.
