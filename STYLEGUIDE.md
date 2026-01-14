# STYLEGUIDE.md - แนวทางการเขียนโค้ดและรูปแบบเอกสาร

## 📋 ภาพรวม (Overview)

เอกสารนี้ระบุแนวทางการเขียนโค้ด การจัดรูปแบบ และโครงสร้างเอกสารที่ทีมพัฒนาต้องปฏิบัติตาม เพื่อให้โค้ดมีความสอดคล้อง อ่านง่าย และบำรุงรักษาได้

---

## 💻 มาตรฐานการเขียนโค้ด Rust (Rust Coding Standards)

### 1. การจัดรูปแบบ (Formatting)

#### 1.1 ใช้ rustfmt อัตโนมัติ
```toml
# rustfmt.toml
max_width = 100
hard_tabs = false
tab_spaces = 4
newline_style = "Unix"
use_small_heuristics = "Default"
reorder_imports = true
reorder_modules = true
```

#### 1.2 โครงสร้างไฟล์ (File Structure)
```rust
// 1. Module documentation
//! This module handles OCR operations

// 2. Imports (grouped alphabetically)
use std::path::Path;
use anyhow::{Context, Result};
use tesseract::Tesseract;

// 3. Constants
const MAX_IMAGE_SIZE: usize = 10 * 1024 * 1024; // 10MB

// 4. Type definitions
pub struct OcrEngine {
    client: Tesseract,
    language: String,
}

// 5. Implementations
impl OcrEngine {
    // Public methods first
    pub fn new(language: &str) -> Result<Self> {
        // ...
    }
    
    // Private methods
    fn validate_image(&self, path: &Path) -> Result<()> {
        // ...
    }
}

// 6. Tests
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_ocr_engine_creation() {
        // ...
    }
}
```

#### 1.3 การตั้งชื่อ (Naming Conventions)

**Type names (structs, enums, traits):** PascalCase
```rust
struct TranslationResult;
enum Language;
trait Translator;
```

**Function and method names:** snake_case
```rust
fn translate_text(text: &str) -> Result<String>;
fn get_translation_history() -> Vec<TranslationRecord>;
```

**Variable names:** snake_case
```rust
let translation_result = translate_text("hello");
let user_settings = Settings::load()?;
```

**Constants:** SCREAMING_SNAKE_CASE
```rust
const DEFAULT_LANGUAGE: &str = "th";
const MAX_RETRY_COUNT: u32 = 3;
const API_TIMEOUT_MS: u64 = 5000;
```

**Lifetime parameters:** Short and descriptive
```rust
fn process<'a>(input: &'a str) -> &'a str;
```

**Type parameters:** PascalCase, descriptive
```rust
struct Container<T: Display> {
    value: T,
}
```

### 2. เอกสารประกอบโค้ด (Code Documentation)

#### 2.1 Module Documentation
```rust
//! # OCR Module
//!
//! This module provides optical character recognition (OCR) functionality
//! for extracting text from images using the Tesseract engine.
//!
//! ## Example
//!
//! ```no_run
//! use tran_overlay::core::ocr::OcrEngine;
//!
//! let engine = OcrEngine::new("eng+tha")?;
//! let text = engine.recognize("image.png")?;
//! println!("Recognized text: {}", text);
//! ```
//!
//! ## Features
//!
//! - Multi-language support
//! - Image preprocessing
//! - Confidence scoring
```

#### 2.2 Function Documentation
```rust
/// Recognizes text from an image file.
///
/// This function loads an image from the specified path, preprocesses it,
/// and uses the configured Tesseract engine to extract text.
///
/// # Arguments
///
/// * `image_path` - Path to the image file to process
///
/// # Returns
///
/// Returns a `Result` containing:
/// - `Ok(String)`: The recognized text
/// - `Err(anyhow::Error)`: If OCR fails
///
/// # Errors
///
/// This function will return an error if:
/// - The image file cannot be read
/// - The image format is not supported
/// - OCR processing fails
///
/// # Example
///
/// ```no_run
/// # use tran_overlay::core::ocr::OcrEngine;
/// # fn main() -> anyhow::Result<()> {
/// let engine = OcrEngine::new("eng")?;
/// let text = engine.recognize("screenshot.png")?;
/// # Ok(())
/// # }
/// ```
///
/// # Performance
///
/// Processing time typically ranges from 1-3 seconds for standard images.
///
/// # See Also
///
/// - [`recognize_from_bytes`]: For processing in-memory image data
pub fn recognize(&self, image_path: &Path) -> Result<String> {
    // Implementation
}
```

#### 2.3 Struct Documentation
```rust
/// Configuration for the translation service.
///
/// This struct holds all settings needed to connect to and interact
/// with translation APIs.
///
/// # Fields
///
/// * `api_key` - The API key for authentication (required)
/// * `provider` - The translation provider to use
/// * `timeout_ms` - Request timeout in milliseconds (default: 5000)
/// * `max_retries` - Maximum number of retry attempts (default: 3)
///
/// # Example
///
/// ```
/// use tran_overlay::core::translate::TranslationConfig;
///
/// let config = TranslationConfig::builder()
///     .api_key("your-api-key")
///     .provider(Provider::Google)
///     .build();
/// ```
#[derive(Debug, Clone)]
pub struct TranslationConfig {
    /// API key for authentication with the translation service
    pub api_key: String,
    
