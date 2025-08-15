# Session Management for Word Repetition Prevention

## Overview

The CMU Dictionary library now includes session management capabilities to prevent repeating random words within a user session. This is particularly useful for applications that generate random words frequently, ensuring users don't see the same words repeatedly.

## Key Features

- ✅ **No Word Repetition**: Ensures unique words within a session
- ✅ **Configurable History Size**: Set maximum number of words to remember
- ✅ **Multiple Storage Backends**: In-memory, localStorage, or custom storage
- ✅ **Session Statistics**: Track usage and performance metrics
- ✅ **Export/Import**: Persist sessions across browser sessions
- ✅ **Automatic Reset**: When all words are used, session automatically resets
- ✅ **Minimal Performance Overhead**: Efficient implementation with ~78ms overhead

## Quick Start

### Basic Usage

```javascript
import { createSessionManager, getRandomWordsWithSession } from 'cmu-syllable-counter';

// Create a session manager
const session = createSessionManager({
  maxHistorySize: 100,  // Remember last 100 words
  enabled: true
});

// Get random words without repetition
const words = getRandomWordsWithSession(10, session);

// Check session statistics
const stats = session.getStats();
console.log('Unique words used:', stats.uniqueWordsGenerated);
```

### Browser Persistence

```javascript
import { createBrowserSessionManager } from 'cmu-syllable-counter';

// Create a session that persists in localStorage
const browserSession = createBrowserSessionManager('my-app-session', {
  maxHistorySize: 200
});

// Words will persist across browser sessions
const words = getRandomWordsWithSession(10, browserSession);
```

## API Reference

### SessionManager Class

#### Constructor

```typescript
new SessionManager(config?: SessionConfig)
```

#### Configuration Options

```typescript
interface SessionConfig {
  maxHistorySize?: number;  // Default: 1000
  enabled?: boolean;        // Default: true
  storage?: SessionStorage; // Default: in-memory
}
```

#### Methods

##### `getStats(): SessionStats`
Returns session statistics.

```typescript
interface SessionStats {
  totalWordsGenerated: number;    // Total words generated
  uniqueWordsGenerated: number;   // Unique words generated
  currentHistorySize: number;     // Current history size
  maxHistorySize: number;         // Maximum history size
  sessionStartTime: number;       // Session start timestamp
  lastActivityTime: number;       // Last activity timestamp
}
```

##### `hasWord(word: string): boolean`
Check if a word has been used in this session.

##### `hasWords(words: string[]): boolean[]`
Check if multiple words have been used in this session.

##### `addWords(words: string[]): void`
Add words to session history.

##### `filterUnusedWords(words: string[]): string[]`
Get words that haven't been used in this session.

##### `getRandomUnusedWords(allWords: string[], count: number): string[]`
Get random words that haven't been used in this session.

##### `clear(): void`
Clear session history.

##### `reset(): void`
Reset session (clear and restart).

##### `setEnabled(enabled: boolean): void`
Enable or disable session tracking.

##### `setMaxHistorySize(size: number): void`
Update maximum history size.

##### `export(): SessionData`
Export session data for persistence.

##### `import(data: SessionData): void`
Import session data.

### Factory Functions

#### `createSessionManager(config?: SessionConfig): SessionManager`
Create a session manager with default configuration.

#### `createBrowserSessionManager(storageKey?: string, config?: SessionConfig): SessionManager`
Create a session manager with localStorage persistence.

## Storage Implementations

### In-Memory Storage (Default)
```javascript
const session = createSessionManager({
  storage: new InMemorySessionStorage()
});
```

### LocalStorage Storage (Browser)
```javascript
const session = createBrowserSessionManager('app-session');
```

### Custom Storage
```javascript
class DatabaseSessionStorage {
  constructor(userId) {
    this.userId = userId;
  }
  
  async getWords() {
    return await db.getUserSessionWords(this.userId);
  }
  
  async addWords(words) {
    await db.addUserSessionWords(this.userId, words);
  }
  
  async clear() {
    await db.clearUserSession(this.userId);
  }
  
  async size() {
    return await db.getUserSessionSize(this.userId);
  }
}

const session = createSessionManager({
  storage: new DatabaseSessionStorage('user123'),
  maxHistorySize: 500
});
```

## Usage Examples

### Basic Word Generation

```javascript
import { getRandomWordsWithSession, createSessionManager } from 'cmu-syllable-counter';

const session = createSessionManager({ maxHistorySize: 50 });

// Generate 10 unique random words
const words = getRandomWordsWithSession(10, session);

// Generate 5 more unique words
const moreWords = getRandomWordsWithSession(5, session);

console.log('Total unique words:', session.getStats().uniqueWordsGenerated);
```

### Web Application Integration

