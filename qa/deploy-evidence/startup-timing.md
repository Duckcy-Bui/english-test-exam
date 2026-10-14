# QA harness timing corrections

During the first container restart probe, `docker compose restart` returned before
the app reopened its HTTP socket. The immediate API run reported `fetch failed`.
Waiting for `/api/health` and retrying yielded 10/10 API PASS.

A later metadata probe ran after HTTP became ready but before the periodic Docker
HEALTHCHECK changed `starting` to `healthy`. Its strict health assertion failed.
This was a harness readiness race, not an unhealthy application: HTTP health was
already 200. `deploy.api.mjs` now waits for HTTP readiness and
`deploy.container.mjs` polls Docker health status before checking metadata.
The final clean container cycle reruns both probes and quota restart assertions.

The failed attempts did not expose secrets or alter application source. Final
logs and JSON are from the complete cycle using the corrected readiness checks.