    /// The translation provider to use
    pub provider: Provider,
    
    /// Request timeout in milliseconds
    pub timeout_ms: u64,
    
    /// Maximum number of retry attempts on failure
    pub max_retries: u32,
}
```

### 3. Error Handling

#### 3.1 ใช้ anyhow สำหรับ Error Handling
```rust
use anyhow::{Context, Result};

fn process_image(path: &Path) -> Result<String> {
    // Use context() to add error information
    let image = image::open(path)
        .context(format!("Failed to open image at {}", path.display()))?;
    
    // Use with_context() for lazy evaluation
    let buffer = image.to_rgb8()
        .with_context(|| "Failed to convert image to RGB")?;
    
    Ok("processed".to_string())
}
```

#### 3.2 กำหนด Error Types เฉพาะทาง
```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum OcrError {
    #[error("Image file not found: {0}")]
    ImageNotFound(String),
    
    #[error("Unsupported image format: {0}")]
    UnsupportedFormat(String),
    
    #[error("OCR processing failed: {0}")]
    ProcessingError(String),
    
    #[error("Tesseract error: {0}")]
    TesseractError(#[from] tesseract::TesseractError),
    
    #[error("API error: status {status}, message: {message}")]
    ApiError {
        status: u16,
        message: String,
    },
}
```

### 4. Testing Standards

#### 4.1 Unit Test
```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_valid_api_key_format() {
        let key = "sk-1234567890abcdef";
        assert!(validate_api_key(key).is_ok());
    }
    
    #[test]
    fn test_invalid_api_key_format() {
        let key = "invalid-key";
        assert!(validate_api_key(key).is_err());
    }
    
    #[test]
    fn test_translation_with_empty_text() {
        let result = translate_text("", "en", "th");
        assert!(matches!(result, Err(OcrError::EmptyInput)));
    }
}
```

#### 4.2 Integration Test
```rust
// tests/integration_test.rs
use tran_overlay::core::translate::TranslationService;

#[tokio::test]
async fn test_full_translation_flow() {
    let service = TranslationService::new(
        std::env::var("TEST_API_KEY").unwrap()
    ).await.unwrap();
    
    let result = service.translate("Hello, world!", "en", "th").await.unwrap();
    
    assert!(!result.is_empty());
    assert_ne!(result, "Hello, world!");
}
```

---

## 📝 มาตรฐานการเขียนโค้ด Frontend (Frontend Coding Standards)

### 1. React/TypeScript

#### 1.1 Component Structure
```tsx
// 1. Imports
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

// 2. Types
interface TranslationOverlayProps {
  x: number;
  y: number;
  text: string;
  onClose: () => void;
}

// 3. Component
export const TranslationOverlay: React.FC<TranslationOverlayProps> = ({
  x,
  y,
  text,
  onClose
}) => {
  // 4. Hooks
  const [isVisible, setIsVisible] = useState(true);
  const { translate } = useTranslation();

  // 5. Effects
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onClose]);

  // 6. Handlers
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  // 7. Render
  if (!isVisible) return null;

  return (
    <div className="overlay-container" style={{ left: x, top: y }}>
      <p className="overlay-text">{text}</p>
      <div className="overlay-actions">
        <Button onClick={handleCopy}>Copy</Button>
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>
    </div>
  );
};
```

#### 1.2 การตั้งชื่อ (Naming Conventions)

**Components:** PascalCase
```tsx
export const TranslationOverlay: React.FC = () => {};
export const SettingsPanel: React.FC = () => {};
```

**Functions/Hooks:** camelCase
```tsx
const handleTranslate = () => {};
const useTranslation = () => {};
```

**Constants:** UPPER_SNAKE_CASE
```tsx
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_LANGUAGE = 'en';
```

**Types/Interfaces:** PascalCase
```tsx
interface TranslationResult {}
type Language = 'en' | 'th' | 'ja';
```

### 2. การจัดรูปแบบ (Formatting)

#### 2.1 ใช้ ESLint + Prettier
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

#### 2.2 Props Interface
```tsx
interface ComponentProps {
  /** Required props first */
  id: string;
  data: DataType;
  
