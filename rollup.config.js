import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

// Shared plugin configuration for better performance
const sharedPlugins = [
  resolve({
    preferBuiltins: true,
    extensions: ['.ts', '.js']
  }),
  commonjs({
    include: /node_modules/,
    transformMixedEsModules: true
  }),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: true,
    declarationMap: true,
    sourceMap: true,
    exclude: ['**/*.test.ts', '**/*.spec.ts']
  })
];

// Terser configuration for better compression
const terserConfig = {
  compress: {
    drop_console: true,
    drop_debugger: true,
    pure_funcs: ['console.log', 'console.info', 'console.debug'],
    passes: 2,
    dead_code: true,
    unused: true
  },
  mangle: {
    toplevel: true,
    properties: {
      regex: /^_/
    }
  },
  format: {
    comments: false
  }
};

export default [
  // Main ES Module (tree-shakable) - Primary bundle
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true,
      exports: 'named',
      preserveModules: false,
      generatedCode: {
        preset: 'es2015',
        constBindings: true
      }
    },
    plugins: sharedPlugins,
    external: [],
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false,
      tryCatchDeoptimization: false
    }
  },
  
  // CommonJS (full bundle) - Node.js compatibility
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      generatedCode: {
        preset: 'es2015',
        constBindings: true
      }
    },
    plugins: sharedPlugins,
    external: [],
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false
    }
  },
  
  // UMD (minified, full bundle) - Browser compatibility
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'CMUSyllableCounter',
      sourcemap: true,
      exports: 'named',
      generatedCode: {
        preset: 'es2015',
        constBindings: true
      }
    },
    plugins: [
      ...sharedPlugins,
      terser(terserConfig)
    ],
    external: [],
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false
    }
  }
];
