# Phisio Web — Design System Contract

> **Source of truth for all UI work.**  
> Preview PNGs in `docs/preview-assets/` are **moodboards only** — not pixel specs.  
> The product is **Persian RTL** with real domain data. Do not copy English mock copy, fake metrics, or preview layouts that conflict with this contract.  
> **AI implementation contract:** [`docs/AI_UI_KIT_SPEC.md`](./docs/AI_UI_KIT_SPEC.md) + kit PNG.

---

## 1. Philosophy (pro clinical product)

Calm, dense, intentional — closer to a clinical SaaS tool than a generic wellness landing page.

**Active palette: Modern patient kit** — primary `#0B7AEA` / `#3B9AFA`, teal for progress only, cool gray canvas. No Signal Blue leftovers.

| Do | Don't |
| :--- | :--- |
| Neutrals carry structure; primary blue only for actions | Soft azure / ice-blue wash everywhere |
| Teal only for progress / health / active status | Teal as a second primary CTA color |
| Neutral slate shadows | Blue-tinted soft shadows / glow |
| One clear primary action per section | Pill CTAs stacked everywhere |
| Tight type + spacing scale | Ad-hoc sizes / random gaps |

---

## 2. Tokens (canonical) — Modern patient kit

Defined in `src/styles/design-tokens.css` (dark default) + light overrides in `src/styles/theme.css`.  
Ant theme: `src/theme/phisio-theme.ts`.  
Spec: `docs/AI_UI_KIT_SPEC.md`.

| Token | Light | Dark | Role |
| :--- | :--- | :--- | :--- |
| `--phisio-bg` | `#F6F8FA` | `#0B1220` | Page canvas |
| `--phisio-surface` | `#FFFFFF` | `#152033` | Cards / panels |
| `--phisio-bg-elevated` | `#EEF1F4` | `#1C2A3D` | Nested / input chrome |
| `--phisio-primary` | `#0B7AEA` | `#3B9AFA` | Primary CTAs & active UI |
| `--phisio-primary-hover` | `#0969D0` | `#5AADFF` | Primary hover |
| `--phisio-accent` / `--phisio-teal` | `#0F9F8A` | `#2DD4B0` | Progress / health only |
| `--phisio-success` | `#0F9F8A` | `#2DD4B0` | Success |
| `--phisio-warning` | `#D97706` | `#FBBF24` | Warning |
| `--phisio-danger` | `#DC2626` | `#F87171` | Error |
| `--phisio-text` | `#0B1F33` | `#F3F5F7` | Headings & body |
| `--phisio-text-secondary` | `#5B6B7C` | `#9AA6B2` | Meta |
| `--phisio-border` | `#E2E6EB` | `#243247` | Dividers |
| Shadows | navy/black, no blue wash | black | Elevation — glow tokens = `none` |

**Brand gradient:** teal → blue (`--phisio-brand-gradient`) — progress ring / slider only.  
**Always prefer `var(--phisio-*)` over hard-coded hex in components.**

---

## 3. Typography scale

Font: `Vazirmatn, Inter, system-ui, sans-serif` (Ant token).

| Role | Size | Weight |
| :--- | :--- | :--- |
| Page title | `1.5rem` (`--phisio-font-title`) | 700–800 |
| Section title | `1.125–1.25rem` | 700 |
| Body | `0.95rem` (`--phisio-font-body`) | 400–500 |
| Meta / labels | `0.82rem` (`--phisio-font-meta`) | 500–600 |
| Stat number | `1.5–1.75rem` | 800 |

Line height ~1.5–1.6. Avoid emojis in UI chrome.

---

## 4. Geometry & density

1. **Pill geometry** (`9999px`): `StatusCapsule`, circular play controls, and chip/toggle pills only. Primary and secondary rectangular Ant buttons use `--phisio-radius` (`14px`). Small primary uses `--phisio-radius-sm`.
2. **Cards**: default `--phisio-radius-md` (`16px`). Hero `--phisio-radius-lg` (`20px`). Modal shell `--phisio-radius-xl` (`28px`).
3. **Global Ant overrides** (`antd-overrides.css`): rectangular buttons (primary + default) use `--phisio-radius` (`14px`). Circular icon buttons stay round.
4. **Section gap**: `16–20px` (not `24–32` everywhere). List row gap `10–12px`.
5. **Elevation**: list rows → border + optional `--phisio-shadow-sm`. Section cards → `--phisio-shadow-sm` / `--phisio-shadow-card` sparingly. No glow stacks on idle UI.
6. **Hover**: `.hover-lift` only on interactive cards; keep motion subtle (`-2px`).