  /** Optional props */
  isLoading?: boolean;
  className?: string;
  
  /** Callbacks */
  onSuccess?: (result: ResultType) => void;
  onError?: (error: Error) => void;
}
```

### 3. Documentation

#### 3.1 Component Documentation
```tsx
/**
 * Translation Overlay Component
 * 
 * Displays translated text overlay on the screen at specified coordinates.
 * 
 * @component
 * @example
 * ```tsx
 * <TranslationOverlay
 *   x={100}
 *   y={200}
 *   text="สวัสดี"
 *   onClose={() => console.log('closed')}
 * />
 * ```
 * 
 * @param {number} x - X coordinate for overlay position
 * @param {number} y - Y coordinate for overlay position
 * @param {string} text - Translated text to display
 * @param {() => void} onClose - Callback when overlay is closed
 */
export const TranslationOverlay: React.FC<TranslationOverlayProps> = ({
  x,
  y,
  text,
  onClose
}) => {
  // ...
};
```

---

## 🎯 มาตรฐานข้อความคอมมิต (Commit Message Standards)

### 1. รูปแบบ Conventional Commits

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 2. Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, semi-colons, etc.) |
| `refactor` | Code refactoring without changing functionality |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks, dependency updates |
| `build` | Build system or external dependencies changes |
| `ci` | CI configuration changes |

### 3. ตัวอย่างคอมมิต

#### 3.1 คอมมิตฟีเจอร์ใหม่
```
feat(ocr): add Tesseract integration for text recognition

- Implement OcrEngine struct with Tesseract backend
- Add support for multi-language recognition
- Include image preprocessing for better accuracy

Closes #12
```

#### 3.2 คอมมิตแก้บัก
```
fix(translation): handle API rate limiting errors

Add retry logic with exponential backoff when encountering
429 Too Many Requests errors from the translation API.

Fixes #45
```

#### 3.3 คอมมิตเอกสาร
```
docs(readme): update installation instructions

Clarify Tesseract installation requirements for Windows.
Add troubleshooting section for common issues.
```

#### 3.4 คอมมิต refactor
```
refactor(settings): extract config loading logic

Move configuration loading logic into separate module
to improve testability and reduce coupling.

Breaking Changes:
- Settings::load() now returns Result<Settings, ConfigError>
```

### 4. กฎการเขียน Commit Message

1. **Subject line**
   - ใช้ imperative mood (ให้ ไม่ใช่ "ให้แล้ว")
   - ไม่ขึ้นต้นด้วยตัวพิมพ์ใหญ่ (ยกเว้น acronym)
   - ไม่ลงท้ายด้วยจุด
   - ขนาดไม่เกิน 50 ตัวอักษร

2. **Body**
   - ใช้คำกริยา imperative
   - อธิบาย "ทำไม" และ "อะไร" ไม่ใช่ "อย่างไร"
   - แต่ละบรรทัดไม่เกิน 72 ตัวอักษร

3. **Footer**
   - ระบุ issue ที่เกี่ยวข้อง (เช่น `Closes #123`)
   - ระบุ breaking changes ถ้ามี

---

## 📋 มาตรฐาน Release Notes (Release Notes Standards)

### 1. โครงสร้าง Release Notes

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New feature 1
- New feature 2

### Changed
- Changed behavior 1
- Updated dependency 1 from v1.0 to v2.0

### Deprecated
- Feature 1 will be removed in version Y.Z.0

### Removed
- Old feature 1

### Fixed
- Fixed bug 1
- Fixed bug 2

### Security
- Fixed security vulnerability 1
```

### 2. ตัวอย่าง Release Notes

```markdown
## [0.2.0] - 2024-01-15

### Added
- Support for DeepL translation API
- Custom hotkey configuration
- Translation history with search functionality
- Auto-detect source language feature
- Dark mode support

### Changed
- Improved OCR accuracy by 15% for Thai text
- Reduced translation latency by 30%
- Updated Tesseract to version 5.3.0
- Redesigned settings panel for better UX

### Fixed
- Fixed memory leak when overlay stays open for long periods
- Fixed crash on Windows when capturing certain window types
- Fixed incorrect text encoding for Japanese characters
- Fixed hotkey conflicts with other applications

### Performance
- Optimized image processing pipeline
- Reduced memory usage by 40%
- Improved startup time by 50%

