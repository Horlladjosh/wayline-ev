# Wayline

EV charging company website. Plain HTML, CSS and JavaScript, with stock photography and ten pages. No CMS, framework, npm dependencies or environment variables are required.

## Deploy on Vercel

1. Put this folder's contents at the root of a GitHub repository. Include `dist`.
2. In Vercel, add a project and import that repository.
3. Use **Other** for the framework preset, the repository root for Root Directory, an empty Build Command and `dist` for Output Directory. These settings are included in `vercel.json`.
4. Deploy. Vercel serves the committed files in `dist` directly.

Reference: https://vercel.com/docs/builds/configure-a-build

## Edit content

The canonical page content and shared header/footer templates are in `build.py`. The three case studies are in the `projects` list near the top. Edit that file and regenerate the pages using Python 3.12 or newer:

```sh
python3 build.py
```

Commit both `build.py` and the regenerated HTML files in `dist`. Vercel does not run Python; it publishes the committed output.

Edit styling in `dist/styles.css`, interactions in `dist/site.js`, and photography in `dist/assets`. These files are maintained directly and are not overwritten by the generator. Keep the photo credits in the Terms page template up to date when replacing images.

## Preview locally

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000/ in a browser. Use a server rather than opening the HTML files directly because navigation and asset URLs start at the website root.

## Pages

- `/`
- `/solutions/`
- `/approach/`
- `/projects/`
- `/projects/northline-yard/`
- `/projects/greyfriars-house/`
- `/projects/west-pier-house/`
- `/company/`
- `/plan-a-site/`
- `/terms/`

## Existing behaviour and assets

The enquiry page uses a `mailto:` link to the existing placeholder `hello@wayline.energy`. No form backend is connected. Fonts are loaded from Google Fonts; photography is included locally. Image credits and licence links are on `/terms/`.

The package preserves the current website, including its responsive rules, mobile navigation, scroll-aware header, page transitions, reduced-motion behaviour and parking plan. Browser-based phone/tablet visual QA is still outstanding; packaging checks do not establish rendered responsiveness.

## Provenance

Exported from Wayline version 13, source commit `c7b3d0b05ff08c009ee78854b8ab6dae1fbf2e9d`. Original hosting metadata, credentials, Git history and earlier deployment archives are excluded from this handoff.
