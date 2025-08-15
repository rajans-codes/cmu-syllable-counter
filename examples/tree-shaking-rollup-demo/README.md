
# CMU Dictionary Rollup Tree-Shaking Demo

This demo shows how different import patterns affect bundle size when using Rollup.

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
npm run analyze
```

## Bundle Reports

After building, check the generated HTML reports in the `dist` directory:
- `minimal-bundle-stats.html`
- `hyphenation-bundle-stats.html`
- `text-analysis-bundle-stats.html`
- `analytics-bundle-stats.html`
- `everything-bundle-stats.html`

## Expected Results

- **Minimal**: Smallest bundle (core functionality only)
- **Hyphenation**: Slightly larger (core + hyphenation)
- **Text Analysis**: Larger (core + text processing)
- **Analytics**: Larger (core + statistical analysis)
- **Everything**: Largest (entire library)

## Key Takeaways

1. **Rollup tree-shaking**: Excellent tree-shaking out of the box
2. **Import selectively**: Choose only what you need
3. **Avoid wildcard imports**: `import *` includes everything
4. **Bundle analysis**: Use visualizer to verify what's included
5. **Gzip compression**: Further reduces transfer sizes

## Rollup vs Webpack

- **Rollup**: Better tree-shaking, smaller bundles
- **Webpack**: More features, larger ecosystem
- **Both**: Support tree-shaking effectively
