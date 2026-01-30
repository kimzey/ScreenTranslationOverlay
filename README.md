# Screen Translation Overlay

แอปพลิเคชันแปลภาษาบนหน้าจอในเวลาจริงสำหรับผู้ใช้ภาษาไทย

Real-time screen translation application for Thai users

## ✨ Features

- ⚡ **Fast**: Translation in 2-3 seconds
- 🎯 **Accurate**: 90%+ OCR accuracy on clear text
- 🖱️ **Convenient**: Single keyboard shortcut to capture
- 💪 **Lightweight**: Minimal system resource usage
- 🎨 **Customizable**: Adjustable overlay appearance
- 📜 **History**: Searchable translation history
- 🌐 **Multi-language**: English, Japanese, Korean, Chinese support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development
npm run dev
```

### Usage

1. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS)
2. Drag to select screen region
3. Translation appears in overlay!

## 🛠️ Development

### Project Structure

```
ScreenTranslationOverlay/
├── src/
│   ├── main/              # Electron main process
│   ├── renderer/          # Preload scripts
│   └── shared/            # Shared types & utilities
├── ui/                    # React app
├── resources/             # Icons, assets
└── docs/                  # Documentation
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Building
npm run build            # Build for production
npm run build:win        # Build Windows installer
npm run build:mac        # Build macOS installer
npm run build:linux      # Build Linux package

# Testing
npm test                 # Run tests
npm run test:e2e         # Run E2E tests

# Linting
npm run lint             # Lint code
npm run type-check       # Type check
```

## 📖 Documentation

- [User Guide (Thai)](docs/USER_GUIDE.md) - คู่มือการใช้งาน
- [Development Guide](docs/DEVELOPMENT.md) - คู่มือสำหรับนักพัฒนา
- [API Reference](docs/API.md) - เอกสาร API
- [Architecture](ARCHITECTURE.md) - สถาปัตยกรรมระบบ

## 🏗️ Technology Stack

- **Framework**: Electron + React + TypeScript
- **Build**: Vite + Electron Vite
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Database**: better-sqlite3
- **OCR**: Tesseract.js
- **Translation**: Google Translate API

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

## 🤝 Contributing

Contributions are welcome! Please see [DEVELOPMENT.md](docs/DEVELOPMENT.md) for guidelines.

## 📧 Contact

- GitHub Issues: [link]
- Email: [support@email]

---

Made with ❤️ for Thai users
