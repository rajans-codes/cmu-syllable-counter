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

// Optimized Terser configuration for maximum compression
const terserConfig = {
  compress: {
    // Remove console statements and debugger
    drop_console: true,
    drop_debugger: true,
    pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn', 'console.error'],
    
    // Multiple passes for better optimization
    passes: 3,
    
    // Dead code elimination
    dead_code: true,
    unused: true,
    
    // Variable and expression optimization
    collapse_vars: true,
    reduce_vars: true,
    sequences: true,
    conditionals: true,
    comparisons: true,
    evaluate: true,
    booleans: true,
    loops: true,
    if_return: true,
    join_vars: true,
    
    // Advanced optimizations
    side_effects: false,
    properties: true,
    unsafe: false,
    unsafe_comps: false,
    unsafe_math: false,
    unsafe_proto: false,
    unsafe_regexp: false,
    unsafe_undefined: false,
    
    // Function optimizations
    keep_fargs: false,
    keep_fnames: false,
    
    // Hoisting optimizations
    hoist_funs: true,
    hoist_vars: true,
    
    // Switch optimizations
    switches: true,
    
    // Global optimizations
    global_defs: {},
    
    // Remove unused imports
    pure_getters: true,
    
    // Optimize typeof
    typeofs: true
  },
  mangle: {
    // Mangle top-level names
    toplevel: true,
    
    // Mangle properties with underscore prefix
    properties: {
      regex: /^_/
    },
    
    // Mangle function names
    keep_fnames: false,
    
    // Mangle class names
    keep_classnames: false,
    
    // Reserved names (don't mangle these)
    reserved: ['CMUSyllableCounter', 'getSyllableCount', 'getHyphenatedString', 'cmuDictionary']
  },
  format: {
    // Remove all comments
    comments: false,
    
    // Compact output
    beautify: false,
    
    // Preserve semicolons for better compression
    semicolons: true,
    
    // ASCII only
    ascii_only: false,
    
    // Quote style
    quote_style: 1,
    
    // Wrap iife
    wrap_iife: false,
    
    // Preamble
    preamble: null
  },
  
  // Additional options
  ecma: 2015,
  keep_classnames: false,
  keep_fnames: false,
  module: false,
  nameCache: null,
  safari10: false,
  toplevel: true
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
    plugins: [
      ...sharedPlugins,
      terser(terserConfig)
    ],
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
    input: 'src/index.cjs.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      generatedCode: {
        preset: 'es2015',
        constBindings: true
      }
    },
    plugins: [
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
      }),
      terser(terserConfig)
    ],
    external: [],
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false
    }
  },
  
  // UMD (minified, full bundle) - Browser compatibility
  {
    input: 'src/index.cjs.ts',
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
