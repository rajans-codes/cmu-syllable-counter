import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default [
  // Main ES Module (tree-shakable)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
    external: [],
  },
  // Core functionality only (minimal bundle)
  {
    input: 'src/core.ts',
    output: {
      file: 'dist/core.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
    external: [],
  },
  // Text analysis only
  {
    input: 'src/text-analysis.ts',
    output: {
      file: 'dist/text-analysis.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
    external: [],
  },
  // Hyphenation only
  {
    input: 'src/hyphenation.ts',
    output: {
      file: 'dist/hyphenation.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
    external: [],
  },
  // Dictionary utilities only
  {
    input: 'src/dictionary-module.ts',
    output: {
      file: 'dist/dictionary-module.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
    external: [],
  },
  // Analytics only
  {
    input: 'src/analytics.ts',
    output: {
      file: 'dist/analytics.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
    external: [],
  },
  // Cache management only
  {
    input: 'src/cache.ts',
    output: {
      file: 'dist/cache.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
    external: [],
  },
  // CommonJS (full bundle)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
    external: [],
  },
  // UMD (minified, full bundle)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'CMUSyllableCounter',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
    ],
    external: [],
  },
];
