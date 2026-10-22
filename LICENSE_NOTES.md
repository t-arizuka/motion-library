# External renderer / License notes

- `@paper-design/shaders@0.0.78` is imported from `https://esm.sh/` at runtime. This external dependency is NOT bundled in this ZIP. Network/CSP/CDN blocking can prevent rendering (the CSS fallback remains).
- Paper Shaders is published under Apache-2.0. Upstream: https://github.com/paper-design/shaders . Verify LICENSE and NOTICE of the exact installed version before production, and retain notices if bundling or redistributing its code.
- No React Bits / Silk source is included.
- This release is a GitHub Pages publishing candidate, not a production-audited WordPress plugin.

## Radiant — Silk Cascade (v1)

- `embed/silk/v1/shader.html` is adapted from [Radiant's Silk Cascade](https://github.com/pbakaus/radiant/blob/main/static/silk-cascade.html) by **Paul Bakaus**, MIT License, © 2025 Paul Bakaus.
- A complete MIT license copy is included at `embed/silk/v1/LICENSE-RADIANT.txt`. **Keep it with distributions and future versions.**
- The shipped file preserves the shader's fabric/layered shading and adds adjustable colors, sheen, opacity, and motion. It is a *derivative*, not an unchanged upstream file.
- The separate `studies/silk-material-001/silk-groove-static.html` remains an unapproved comparison prototype, not a production template.
- The standalone Silk renderer uses WebGL1. Mesh/Grain continue to depend on the pinned Paper Shaders library (WebGL2).
