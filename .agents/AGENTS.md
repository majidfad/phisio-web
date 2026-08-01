# Agent Instructions for Phisio Web

## Design system (required)

Before any UI change, read [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).

**Rules:**

1. **No Tailwind** — not compiled. Use inline styles, CSS modules, or `src/styles/*`.
2. **Tokens / palette** — Clinical Navy (Option A): primary `#1D4ED8` (light) / `#3B82F6` (dark); teal accent `#0F766E` / `#2DD4BF`; canvas `#F7F8FA` / `#0C111B`. Prefer `var(--phisio-*)`; do not hard-code brand hex.
3. **Pills** — `borderRadius: 9999px` / `--phisio-radius-pill` only for **primary** CTAs and status chips. Default/secondary buttons use `--phisio-radius`. Cards default `--phisio-radius-md`. Do not add a global `.ant-btn { border-radius: 9999px }` override.
4. **Dock clearance** — patient scroll pages: `paddingBottom: '88px'` (edge dock; was 160 for floating dock).
5. **RTL** — wrap mixed FA/EN titles in `<bdi style={{ unicodeBidi: 'plaintext' }}>` + ellipsis.
6. **Previews** — `docs/preview-assets/*.png` and `docs/palette-preview.html` are references. Do **not** invent English/fake metrics to match PNG moodboards.
7. **Honesty** — build success ≠ visual done. Use the QA checklist in `DESIGN_SYSTEM.md`.