### Breaking Changes
- API key configuration format has changed (see migration guide)
- Minimum supported Rust version is now 1.70

### Migration Notes
Users upgrading from 0.1.x need to:
1. Update API key format in settings
2. Reconfigure custom hotkeys
3. Clear translation history (optional)
```

---

## 🗂️ โครงสร้างข้อความในรีโป (Repository Structure Guidelines)

### 1. โครงสร้างไดเรกทอรี

```
tran_overlay/
├── src-tauri/                 # Rust backend
│   ├── src/
│   │   ├── main.rs           # Entry point
│   │   ├── commands/         # Tauri commands
│   │   │   ├── mod.rs
│   │   │   ├── translation.rs
│   │   │   ├── ocr.rs
│   │   │   └── settings.rs
│   │   ├── core/             # Core logic
│   │   │   ├── mod.rs
│   │   │   ├── ocr/
│   │   │   │   ├── mod.rs
│   │   │   │   ├── engine.rs
│   │   │   │   └── tesseract.rs
│   │   │   ├── translate/
│   │   │   │   ├── mod.rs
│   │   │   │   ├── service.rs
│   │   │   │   └── providers/
│   │   │   └── capture/
│   │   │       ├── mod.rs
│   │   │       └── screen.rs
│   │   ├── overlay/          # Overlay management
│   │   │   ├── mod.rs
│   │   │   ├── window.rs
│   │   │   └── renderer.rs
│   │   ├── hotkeys/          # Hotkey handling
│   │   │   ├── mod.rs
│   │   │   └── manager.rs
│   │   ├── settings/         # Settings persistence
│   │   │   ├── mod.rs
│   │   │   ├── config.rs
│   │   │   └── storage.rs
│   │   ├── utils/            # Utility functions
│   │   │   ├── mod.rs
│   │   │   ├── image.rs
│   │   │   └── validation.rs
│   │   └── types.rs          # Shared types
│   ├── tests/               # Integration tests
│   │   ├── integration_test.rs
│   │   └── fixtures/
│   ├── Cargo.toml
│   └── tauri.conf.json
├── src/                       # React frontend
│   ├── components/           # Reusable components
│   │   ├── ui/              # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── modal.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── header.tsx
│   │   │   └── sidebar.tsx
│   │   ├── TranslationOverlay.tsx
│   │   ├── SettingsPanel.tsx
│   │   └── HistoryList.tsx
│   ├── pages/               # Page components
│   │   ├── settings/
│   │   │   ├── index.tsx
│   │   │   ├── general.tsx
│   │   │   └── hotkeys.tsx
│   │   ├── history/
│   │   │   └── index.tsx
│   │   └── home.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useTranslation.ts
│   │   ├── useHotkeys.ts
│   │   └── useSettings.ts
│   ├── services/            # API services
│   │   ├── translation.ts
│   │   ├── ocr.ts
│   │   └── settings.ts
│   ├── store/               # State management
│   │   ├── index.ts
│   │   ├── translation.ts
│   │   └── settings.ts
│   ├── types/               # TypeScript types
│   │   ├── index.ts
│   │   ├── translation.ts
│   │   └── settings.ts
│   ├── utils/               # Utility functions
│   │   ├── format.ts
│   │   └── validation.ts
│   ├── styles/              # Global styles
│   │   ├── globals.css
│   │   └── themes.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── docs/                     # Documentation
│   ├── README.md
│   ├── RULES.md
│   ├── STYLEGUIDE.md
│   ├── SPEC.md
│   ├── ARCHITECTURE.md
│   ├── ASSUMPTIONS.md
│   ├── CHANGELOG.md
│   ├── api/                 # API documentation
│   │   ├── commands.md
│   │   └── events.md
│   └── guides/              # User guides
│       ├── installation.md
│       ├── usage.md
│       └── troubleshooting.md
├── scripts/                  # Build/utility scripts
│   ├── build.sh
│   ├── release.sh
│   └── setup-dev.sh
├── .github/                  # GitHub configuration
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── release.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
├── tests/                    # E2E tests
│   ├── e2e/
│   │   ├── translation.spec.ts
│   │   └── settings.spec.ts
│   └── fixtures/
├── .gitignore
├── .env.example
├── CHANGELOG.md
├── LICENSE
├── package.json
├── README.md
└── tsconfig.json
```

### 2. กฎการจัดไฟล์

1. **ไฟล์ต้องมีความหมาย**: ชื่อไฟล์ต้องบอกได้ว่ามีเนื้อหาอะไร
2. **หนึ่ง module ต่อหนึ่งไฟล์**: ยกเว้น simple types หรือ constants
3. **ใช้ snake_case สำหรับ Rust ไฟล์**
4. **ใช้ PascalCase สำหรับ React components**
5. **ใช้ camelCase สำหรับ utility และ services**
6. **index files**: ใช้สำหรับ re-export จาก module

---

## 📊 มาตรฐานการเขียน PR Description

### 1. รูปแบบ PR Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Related Issue
Closes #(issue number)
Related to #(issue number)

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manually tested
- [ ] Tested on Windows
- [ ] Tested on macOS
- [ ] Tested on Linux

## Screenshots (if applicable)
Include screenshots or GIFs showing the changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules
```

