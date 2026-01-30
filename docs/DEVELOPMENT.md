# Development Guide

## Version
- **Version**: 0.1.0
- **Last Updated**: 2025-01-31

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Project Structure](#project-structure)
4. [Testing](#testing)
5. [Building & Packaging](#building--packaging)
6. [Debugging](#debugging)
7. [Contributing](#contributing)
8. [Release Process](#release-process)

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ or **pnpm** 8+
- **Git** 2.30+
- **Python** 3.8+ (for node-gyp, native modules)

### Clone & Install

```bash
# Clone repository
git clone https://github.com/yourusername/screen-translation-overlay.git
cd screen-translation-overlay

# Install dependencies
npm install

# or with pnpm (recommended)
pnpm install
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env if needed (defaults work for development)
nano .env
```

### Development Mode

```bash
# Start development with hot reload
npm run dev

# or
pnpm dev
```

This will:
- Start Electron in development mode
- Launch Vite dev server for React UI
- Enable hot module replacement (HMR)
- Open DevTools automatically

---

## Development Workflow

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add screen capture functionality"

# Push to remote
git push origin feature/your-feature-name

# Create pull request
gh pr create --title "Add screen capture" --body "Description..."
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Test changes
- `chore`: Build process, dependencies

**Examples:**
```
feat: add multi-monitor support

Implement support for capturing screens from multiple
monitors. Users can now select which display to capture.

Closes #123
```

```
fix: correct OCR language detection

Fix issue where OCR would always detect English even
when text was clearly Japanese. Now properly uses
Tesseract's language detection.
```

### Code Style

We use:
- **ESLint** for linting
- **Prettier** for formatting
- **TypeScript** for type safety

Run before committing:

```bash
# Lint
npm run lint

# Type check
npm run type-check

# Format
npm run format
```

---

## Project Structure

```
ScreenTranslationOverlay/
├── src/
│   ├── main/                      # Electron main process
│   │   ├── index.ts              # Entry point
│   │   ├── shortcuts.ts          # Global shortcuts
│   │   ├── tray.ts               # System tray
│   │   ├── windows/              # Window management
│   │   │   ├── main.ts
│   │   │   ├── overlay.ts
│   │   │   ├── selector.ts
│   │   │   └── history.ts
│   │   ├── services/             # Business logic
│   │   │   ├── capture.ts
│   │   │   ├── ocr.ts
│   │   │   └── translation.ts
│   │   └── store/                # Data persistence
│   │       ├── settings.ts
│   │       └── database.ts
│   │
│   ├── renderer/                  # Preload scripts
│   │   └── preload/
│   │       └── index.ts          # Context bridge
│   │
│   └── shared/                    # Shared code
│       ├── types/                # TypeScript types
│       │   ├── settings.ts
│       │   ├── history.ts
│       │   ├── ipc.ts
│       │   └── index.ts
│       ├── constants/            # Constants
│       │   ├── shortcuts.ts
│       │   ├── languages.ts
│       │   └── index.ts
│       └── utils/                # Utilities
│           ├── keyboard.ts
│           ├── image.ts
│           └── logger.ts
│
├── ui/                            # React app (separate Vite)
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── Settings/
│   │   │   │   ├── SettingsPanel.tsx
│   │   │   │   ├── GeneralTab.tsx
│   │   │   │   ├── ShortcutsTab.tsx
│   │   │   │   ├── OverlayTab.tsx
│   │   │   │   └── HistoryTab.tsx
│   │   │   ├── Overlay/
│   │   │   │   └── TranslationDisplay.tsx
│   │   │   ├── Selector/
│   │   │   │   └── ScreenSelector.tsx
│   │   │   ├── History/
│   │   │   │   ├── HistoryList.tsx
│   │   │   │   └── HistoryItem.tsx
│   │   │   └── Common/           # Shared components
│   │   │       ├── Button.tsx
│   │   │       ├── Input.tsx
│   │   │       └── Modal.tsx
│   │   ├── hooks/                # React hooks
│   │   │   ├── useIpc.ts
│   │   │   ├── useSettings.ts
│   │   │   └── useTranslation.ts
│   │   ├── stores/               # Zustand stores
│   │   │   └── settingsStore.ts
│   │   ├── styles/               # Styles
│   │   │   └── index.css
│   │   ├── App.tsx               # Root component
│   │   └── main.tsx              # Entry point
│   ├── index.html
│   └── vite.config.ts
│
├── resources/
│   ├── icons/                    # App icons
│   │   ├── icon.ico              # Windows
│   │   ├── icon.icns             # macOS
│   │   └── icon.png              # Linux/fallback
│   ├── tesseract-data/           # OCR language data
│   │   ├── .gitkeep
│   │   └── (downloaded during build)
│   └── scripts/                  # Build scripts
│       ├── download-tesseract.ts
│       └── build-icons.ts
│
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── USER_GUIDE.md
│   └── DEVELOPMENT.md            # This file
│
├── .env.example
├── .gitignore
├── package.json
├── electron.vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## Testing

### Test Structure

```
src/
├── main/
│   ├── services/
│   │   ├── ocr.ts
│   │   └── ocr.test.ts           # Unit tests
├── renderer/
│   └── preload/
│       ├── index.ts
│       └── index.test.ts         # Unit tests
ui/src/
├── components/
│   ├── Settings/
│   │   ├── GeneralTab.tsx
│   │   └── GeneralTab.test.tsx   # Component tests
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- ocr.test.ts
```

### Writing Tests

**Unit Tests (Vitest):**

```typescript
// src/main/services/ocr.test.ts
import { describe, it, expect, vi } from 'vitest'
import { OcrService } from './ocr'

describe('OcrService', () => {
  it('should extract text from image', async () => {
    const service = new OcrService()
    const mockImage = Buffer.from('fake image')

    const result = await service.extractText(mockImage, {
      language: 'en'
    })

    expect(result.text).toBe('Hello World')
    expect(result.confidence).toBeGreaterThan(80)
  })

  it('should handle empty image', async () => {
    const service = new OcrService()

    await expect(
      service.extractText(Buffer.alloc(0))
    ).rejects.toThrow('Image cannot be empty')
  })
})
```

**Component Tests (React Testing Library):**

```typescript
// ui/src/components/Settings/GeneralTab.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { GeneralTab } from './GeneralTab'

describe('GeneralTab', () => {
  it('should render language selector', () => {
    render(<GeneralTab />)

    expect(screen.getByLabelText('ภาษาต้นฉบับ')).toBeInTheDocument()
  })

  it('should change language when selected', () => {
    render(<GeneralTab />)

    const select = screen.getByLabelText('ภาษาต้นฉบับ')
    fireEvent.change(select, { target: { value: 'ja' } })

    expect(select.value).toBe('ja')
  })
})
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e -- --ui
```

```typescript
// e2e/capture.spec.ts
import { test, expect } from '@playwright/test'

test('complete capture and translation flow', async ({ app }) => {
  // Open app
  await app.mainWindow.waitForSelector('#app')

  // Trigger capture
  await app.mainWindow.keyboard.press('Control+Shift+X')

  // Select screen region (simulated)
  await app.mainWindow.mouse.click(100, 100)
  await app.mainWindow.mouse.move(500, 300)
  await app.mainWindow.mouse.up()

  // Wait for result
  await expect(app.mainWindow.getByText('แปลภาษา')).toBeVisible()
})
```

---

## Building & Packaging

### Development Build

```bash
# Build for development
npm run build

# Output: dist/
```

### Production Build

```bash
# Build for current platform
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

Output in `release/` directory:
- Windows: `ScreenTranslationOverlay Setup 0.1.0.exe`
- macOS: `ScreenTranslationOverlay-0.1.0.dmg`
- Linux: `screen-translation-overlay-0.1.0.AppImage`

### Build Configuration

Build settings in `package.json`:

```json
{
  "build": {
    "appId": "com.yourcompany.screen-translation-overlay",
    "productName": "Screen Translation Overlay",
    "directories": {
      "output": "release",
      "buildResources": "resources"
    },
    "files": ["dist/**/*", "resources/**/*"],
    "win": {
      "target": ["nsis"],
      "icon": "resources/icons/icon.ico"
    },
    "mac": {
      "target": ["dmg"],
      "icon": "resources/icons/icon.icns",
      "category": "public.app-category.productivity"
    }
  }
}
```

### Signing (Optional)

**Windows:**

```bash
# Set environment variables
set WIN_CSC_LINK=path/to/certificate.pfx
set WIN_CSC_KEY_PASSWORD=your-password

# Build signed
npm run build:win
```

**macOS:**

```bash
# Set environment variables
export APPLE_ID="your@apple.id"
export APPLE_ID_PASSWORD="app-specific-password"
export APPLE_TEAM_ID="your-team-id"

# Build signed
npm run build:mac
```

---

## Debugging

### Main Process

**Console Logging:**

```typescript
import { logger } from '@shared/utils/logger'

logger.info('Translation completed', { id: result.id })
logger.error('Translation failed', error)
```

**Chrome DevTools:**

Main process DevTools open automatically in development mode.

### Renderer Process

**React DevTools:**

Install React DevTools browser extension, works in Electron.

**Component Debugging:**

```typescript
useEffect(() => {
  console.log('Settings updated:', settings)
}, [settings])
```

### IPC Debugging

```typescript
// Log all IPC communication
ipcMain.on('.*', (event, channel, ...args) => {
  console.log(`IPC [${channel}]:`, args)
})
```

### Performance Profiling

```typescript
// Measure execution time
console.time('ocr-processing')
await ocrService.extractText(image)
console.timeEnd('ocr-processing')
```

### Memory Leaks

```bash
# Run with heap snapshot
npm run dev -- --inspect

# Open Chrome: chrome://inspect
# Click "Inspect" on Electron process
# Take heap snapshots
```

---

## Contributing

### Setting Up Development Environment

1. **Fork repository** on GitHub
2. **Clone your fork**
3. **Install dependencies**: `pnpm install`
4. **Create branch**: `git checkout -b feature/your-feature`

### Making Changes

1. **Follow coding standards** (see `RULES.md`)
2. **Write tests** for new functionality
3. **Update documentation** if needed
4. **Run tests**: `npm test`
5. **Run linting**: `npm run lint`

### Submitting PR

1. **Push changes**: `git push origin feature/your-feature`
2. **Create Pull Request** on GitHub
3. **Fill PR template**:
   - Description of changes
   - Related issues
   - Testing steps
   - Screenshots (if UI changes)

### Code Review Checklist

- [ ] Code follows style guide
- [ ] Tests included (80%+ coverage)
- - [ ] Documentation updated
- [ ] No console.log statements
- [ ] No hardcoded values
- [ ] TypeScript types correct
- [ ] No security vulnerabilities
- [ ] Performance considered

### Getting Help

- **Documentation**: `docs/` folder
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Discord**: [link]

---

## Release Process

### Version Bump

Follow [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH

0.1.0 → 0.2.0 (minor feature)
0.2.0 → 0.2.1 (bug fix)
0.2.1 → 1.0.0 (major release)
```

### Release Checklist

1. **Update version** in `package.json`
2. **Update CHANGELOG.md**
3. **Run full test suite**: `npm test`
4. **Build release packages**:
   ```bash
   npm run build:win
   npm run build:mac
   npm run build:linux
   ```
5. **Test installers** on clean machines
6. **Create Git tag**:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
7. **Create GitHub Release**:
   - Upload installers
   - Publish release notes
8. **Update documentation** (version numbers)

### Changelog Format

```markdown
## [0.1.0] - 2025-01-31

### Added
- Screen capture with drag selection
- OCR text extraction using Tesseract.js
- Translation to Thai via Google Translate
- Transparent overlay display
- Settings UI with tabs
- Translation history with search

### Changed
- N/A

### Fixed
- N/A

### Removed
- N/A
```

### Auto-Update (Future)

Configure `electron-updater`:

```typescript
// src/main/index.ts
import { autoUpdater } from 'electron-updater'

autoUpdater.checkForUpdatesAndNotify()
```

---

## Common Tasks

### Adding a New Window

```typescript
// src/main/windows/custom.ts
import { BrowserWindow } from 'electron'

export function createCustomWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173/#/custom')
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'), {
      hash: '/custom'
    })
  }

  return win
}
```

### Adding IPC Handler

```typescript
// src/main/index.ts
ipcMain.handle('custom:command', async (event, arg) => {
  // Process command
  return result
})
```

```typescript
// src/renderer/preload/index.ts
contextBridge.exposeInMainWorld('electron', {
  customCommand: (arg) => ipcRenderer.invoke('custom:command', arg)
})
```

```typescript
// ui/src/App.tsx
const result = await window.electron.customCommand(arg)
```

### Adding Service

```typescript
// src/main/services/custom.ts
export class CustomService {
  constructor(private deps: Dependencies) {}

  async doSomething(input: string): Promise<Result> {
    // Implementation
  }
}
```

### Adding React Component

```typescript
// ui/src/components/CustomComponent.tsx
interface Props {
  value: string
  onChange: (value: string) => void
}

export function CustomComponent({ value, onChange }: Props) {
  return (
    <div className="custom">
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
```

---

## Performance Tips

### Main Process

- Use worker threads for CPU-intensive tasks
- Implement caching for expensive operations
- Use lazy loading for large modules
- Profile memory usage regularly

### Renderer Process

- Use `React.memo` for expensive components
- Implement virtual scrolling for long lists
- Debounce user input
- Code-split by route

### IPC

- Minimize IPC calls (batch data)
- Use structured clone algorithm friendly data
- Avoid sending large images over IPC (use fs paths)

---

## Resources

### Documentation

- [Electron Docs](https://www.electronjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tesseract.js Docs](https://github.com/naptha/tesseract.js)

### Tools

- [Electron Fiddle](https://www.electronjs.org/fiddle) - Quick prototyping
- [React DevTools](https://react.dev/learn/react-developer-tools) - Debug React
- [Vue DevTools](https://devtools.vuejs.org) - If using Vue
- [Spectron](https://www.electronjs.org/spectron) - E2E testing (deprecated)

### Community

- [Electron Slack](https://slackinvites.electronjs.org/)
- [Reddit r/electronjs](https://www.reddit.com/r/electronjs/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/electron)

---

## License

MIT License - see LICENSE file for details.

---

## Questions?

For questions or issues:
1. Check existing [GitHub Issues](https://github.com/yourusername/screen-translation-overlay/issues)
2. Read [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
3. Read [API.md](API.md) for API reference
4. Create new issue if needed

Happy coding! 🚀