---

## 5. Shared primitives

Exported from `src/components/ui/index.ts`:

| Component | Path | Notes |
| :--- | :--- | :--- |
| `ExerciseProgressRing` | `…/ExerciseProgressRing.tsx` | Mint→azure stroke; center % + optional sublabel |
| `TactileSlider` | `…/TactileSlider.tsx` | Dosage / intensity; value pill uses primary soft |
| `StatusCapsule` | `…/StatusCapsule.tsx` | Soft tint + optional dot; pill OK |
| `StatCard` | `…/StatCard.tsx` | Metric + optional real trend; no fake sparklines as decoration |
| `HeroCard` | `…/HeroCard.tsx` | Section banner; badge is soft chip, not loud pill cluster |
| `WorkoutCompletionModal` | `…/WorkoutCompletionModal.tsx` | Success summary; quiet celebration, no emoji titles |

---

## 6. Layout & product rules (critical)

> **No Tailwind.** Project does not compile Tailwind utilities. Use inline `style`, CSS modules, or global CSS under `src/styles/`.

1. **Dock clearance**: patient scroll containers need `paddingBottom: 88px` (or `.patient-content-with-tabs`) for the edge `.dock-nav`. Header/sider/dock use **solid** `--phisio-surface` / `--phisio-header-bg` / `--phisio-panel-bg` (no translucent blur). Sidebar nav is a flat pro list (`.nav-card`), not bordered cards.
2. **RTL**: default `dir="rtl"`. Mixed FA/EN titles → wrap in `<bdi style={{ unicodeBidi: 'plaintext' }}>` with ellipsis.
3. **Persian digits**: `formatPersianNumber` / `convertToPersianDigits` from `@/utils/persian-format`.
4. **Previews**: moodboard only. Match **this contract** + real data model, not PNG English layout.

---

## 7. Dark mode

- Toggle via `data-theme="dark"` / `"light"` on `<html>`.
- Tokens adapt via CSS variables; AntD via `createPhisioTheme(mode)`.

---

## 8. Priority polish screens

When improving visuals, lock quality here first (then inherit):

1. Auth (`AuthLayout` + `LoginForm`)
2. Patient dashboard (`PatientDashboard`)
3. Workout session (`PatientExerciseSession` + `WorkoutCompletionModal`)
4. Doctor home (`DoctorHomePage` + `RecentPatientsTable`)
5. Prescription dosage (`ExerciseDosageFields` + assignment modals)

---

## 9. Visual QA checklist (before marking “done”)

1. Side-by-side with **this contract** (not the PNG as pixel truth)
2. Tokens used (no stray hex for brand colors)
3. Pill radius only on allowed surfaces
4. Density: section gaps ≤ 20px; no empty hero padding bloat
5. Persian RTL + real data; no preview-only metrics
6. Light + dark smoke check

---

## 10. Moodboard assets (inspiration only)

| Asset | Inspiration for |
| :--- | :--- |
| `docs/preview-assets/phase_1_2_ui_kit_preview_*.png` | Component vocabulary |
| `docs/preview-assets/auth_login_page_preview_*.png` | Auth calmness |
| `docs/preview-assets/phase_4_5_patient_dashboard_preview_*.png` | Patient home hierarchy |
| `docs/preview-assets/phase_6_workout_player_preview_*.png` | Session focus |
| `docs/preview-assets/phase_7_library_progress_preview_*.png` | Catalog / charts |
| `docs/preview-assets/phase_9_doctor_dashboard_preview_*.png` | Doctor density |
| `docs/preview-assets/phase_10_prescription_builder_preview_*.png` | Dosage controls |
| `docs/preview-assets/phase_12_dark_mode_preview_*.png` | Dark surfaces |

---

*Contract revised 2026-08-01 — Option A: design system owns visual truth; previews are inspiration.*
