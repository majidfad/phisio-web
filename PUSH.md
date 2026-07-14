# Push to GitHub

Repos are committed locally. Run these commands after `gh auth login`:

```powershell
gh repo create majidfad/phisio-web --public --confirm
cd c:\Users\Mahboubeh\source\repos\Phisio.Frontend
git push -u origin main
```

Or create an empty repo at https://github.com/new named `phisio-web`, then `git push -u origin main`.

Deploy **backend first**, then frontend (shared Docker network `phisio_internal`).
