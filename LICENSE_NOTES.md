# External renderer / License notes

- `@paper-design/shaders@0.0.78` is imported from `https://esm.sh/` at runtime. This external dependency is NOT bundled in this ZIP. Network/CSP/CDN blocking can prevent rendering (the CSS fallback remains).
- Paper Shaders is published under Apache-2.0. Upstream: https://github.com/paper-design/shaders . Verify LICENSE and NOTICE of the exact installed version before production, and retain notices if bundling or redistributing its code.
- No React Bits / Silk source is included.
- This release is a GitHub Pages publishing candidate, not a production-audited WordPress plugin.