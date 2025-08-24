#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🗜️ Minifying dictionary data file...');

const filePath = path.join(__dirname, 'src', 'dictionary-data.ts');

try {
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log('📖 Reading dictionary data file...');
  
  // Get original file size
  const originalSize = fs.statSync(filePath).size;
  console.log(`📊 Original file size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
  
  // Count total lines before processing
  const totalLines = content.split('\n').length;
  console.log(`📊 Total lines: ${totalLines}`);
  
  console.log('🗜️ Removing unnecessary spaces...');
  
  // Minify the content by removing unnecessary spaces
  let minified = content
    // Remove spaces around colons in object keys
    .replace(/:\s*{/g, ':{')
    .replace(/:\s*}/g, '}')
    .replace(/:\s*,/g, ',')
    .replace(/:\s*;/g, ';')
    
    // Remove spaces around property names
    .replace(/\{\s*s:/g, '{s:')
    .replace(/,\s*s:/g, ',s:')
    .replace(/,\s*h:/g, ',h:')
    .replace(/,\s*p:/g, ',p:')
    
    // Remove spaces around property values
    .replace(/s:\s*/g, 's:')
    .replace(/h:\s*/g, 'h:')
    .replace(/p:\s*/g, 'p:')
    
    // Remove spaces around commas
    .replace(/\s*,\s*/g, ',')
    
    // Remove spaces around closing braces
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*,\s*}/g, '}')
    
    // Remove spaces around semicolons
    .replace(/\s*;\s*/g, ';')
    
    // Remove extra spaces around quotes in property values
    .replace(/:\s*"/g, ':"')
    .replace(/"\s*,/g, '",')
    .replace(/"\s*}/g, '"}')
    
    // Clean up any remaining multiple spaces
    .replace(/\s+/g, ' ')
    
    // Remove leading/trailing spaces from lines
    .split('\n')
    .map(line => line.trim())
    .join('\n');
  
  // Write the minified content back
  fs.writeFileSync(filePath, minified, 'utf8');
  
  // Get final file size
  const finalSize = fs.statSync(filePath).size;
  const sizeReduction = originalSize - finalSize;
  const sizeReductionPercent = ((sizeReduction / originalSize) * 100).toFixed(2);
  
  // Count lines after processing
  const finalLines = minified.split('\n').length;
  
  console.log(`📊 Final file size: ${(finalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📊 Size reduction: ${(sizeReduction / 1024 / 1024).toFixed(2)} MB (${sizeReductionPercent}%)`);
  console.log(`📊 Lines after minification: ${finalLines}`);
  console.log(`📊 Lines removed: ${totalLines - finalLines}`);
  
  console.log('✅ Successfully minified dictionary data file!');
  
} catch (error) {
  console.error('❌ Error processing file:', error.message);
  process.exit(1);
}
