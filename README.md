# The Future Is Yours — website

A static website ready for GitHub + Cloudflare Pages.

## Deploy
1. Upload `index.html` and the `assets` folder to the root of your GitHub repository.
2. In Cloudflare > Workers & Pages > Create > Pages > Connect to Git, select the repository.
3. Framework preset: None. Build command: leave blank. Build output directory: `/` (repository root).
4. Deploy and test the `*.pages.dev` URL.
5. In your Pages project, choose Custom domains and follow Cloudflare's DNS instructions for `thefutureis-yours.com`.

## Edit
- Main design and text: `index.html`
- Background visual: `assets/universe.png`
- Replace the placeholder `hello@thefutureis-yours.com` email address before launch.

Note: The artwork is used as one background image. Individual cards within it are not separate clickable elements yet.
