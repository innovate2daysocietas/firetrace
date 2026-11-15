# FireTrace Uganda

An independent, multi-page satellite-fire investigation application built for Uganda. Separate from the planned **Smokelet** smoke-monitoring project.

## Pages
- `index.html` — interactive editorial landing page and region launch
- `monitor.html` — NASA FIRMS active-fire monitor, map, time series, filtering, metadata and exports
- `history.html` — archive-window link and imported-record timeline
- `impact.html` — proximity-based investigation of bush-burning hotspots near selected Ugandan town centres
- `science.html` — methodology, official NASA references and scientific limitations

## NASA data
NASA FIRMS CSV area endpoint: `https://firms.modaps.eosdis.nasa.gov/api/area/csv/`.

The serverless function `api/fires.js` requests selected NASA FIRMS products via a **server-side** `NASA_FIRMS_MAP_KEY` environment variable. Its allowed geographic regions, products and request lengths are constrained. The interface **does not** generate fake detections when a live request fails. In addition, users can download and import genuine FIRMS CSV files, which are processed locally in the browser.

Instrument options in the app: `VIIRS_SNPP_NRT`, `VIIRS_NOAA20_NRT`, `MODIS_NRT`, `VIIRS_SNPP_SP`. NASA availability varies; use their API documentation to validate date/source compatibility. The static application uses Leaflet and OpenStreetMap tiles via CDN for maps; the illustrations are locally stored original vector assets. An internet connection is required for live map tiles and NASA requests.

## Publish with Vercel (recommended)
1. Register for a NASA FIRMS **MAP_KEY** at https://firms.modaps.eosdis.nasa.gov/api/map_key/ . Do not use the key in frontend code or commit it to Git.
2. Create a GitHub repository and upload all project files, preserving `api/` and `assets/` folders.
3. Import the GitHub repository into Vercel. Framework preset **Other**; project root is the repository root. No build command needed.
4. Add the environment variable `NASA_FIRMS_MAP_KEY` in Vercel → Project Settings → Environment Variables, for Production and Preview as needed.
5. Redeploy after saving the variable, then open `/monitor.html` and press **Load NASA observations**.
6. Inspect the browser network panel for `/api/fires?...`. It should respond with a valid FIRMS CSV. Select different regions, and try downloads and map inspection.

**Important**: Hosting the files on GitHub Pages alone gives the multi-page website and local CSV analysis but **not** the live NASA API server: GitHub Pages does not run `api/fires.js`. For live data use Vercel or another Node-compatible serverless host with the environment key. GitHub can host the source repository.

## Run locally
Install Vercel CLI: `npm install -g vercel`, then run `vercel dev` from this folder and provide the MAP_KEY via `.env.local` (never commit this file). For front-end-only evaluation, run `python -m http.server 8000` and open `http://localhost:8000/`. API requests will be unavailable from the Python static server, but CSV importing works.

## Tests
`npm test` checks CSV parsing, FRP handling, geospatial reference-town proximity, region filters and temporal aggregations. `npm run check` syntax-checks JavaScript files.

## Scientific limits
- FIRMS thermal anomalies are **not** exact fire perimeters, confirmed ignition sources, validated bush-burning causes or proof of community damage.
- Fire radiative power (FRP, MW) measures radiant power associated with a detected heat source; it does **not** equal flame temperature or total burned-area size.
- Reference-town proximity reports use town-centre coordinates and a configurable distance; **not district polygons or exposed population**.
- Results depend on instrument, spatial/temporal coverage, clouds, processing and observation window; no detections does not prove no fires.
- Source attribution NASA FIRMS; **FireTrace is not affiliated with NASA** and is **not** an emergency warning or dispatch system.

## Deployment verification
The source includes an operational API implementation, but this build environment cannot make a live NASA request, so availability and actual remote response must be checked on the deployed domain with a valid FIRMS key. All application data displays start empty and never claim real-time detection without a successful request.
