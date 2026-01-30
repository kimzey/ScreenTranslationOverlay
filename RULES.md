# Screen Translation Overlay - Coding Rules

## Version
- **Version**: 0.1.0
- **Last Updated**: 2025-01-31
- **Status**: Draft

---

## Table of Contents
1. [General Principles](#general-principles)
2. [TypeScript Rules](#typescript-rules)
3. [React Rules](#react-rules)
4. [Electron Rules](#electron-rules)
5. [File Organization Rules](#file-organization-rules)
6. [API Design Rules](#api-design-rules)
7. [Testing Rules](#testing-rules)
8. [Performance Rules](#performance-rules)
9. [Security Rules](#security-rules)

---

## General Principles

### 1. Code Quality Over Speed
- **Write readable code first, optimize later**
- If it takes you more than 30 seconds to understand what a function does, it needs refactoring
- Prefer explicit over clever

```typescript
// ❌ BAD: Clever but unreadable
const f = (x) => x.reduce((a, b) => ({ ...a, [b]: b }), {})

// ✅ GOOD: Clear and explicit
const groupById = (items: string[]) => {
  return items.reduce((acc, item) => {
    acc[item] = item
    return acc
  }, {} as Record<string, string>)
}
```

### 2. Fail Fast
- Validate inputs at function boundaries
- Throw errors early with descriptive messages
- Don't silently ignore errors

```typescript
// ❌ BAD: Silent failure
function translate(text: string): string {
  if (!text) return ''
  // ... translation logic
}

// ✅ GOOD: Explicit error
function translate(text: string): string {
  if (!text) {
    throw new Error('translate(): text cannot be empty')
  }
  // ... translation logic
}
```

### 3. Immutability First
- Never mutate function parameters
- Return new objects instead of modifying existing ones
- Use `const` by default, `let` only when necessary

```typescript
// ❌ BAD: Mutation
function updateUser(user: User, name: string): User {
  user.name = name
  return user
}

// ✅ GOOD: Immutable
function updateUser(user: User, name: string): User {
  return {
    ...user,
    name
  }
}
```

---

## TypeScript Rules

### 1. Type Safety
- **Never use `any` unless absolutely necessary**
- Use `unknown` instead of `any` for dynamic data
- Enable strict mode in tsconfig.json

```typescript
// ❌ BAD: any
function parseData(data: any): User {
  return data.user
}

// ✅ GOOD: Type guards
function parseData(data: unknown): User {
  if (!isValidUserData(data)) {
    throw new Error('Invalid user data')
  }
  return data as User
}
```

### 2. Interface Naming
- Use PascalCase for interfaces and types
- Prefix interfaces with `I` is **NOT** required (discouraged)
- Use descriptive names

```typescript
// ❌ BAD: I prefix, generic name
interface IUser {
  name: string
}

// ✅ GOOD: Descriptive, no I prefix
interface UserSettings {
  name: string
  email: string
}
```

### 3. Return Types
- Always specify return types for public functions
- Let TypeScript infer return types for private, simple functions

```typescript
// ✅ GOOD: Explicit return type
public async translate(text: string): Promise<TranslationResult> {
  // ...
}

// ✅ GOOD: Inferred for private/simple
private isValid(text: string) {
  return text.length > 0
}
```

### 4. Error Handling
- Use Error classes, not strings
- Create custom error types for domain-specific errors

```typescript
// ❌ BAD: String errors
throw 'Translation failed'

// ✅ GOOD: Error classes
class TranslationError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'TranslationError'
  }
}

throw new TranslationError('API rate limit exceeded', 'RATE_LIMIT')
```

---

## React Rules

### 1. Component Design
- **Keep components small (<200 lines)**
- Single responsibility per component
- Prefer functional components with hooks

```typescript
// ✅ GOOD: Small, focused component
export function TranslationOverlay({ result }: Props) {
  return (
    <div className="overlay">
      <p>{result.translatedText}</p>
    </div>
  )
}

// ❌ BAD: Large component doing too much
export function TranslationOverlay({ result }: Props) {
  // 200+ lines of logic
  // Handles UI, state, API calls, formatting...
}
```

### 2. Hooks Usage
- Custom hooks for reusable logic
- Keep hooks simple and focused
- Don't call hooks inside conditions or loops

```typescript
// ✅ GOOD: Custom hook
function useTranslation() {
  const [result, setResult] = useState<TranslationResult | null>(null)

  const translate = async (text: string) => {
    const result = await translationService.translate(text)
    setResult(result)
  }

  return { result, translate }
}

// ✅ GOOD: Usage
function MyComponent() {
  const { result, translate } = useTranslation()
  // ...
}
```

### 3. State Management
- Use Zustand for global state
- Keep component state local when possible
- Avoid prop drilling (use context or Zustand)

```typescript
// ✅ GOOD: Zustand store
interface SettingsStore {
  opacity: number
  setOpacity: (opacity: number) => void
}

const useSettingsStore = create<SettingsStore>((set) => ({
  opacity: 90,
  setOpacity: (opacity) => set({ opacity })
}))

// ✅ GOOD: Usage
function OpacitySlider() {
  const { opacity, setOpacity } = useSettingsStore()
  return <input type="range" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
}
```

### 4. Props Definition
- Define props as interfaces
- Use descriptive names
- Provide default values when appropriate

```typescript
// ✅ GOOD: Clear props interface
interface TranslationDisplayProps {
  result: TranslationResult
  onClose?: () => void
  autoHideDelay?: number
}

export function TranslationDisplay({
  result,
  onClose,
  autoHideDelay = 30000
}: TranslationDisplayProps) {
  // ...
}
```

---

## Electron Rules

### 1. IPC Communication
- **Use context bridge, NEVER expose Node.js directly**
- Define IPC channels as constants
- Type-safe IPC handlers

```typescript
// ❌ BAD: Direct Node access (renderer)
const fs = require('fs')
fs.readFile('file.txt')

// ✅ GOOD: Context bridge (preload)
contextBridge.exposeInMainWorld('electron', {
  readFile: (path: string) => ipcRenderer.invoke('fs:readFile', path)
})

// ✅ GOOD: Usage (renderer)
window.electron.readFile('file.txt')
```

### 2. Security
- **Disable node integration in renderer**
- Enable context isolation
- Use sandbox mode

```typescript
// ✅ GOOD: Secure webPreferences
new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true,
    preload: path.join(__dirname, 'preload.js')
  }
})
```

### 3. Window Management
- **Store window references in a Map**
- Clean up window references on close
- Don't create duplicate windows

```typescript
// ✅ GOOD: Window manager
class WindowManager {
  private windows = new Map<string, BrowserWindow>()

  createMainWindow(): BrowserWindow {
    if (this.windows.has('main')) {
      return this.windows.get('main')!
    }

    const win = new BrowserWindow({ /* ... */ })
    this.windows.set('main', win)

    win.on('closed', () => {
      this.windows.delete('main')
    })

    return win
  }
}
```

### 4. Process Separation
- Run CPU-intensive tasks in main process, not renderer
- Use worker threads for parallel processing
- Don't block the main thread

```typescript
// ✅ GOOD: Worker for OCR
class OcrService {
  private workers: Map<string, Worker>

  async processImage(image: Buffer): Promise<OcrResult> {
    const worker = await this.getWorker()
    return worker.recognize(image)
  }
}
```

---

## File Organization Rules

### 1. Directory Structure
- Organize by feature/domain, not by file type
- Keep related files together
- Use index files for clean imports

```
// ❌ BAD: Organized by type
src/
  components/
    Button.tsx
    Input.tsx
  hooks/
    useSettings.ts
    useTranslation.ts
  services/
    ocr.ts
    translation.ts

// ✅ GOOD: Organized by feature
src/
  features/
    settings/
      components/
        SettingsPanel.tsx
      hooks/
        useSettings.ts
    translation/
      services/
        ocr.ts
        translation.ts
      components/
        TranslationOverlay.tsx
```

### 2. File Size
- **Keep files under 200 lines**
- Split large files into smaller modules
- Extract utilities to separate files

### 3. Import Order
1. Node.js built-ins
2. External dependencies
3. Internal modules (prefixed with @)
4. Relative imports
5. Types (if separated)

```typescript
// ✅ GOOD: Correct import order
import { app, BrowserWindow } from 'electron'  // External
import { createSettingsStore } from '@main/store/settings'  // Internal
import { TranslationResult } from './types'  // Relative
```

### 4. Naming Conventions
- **Files**: kebab-case (`translation-service.ts`)
- **Folders**: kebab-case (`translation-service/`)
- **Components**: PascalCase (`TranslationOverlay.tsx`)
- **Utilities**: kebab-case (`format-text.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (`TranslationResult`)

---

## API Design Rules

### 1. Function Design
- **Functions should do one thing well**
- Use descriptive names (verbs + nouns)
- Limit parameters to 3 or fewer (use objects for more)

```typescript
// ❌ BAD: Too many parameters
function translate(text: string, from: string, to: string, cache: boolean, retry: number): Promise<string>

// ✅ GOOD: Options object
interface TranslateOptions {
  from?: string
  to: string
  cache?: boolean
  retry?: number
}

function translate(text: string, options: TranslateOptions): Promise<TranslationResult>
```

### 2. Error Handling
- **Always handle errors in async functions**
- Return structured error responses
- Log errors with context

```typescript
// ✅ GOOD: Comprehensive error handling
async function translate(text: string): Promise<TranslationResult> {
  try {
    const result = await api.translate(text)
    return result
  } catch (error) {
    logger.error('Translation failed', { text, error })
    throw new TranslationError('Failed to translate', 'TRANSLATION_ERROR', error)
  }
}
```

### 3. Async/Await
- **Prefer async/await over Promise chains**
- Use Promise.all for parallel operations
- Never mix callbacks with promises

```typescript
// ❌ BAD: Callback hell
function processTranslation(text: string, callback: (result: string) => void) {
  ocr.extract(text, (ocrResult) => {
    translate(ocrResult, (translation) => {
      callback(translation)
    })
  })
}

// ✅ GOOD: Async/await
async function processTranslation(text: string): Promise<string> {
  const ocrResult = await ocr.extract(text)
  const translation = await translate(ocrResult)
  return translation
}
```

---

## Testing Rules

### 1. Test Structure
- **Follow AAA pattern: Arrange, Act, Assert**
- One assertion per test (when possible)
- Descriptive test names

```typescript
// ✅ GOOD: Clear test structure
describe('TranslationService', () => {
  it('should translate text to Thai', async () => {
    // Arrange
    const service = new TranslationService()
    const text = 'Hello'

    // Act
    const result = await service.translate(text, 'th')

    // Assert
    expect(result.translatedText).toBe('สวัสดี')
  })
})
```

### 2. Test Coverage
- **Target 80%+ code coverage**
- Test critical paths thoroughly
- Mock external dependencies

```typescript
// ✅ GOOD: Mocked dependencies
describe('TranslationService', () => {
  it('should retry on failure', async () => {
    const mockApi = {
      translate: vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ text: 'สวัสดี' })
    }

    const service = new TranslationService(mockApi)
    const result = await service.translate('Hello', 'th')

    expect(mockApi.translate).toHaveBeenCalledTimes(2)
    expect(result.translatedText).toBe('สวัสดี')
  })
})
```

### 3. Test Files
- Name test files: `*.test.ts` or `*.spec.ts`
- Keep test files next to source files
- Use `__tests__` folder for integration tests

---

## Performance Rules

### 1. Lazy Loading
- **Lazy-load heavy dependencies**
- Code-split by route or feature
- Dynamic imports for large modules

```typescript
// ✅ GOOD: Dynamic import
const Tesseract = await import('tesseract.js')

// ✅ GOOD: Lazy-loading in React
const HistoryPanel = lazy(() => import('./components/HistoryPanel'))
```

### 2. Memoization
- **Memoize expensive computations**
- Use React.memo for component optimization
- Cache function results

```typescript
// ✅ GOOD: Memoized expensive function
const extractText = memoize(async (image: Buffer): Promise<string> => {
  return await ocrService.recognize(image)
})

// ✅ GOOD: Memoized component
export const TranslationOverlay = React.memo(({ result }: Props) => {
  // ...
})
```

### 3. Debouncing/Throttling
- **Debounce user input**
- Throttle expensive operations
- Use requestAnimationFrame for UI updates

```typescript
// ✅ GOOD: Debounced search
const debouncedSearch = useMemo(
  () => debounce((query: string) => searchHistory(query), 300),
  []
)
```

---

## Security Rules

### 1. Input Validation
- **Validate all user input**
- Sanitize data before display
- Use TypeScript for type safety

```typescript
// ✅ GOOD: Input validation
function translateText(text: string): Promise<TranslationResult> {
  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty')
  }

  if (text.length > 10000) {
    throw new Error('Text too long (max 10000 characters)')
  }

  return translationService.translate(text)
}
```

### 2. Sensitive Data
- **Never log sensitive data**
- Don't commit API keys
- Use environment variables for secrets

```typescript
// ❌ BAD: Logging sensitive data
console.log('Translation result:', result) // May contain personal info

// ✅ GOOD: Sanitized logging
logger.info('Translation completed', {
  length: result.text.length,
  language: result.language
})
```

### 3. Content Security
- **Set Content Security Policy headers**
- Disable eval and inline scripts
- Use HTTPS for external requests

```typescript
// ✅ GOOD: CSP
session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': ["default-src 'self'"]
    }
  })
})
```

---

## Enforcement

### ESLint Configuration
```json
{
  "rules": {
    "@typescript-eslint/no-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "no-console": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Pre-commit Hooks
- Run ESLint
- Run TypeScript type checking
- Run tests on changed files

### Code Review Checklist
- [ ] Follows naming conventions
- [ ] No `any` types
- [ ] Proper error handling
- [ ] Tests included
- [ ] No console.log statements
- [ ] Immutable patterns used
- [ ] Performance considered
- [ ] Security reviewed

---

## Appendix: Quick Reference

| Category | Rule | Priority |
|----------|------|----------|
| TypeScript | No `any` types | High |
| TypeScript | Explicit return types for public APIs | Medium |
| React | Components <200 lines | High |
| React | Use hooks, not classes | High |
| Electron | No node integration in renderer | Critical |
| Electron | Use context bridge | Critical |
| Performance | Lazy-load heavy deps | Medium |
| Performance | Memoize expensive ops | Medium |
| Security | Validate all inputs | Critical |
| Security | No hardcoded secrets | Critical |
| Testing | 80%+ coverage | High |
| Files | <200 lines per file | Medium |
| Naming | kebab-case for files | Medium |
| Naming | PascalCase for components | Medium |
