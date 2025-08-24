#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 Removing numbered words from dictionary data file...');

const filePath = path.join(__dirname, 'src', 'dictionary-data.ts');

try {
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log('📖 Reading dictionary data file...');
  
  // Count total lines before processing
  const totalLines = content.split('\n').length;
  console.log(`📊 Total lines: ${totalLines}`);
  
  // Find and remove entries with (number) in the key
  console.log('🔍 Finding entries with (number) in keys...');
  
  // Pattern to match: "word(number)": { ... }
  const numberedWordPattern = /"[^"]*\(\d+\)":\s*{[^}]*},?\s*/g;
  
  // Find all matches
  const matches = content.match(numberedWordPattern);
  const removedCount = matches ? matches.length : 0;
  
  console.log(`🔍 Found ${removedCount} entries with (number) in keys`);
  
  if (removedCount > 0) {
    // Show some examples
    console.log('📝 Examples of entries being removed:');
    matches.slice(0, 5).forEach((match, index) => {
      const keyMatch = match.match(/"([^"]*\(\d+\))"/);
      if (keyMatch) {
        console.log(`   ${index + 1}. "${keyMatch[1]}"`);
      }
    });
    
    if (removedCount > 5) {
      console.log(`   ... and ${removedCount - 5} more`);
    }
  }
  
  // Remove the numbered entries
  console.log('🗑️ Removing numbered entries...');
  let cleaned = content.replace(numberedWordPattern, '');
  
  // Clean up any trailing commas that might be left
  cleaned = cleaned.replace(/,\s*}/g, '}');
  cleaned = cleaned.replace(/,\s*};/g, '};');
  
  // Write the cleaned content back
  fs.writeFileSync(filePath, cleaned, 'utf8');
  
  // Count lines after processing
  const finalLines = cleaned.split('\n').length;
  console.log(`📊 Lines after cleaning: ${finalLines}`);
  console.log(`📊 Lines removed: ${totalLines - finalLines}`);
  
  console.log(`✅ Successfully removed ${removedCount} numbered word entries!`);
  
} catch (error) {
  console.error('❌ Error processing file:', error.message);
  process.exit(1);
}
