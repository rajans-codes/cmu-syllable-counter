
# CMU Dictionary Tree-Shaking Demo

This demo shows how different import patterns affect bundle size when using webpack.

## Setup

```bash
npm install
```

## Build Bundles

```bash
# Build all bundles
npm run build:minimal
npm run build:hyphenation
npm run build:text-analysis
npm run build:analytics
npm run build:everything
```

## Analyze Results

```bash
node analyze-bundles.js
```

## Bundle Reports

After building, check the generated HTML reports in the `dist` directory:
- `minimal-bundle-report.html`
- `hyphenation-bundle-report.html`
- `text-analysis-bundle-report.html`
- `analytics-bundle-report.html`
- `everything-bundle-report.html`

## Expected Results

- **Minimal**: Smallest bundle (core functionality only)
- **Hyphenation**: Slightly larger (core + hyphenation)
- **Text Analysis**: Larger (core + text processing)
- **Analytics**: Larger (core + statistical analysis)
- **Everything**: Largest (entire library)

## Key Takeaways

1. **Tree-shaking works**: Only imported code is included
2. **Import selectively**: Choose only what you need
3. **Avoid wildcard imports**: `import *` includes everything
4. **Bundle analysis**: Use tools to verify what's included
