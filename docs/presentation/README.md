# Doctor presentation kit

Product-demo PDFs for clinicians and clinics, built from **live application screenshots only** (no stock art, mockups, or placeholder imagery).

## Outputs

| File | Description |
|------|-------------|
| `docs/presentation/screenshots/*.png` | Live desktop / tablet / mobile captures with UI callouts |
| `docs/presentation/Doctor-Presentation-FA.pdf` | Persian product demonstration |
| `docs/presentation/Doctor-Presentation-EN.pdf` | English product demonstration |
| `docs/presentation/screenshot-inventory.json` | Machine-readable capture inventory |
| `docs/presentation/zivan-mark.png` | Brand mark embedded in PDFs |

## Prerequisites

1. Node.js 20+
2. Google Chrome or Microsoft Edge (Playwright uses the system browser channel)
3. API + web running locally with a doctor account that already has patients and exercises, plus a linked patient account
4. Credentials in `.env.presentation` (gitignored)

```bash
PRESENTATION_BASE_URL=http://localhost:5173
PRESENTATION_DOCTOR_PHONE=0912xxxxxxx
PRESENTATION_DOCTOR_PASSWORD=your-password
PRESENTATION_PATIENT_PHONE=0912yyyyyyy
PRESENTATION_PATIENT_PASSWORD=your-password
PRESENTATION_BROWSER_CHANNEL=chrome
PRESENTATION_START_DEV=1
```

The capture script **requires** successful doctor and patient login. It will not fall back to preview/mock images.

## Commands

```bash
# Screenshots only (live app)
npm run presentation:screenshots

# PDFs from existing screenshots
npm run presentation:pdf

# End-to-end
npm run presentation:build
```

Windows (regenerate from scratch):

```powershell
Remove-Item -Recurse -Force docs/presentation/screenshots -ErrorAction SilentlyContinue
npm run presentation:build
```

## What gets captured

Desktop workflow (annotated callouts on key controls):

- Login
- Doctor dashboard
- Patient list
- Patient overview drawer
- Treatment programs in overview
- Exercise history modal
- Prescription wizard steps 1–3 (period → exercises → dosage)
- Exercise library, catalog picker, exercise edit/add modal

Responsive:

- Login tablet/mobile
- Dashboard tablet/mobile
- Patient list tablet/mobile
- Mobile navigation drawer

## PDF structure

**FA:** cover, TOC, problem/solution, auth, dashboard, patients, details, 3-step prescription, treatment plans, library, mobile, benefits, history, conclusion/contact.

**EN:** executive summary, problems, auth, dashboard, patients, details, prescription workflow, treatment plans, mobile, benefits, roadmap, library, conclusion/contact.

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/presentation/config.mjs` | Env + screenshot manifest |
| `scripts/presentation/capture-screenshots.mjs` | Playwright live capture + callouts |
| `scripts/presentation/generate-pdfs.mjs` | HTML slide decks → PDF |
| `scripts/presentation/build-presentation.mjs` | Orchestrator |

## Image fit policy

Screenshots are **never cropped** in the PDFs:

- Fit mode: **contain** (aspect ratio locked)
- Large captures (dashboard, patient list, library, wizard steps) get a **dedicated full screenshot page**
- Images are auto-scaled to the available media box and centered
- Prefer a smaller complete image over a cropped larger one

After each PDF export, an automated check writes:

- `docs/presentation/screenshot-fit-report-FA.json`
- `docs/presentation/screenshot-fit-report-EN.json`

If any screenshot is cropped, clipped, distorted, or overflowing, PDF generation **fails** and must be fixed.