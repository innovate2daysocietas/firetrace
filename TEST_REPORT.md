# Test report

## Executed checks
- `npm test`: 8/8 unit tests passed for NASA-shaped CSV parsing, missing radiative power, temporal counts, coordinates, closest reference towns, and export roundtrip.
- `npm run check`: JavaScript syntax checks passed.
- Offline Chromium page-render tests: all 5 independent pages rendered; no JavaScript exceptions; Home region control updated; Monitor imported NASA-format **synthetic test fixtures** and updated counts, rows, and observation details; History imported a test file and built the timeline; Bush-burning analysis calculated proximity; mobile menu worked and 390px viewport had no horizontal overflow.
- Single-file interactive preview navigation was tested, including Home → Fire Monitor → Bush-burning Analysis, and CSV import. No JavaScript errors.

## Not yet verified
- Live NASA FIRMS API responses from the production deployment, which require a legitimate NASA MAP_KEY and external network access.
- External OpenStreetMap and satellite base imagery tiles in the deployed browser; offline screenshots use the accessible built-in geographic illustration.
- Real-world field classification, burned-area estimates, district boundary assignments or smoke exposure; these features are **not claimed** by this version.

**All screenshot data shown in the test-data monitor preview are synthetic test records; screenshots are not scientific evidence of actual fires.**
