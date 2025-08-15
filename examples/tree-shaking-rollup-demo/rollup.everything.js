
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  input: 'src/everything.js',
  output: {
    file: 'dist/everything.bundle.js',
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    visualizer({
      filename: 'everything-bundle-stats.html',
      open: false
    })
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false
  }
};