### 2. ตัวอย่าง PR Description

```markdown
## Description
Add support for custom hotkey configuration, allowing users to define their own keyboard shortcuts for triggering screenshot capture and closing overlays.

## Type of Change
- [x] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issue
Closes #34
Related to #12

## Changes Made
- Added `hotkey-config` command to Tauri for saving/loading custom hotkeys
- Created `HotkeyManager` struct to handle global hotkey registration
- Added UI in Settings panel for hotkey configuration
- Updated hotkey validation to prevent conflicts
- Added hotkey conflict detection

## Testing
- [x] Unit tests added/updated (HotkeyManager tests)
- [x] Integration tests added/updated (hotkey-config command tests)
- [x] Manually tested
- [x] Tested on Windows
- [ ] Tested on macOS
- [ ] Tested on Linux

## Screenshots
Before:
[Old settings panel screenshot]

After:
[New hotkey configuration UI screenshot]

## Checklist
- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my own code
- [x] I have commented my code, particularly in hard-to-understand areas
- [x] I have made corresponding changes to the documentation (README.md, SETTINGS.md)
- [x] My changes generate no new warnings
- [x] I have added tests that prove my fix is effective or that my feature works
- [x] New and existing unit tests pass locally with my changes
- [x] Any dependent changes have been merged and published in downstream modules
```

---

## Definition of Done (DoD) - STYLEGUIDE.md

ไฟล์ STYLEGUIDE.md จะถือว่าเสร็จสมบูรณ์เมื่อ:

1. ✅ มีมาตรฐานการเขียนโค้ดที่ครอบคลุมทั้ง Rust และ Frontend
2. ✅ มีตัวอย่างโค้ดที่เข้าใจง่ายประกอบทุกหัวข้อ
3. ✅ มีแนวทางการเขียน commit message ที่ชัดเจน
4. ✅ มีรูปแบบ release notes ที่ครบถ้วน
5. ✅ มีโครงสร้างข้อความใน repo ที่ชัดเจน
6. ✅ มี template สำหรับ PR description
7. ✅ เขียนเป็นภาษาไทยที่ถูกต้องและเป็นทางการ
8. ✅ มีตัวอย่างที่ใช้งานได้จริงในทุกหัวข้อ
9. ✅ ไม่มีข้อขัดแย้งในแนวทาง
10. ✅ ผ่านการตรวจสอบโดยทีมพัฒนา

---

## Acceptance Criteria

เกณฑ์การตรวจสอบคุณภาพ:

1. **ความครบถ้วน**: มาตรฐานต้องครอบคลุมทุกแง่มุมของการพัฒนา
2. **ความชัดเจน**: ผู้พัฒนาต้องเข้าใจและทำตามได้ทันที
3. **ความสอดคล้อง**: มาตรฐานต้องสอดคล้องกันทั้งหมด
4. **ความทันสมัย**: ต้องใช้ best practices ปัจจุบัน
5. **ความเป็นตัวอย่างที่ดี**: ตัวอย่างโค้ดต้องถูกต้องและเป็นไปตามมาตรฐาน
6. **ความยืดหยุ่น**: มาตรฐานต้องไม่เข้มงวดเกินไปจนยากต่อการทำตาม
7. **ความเป็นมาตรฐาน**: ใช้รูปแบบและการจัดรูปแบบที่สอดคล้องกัน
8. **ความน่าเชื่อถือ**: มาตรฐานทุกข้อต้องมีเหตุผลประกอบ
9. **ความง่ายในการอ้างอิง**: สามารถค้นหาและอ้างอิงได้ง่าย
10. **การตรวจสอบ**: ผ่านการตรวจสอบโดยทีมพัฒนาอย่างน้อย 2 คน

---

**เวอร์ชัน**: 0.1.0  
**อัปเดตล่าสุด**: 2024  
**สถานะ**: ✅ เสร็จสมบูรณ์  
**ผู้อนุมัติ**: Lead Developer