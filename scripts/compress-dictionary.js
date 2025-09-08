#!/usr/bin/env node

/**
 * Dictionary Compression Script
 * 
 * This script compresses the CMU dictionary data at build time
 * to reduce bundle size while maintaining functionality.
 */

import fs from 'fs';
import path from 'path';
import pako from 'pako';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const dictionaryDataPath = path.join(__dirname, '../src/dictionary-data.ts');
const compressedDataPath = path.join(__dirname, '../src/dictionary-data-compressed.ts');

console.log('🗜️  Compressing dictionary data...');

try {
  // Read the original dictionary data
  const dictionaryContent = fs.readFileSync(dictionaryDataPath, 'utf8');
  
  // Extract the dictionary object from the TypeScript file
  const dictionaryMatch = dictionaryContent.match(/export const CMU_DICTIONARY[^=]*= ({[\s\S]*?});/);
  
  if (!dictionaryMatch) {
    throw new Error('Could not find CMU_DICTIONARY export in dictionary-data.ts');
  }
  
  const dictionaryString = dictionaryMatch[1];
  
  // Parse the dictionary object (handle TypeScript syntax)
  const cleanDictionaryString = dictionaryString
    .replace(/:\s*{/g, ': {')  // Fix spacing around colons
    .replace(/,\s*}/g, '}')    // Remove trailing commas before closing braces
    .replace(/,\s*]/g, ']');   // Remove trailing commas before closing brackets
  
  // Parse the dictionary object
  const dictionary = eval(`(${cleanDictionaryString})`);
  
  // Convert to JSON string for compression
  const jsonString = JSON.stringify(dictionary);
  
  // Compress using gzip
  const compressed = pako.gzip(jsonString);
  
  // Convert to base64 for embedding in TypeScript
  const base64Compressed = Buffer.from(compressed).toString('base64');
  
  // Create the compressed dictionary file
  const compressedContent = `/**
 * Compressed CMU Dictionary Data
 * 
 * This file contains the CMU Pronouncing Dictionary data compressed using gzip.
 * The data is automatically decompressed at runtime for optimal bundle size.
 * 
 * Original size: ~${Math.round(jsonString.length / 1024)}KB
 * Compressed size: ~${Math.round(compressed.length / 1024)}KB
 * Compression ratio: ${Math.round((1 - compressed.length / jsonString.length) * 100)}%
 */

import pako from 'pako';

// Compressed dictionary data (base64 encoded gzip)
const COMPRESSED_DICTIONARY_DATA = '${base64Compressed}';

// Decompression function
function decompressDictionary() {
  try {
    // Decode base64
    const compressed = Buffer.from(COMPRESSED_DICTIONARY_DATA, 'base64');
    
    // Decompress using pako
    const decompressed = pako.ungzip(compressed, { to: 'string' });
    
    // Parse JSON
    return JSON.parse(decompressed);
  } catch (error) {
    console.error('Failed to decompress dictionary data:', error);
    throw new Error('Dictionary decompression failed');
  }
}

// Export the decompressed dictionary
export const CMU_DICTIONARY = decompressDictionary();

// Export compression info for debugging
export const COMPRESSION_INFO = {
  originalSize: ${jsonString.length},
  compressedSize: ${compressed.length},
  compressionRatio: ${Math.round((1 - compressed.length / jsonString.length) * 100)},
  compressionMethod: 'gzip'
};
`;

  // Write the compressed dictionary file
  fs.writeFileSync(compressedDataPath, compressedContent);
  
  console.log('✅ Dictionary compression completed!');
  console.log(`📊 Original size: ${Math.round(jsonString.length / 1024)}KB`);
  console.log(`📊 Compressed size: ${Math.round(compressed.length / 1024)}KB`);
  console.log(`📊 Compression ratio: ${Math.round((1 - compressed.length / jsonString.length) * 100)}%`);
  console.log(`📁 Compressed file: ${compressedDataPath}`);
  
} catch (error) {
  console.error('❌ Dictionary compression failed:', error);
  process.exit(1);
}
