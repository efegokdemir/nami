# Testing

Run `shopify theme check --path nami`. Validate JSON and locale files with a JSON parser, then use `shopify theme dev --path nami` for a development store. Manually test home, product variants, add-to-cart, cart quantity changes, collection/search pages, mobile navigation, keyboard focus, Escape behavior, reduced motion and empty states.

Authenticated unpublished-theme testing for the capability overhaul is recorded in [v0.3 capability QA](v0.3-capability-qa.md). That report separates actual browser checks from untested settings/platform coverage. Do not equate Theme Check or upload success with behavioral correctness.

Run `node scripts/validate-theme.cjs` for JSON/schema/template validation and `node --check assets/nami.js` / `node --check assets/nami-capabilities.js` for syntax. GitHub Actions runs these checks and Theme Check.

The configuration in `docs/fixtures/index.capability-qa.json` uses existing QA-store resources only. It is intentionally outside `templates/`, so it is not a merchant default or uploaded alternate template. Copy it temporarily to a local test checkout's `templates/index.json` for reproducible section exercises, then restore the generic template before any production artifact.