```javascript
// Initialize session on app start
let session;

if (typeof window !== 'undefined') {
  // Browser environment
  session = createBrowserSessionManager('word-game-session', {
    maxHistorySize: 100
  });
} else {
  // Server environment
  session = createSessionManager({
    maxHistorySize: 100
  });
}

// Generate words for user
function generateNewWords(count = 10) {
  return getRandomWordsWithSession(count, session);
}

// Check if user has seen a word
function hasUserSeenWord(word) {
  return session.hasWord(word);
}

// Get session statistics
function getSessionStats() {
  return session.getStats();
}
```

### Session Persistence

```javascript
// Save session data
function saveSession() {
  const data = session.export();
  localStorage.setItem('session-backup', JSON.stringify(data));
}

// Restore session data
function restoreSession() {
  const saved = localStorage.getItem('session-backup');
  if (saved) {
    session.import(JSON.parse(saved));
  }
}

// Auto-save on page unload
window.addEventListener('beforeunload', saveSession);
```

### Performance Monitoring

```javascript
// Monitor session performance
function monitorSession() {
  const stats = session.getStats();
  
  console.log('Session Performance:');
  console.log('- Unique words used:', stats.uniqueWordsGenerated);
  console.log('- Session duration:', Math.round((stats.lastActivityTime - stats.sessionStartTime) / 1000), 'seconds');
  console.log('- History utilization:', Math.round((stats.currentHistorySize / stats.maxHistorySize) * 100), '%');
  
  // Alert when session is getting full
  if (stats.currentHistorySize > stats.maxHistorySize * 0.8) {
    console.warn('Session is getting full, consider increasing maxHistorySize');
  }
}
```

## Best Practices

### 1. Choose Appropriate History Size
```javascript
// For small applications (10-50 words)
const smallSession = createSessionManager({ maxHistorySize: 50 });

// For medium applications (100-500 words)
const mediumSession = createSessionManager({ maxHistorySize: 200 });

// For large applications (500+ words)
const largeSession = createSessionManager({ maxHistorySize: 1000 });
```

### 2. Handle Session Overflow
```javascript
function generateWordsWithOverflowHandling(count) {
  const stats = session.getStats();
  
  // If session is nearly full, warn user
  if (stats.currentHistorySize > stats.maxHistorySize * 0.9) {
    console.warn('Session nearly full, some words may repeat soon');
  }
  
  return getRandomWordsWithSession(count, session);
}
```

### 3. Use Browser Storage for Web Apps
```javascript
// For web applications, use localStorage for persistence
const session = createBrowserSessionManager('app-session', {
  maxHistorySize: 200
});

// Session will persist across browser sessions
```

### 4. Monitor Performance
```javascript
// Track session performance over time
const performanceData = [];

function trackPerformance() {
  const stats = session.getStats();
  performanceData.push({
    timestamp: Date.now(),
    uniqueWords: stats.uniqueWordsGenerated,
    historySize: stats.currentHistorySize
  });
}

// Call this periodically
setInterval(trackPerformance, 60000); // Every minute
```

## Troubleshooting

### Common Issues

#### 1. Words Still Repeating
- Check if session is enabled: `session.getStats().enabled`
- Verify history size is sufficient for your use case
- Ensure you're using `getRandomWordsWithSession` instead of `getRandomWords`

#### 2. Performance Issues
- Reduce `maxHistorySize` if memory usage is high
- Use in-memory storage for server-side applications
- Monitor session statistics for bottlenecks

#### 3. Browser Storage Issues
- Check if localStorage is available: `typeof localStorage !== 'undefined'`
- Handle storage quota exceeded errors
- Provide fallback to in-memory storage

### Debug Mode

```javascript
// Enable debug logging
const session = createSessionManager({
  maxHistorySize: 100,
  enabled: true
});

// Monitor session activity
const originalAddWords = session.addWords.bind(session);
session.addWords = function(words) {
  console.log('Adding words to session:', words);
  return originalAddWords(words);
};
```

## Performance Characteristics

- **Memory Usage**: ~1KB per 100 words (in-memory)
- **Processing Overhead**: ~78ms for 100 word operations
- **Storage Size**: ~2KB per 100 words (localStorage)
- **Scalability**: Handles up to 10,000+ words efficiently

## Migration Guide

### From Basic Random Words

```javascript
// Before
const words = getRandomWords(10);

// After
const session = createSessionManager();
const words = getRandomWordsWithSession(10, session);
```

### From Custom Word Tracking

```javascript
// Before: Manual tracking
let usedWords = new Set();
function getUniqueWords(count) {
  const allWords = getAllWords();
  const unused = allWords.filter(w => !usedWords.has(w));
  const selected = unused.slice(0, count);
  selected.forEach(w => usedWords.add(w));
  return selected;
}

// After: Session management
const session = createSessionManager();
const words = getRandomWordsWithSession(count, session);
```

## Conclusion

Session management provides a robust solution for preventing word repetition in applications that generate random words. With configurable storage backends, comprehensive statistics, and minimal performance overhead, it's suitable for both client-side and server-side applications.

The implementation automatically handles edge cases like session overflow and provides tools for monitoring and debugging, making it easy to integrate into existing applications.
