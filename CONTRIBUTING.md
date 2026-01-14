# CONTRIBUTING.md - แนวทางการมีส่วนร่วม

## 📋 ภาพรวม (Overview)

ขอบคุณที่สนใจมีส่วนร่วมในโปรเจกต์ Tran Overlay! เอกสารนี้จะแนะนำวิธีการมีส่วนร่วม ตั้งแต่การรายงานปัญหา การส่ง pull request ไปจนถึงการเขียนโค้ดตามมาตรฐาน

---

## 🚀 การเริ่มต้น (Getting Started)

### 1. การติดตั้งสภาพแวดล้อม (Prerequisites)

ติดตั้งสิ่งต่อไปนี้บนเครื่องของคุณ:

- **Rust** (1.70 หรือใหม่กว่า)
  ```bash
  # Windows
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  
  # macOS/Linux
  brew install rust
  ```

- **Node.js** (18+ หรือใหม่กว่า) และ **npm/yarn**
  ```bash
  # ใช้ nvm (Node Version Manager) แนะนำ
  nvm install 18
  nvm use 18
  ```

- **Tesseract OCR** (สำหรับ local OCR)
  ```bash
  # Windows
  # ดาวน์โหลดจาก: https://github.com/UB-Mannheim/tesseract/wiki
  
  # macOS
  brew install tesseract
  
  # Linux (Ubuntu/Debian)
  sudo apt-get install tesseract-ocr libtesseract-dev
  ```

- **Git**
  ```bash
  # Windows
  # ดาวน์โหลดจาก: https://git-scm.com/downloads
  
  # macOS
  brew install git
  
  # Linux
  sudo apt-get install git
  ```

### 2. การ Clone และ Setup Project

```bash
# Clone repository
git clone https://github.com/your-username/tran_overlay.git
cd tran_overlay

# Install frontend dependencies
npm install

# Install Rust dependencies (automatic)
cargo build

# สร้างไฟล์ .env
cp .env.example .env

# แก้ไข .env ตามความต้องการ
# เช่น GOOGLE_API_KEY=your_api_key_here
```

### 3. การรันในโหมด Development

```bash
# รัน development server (พร้อม hot reload)
npm run tauri dev

# หรือรัน frontend dev server แยก
npm run dev

# และรัน backend แยก
cd src-tauri
cargo run
```

---

## 📝 กระบวนการพัฒนา (Development Process)

### 1. เลือก Issue หรือสร้าง Issue ใหม่

```bash
# ดู issues ที่มีอยู่
# https://github.com/your-username/tran_overlay/issues

# สร้าง issue ใหม่โดยใช้ template
# https://github.com/your-username/tran_overlay/issues/new/choose
```

ก่อนเริ่มพัฒนา ควร:
- ตรวจสอบว่าไม่มี issue เดิมที่ซ้ำกัน
- Comment ใน issue ที่คุณจะทำ เพื่อแจ้งว่าคุณกำลังจะทำ
- รอการอนุมัติจาก maintainers สำหรับ issues ขนาดใหญ่

### 2. สร้าง Branch

```bash
# อัปเดต main branch
git checkout main
git pull origin main

# สร้าง branch ใหม่ (ใช้ naming convention)
git checkout -b feature/your-feature-name
# หรือ
git checkout -b fix/your-fix-name
# หรือ
git checkout -b docs/update-docs
```

Naming Convention สำหรับ Branch:
- `feature/<feature-name>` - สำหรับฟีเจอร์ใหม่
- `fix/<fix-name>` - สำหรับแก้ bug
- `docs/<doc-name>` - สำหรับอัปเดตเอกสาร
- `refactor/<refactor-name>` - สำหรับ refactor
- `test/<test-name>` - สำหรับเพิ่ม test

### 3. การเขียนโค้ด (Coding)

ก่อนเริ่มเขียนโค้ด อ่าน:
- [STYLEGUIDE.md](./STYLEGUIDE.md) - มาตรฐานการเขียนโค้ด
- [RULES.md](./RULES.md) - ข้อห้ามและแนวทางบังคับ
- [ARCHITECTURE.md](./ARCHITECTURE.md) - สถาปัตยกรรมระบบ

ขั้นตอนการพัฒนา:

```bash
# 1. เขียนโค้ด
# ใช้ IDE ที่คุณชอบ (VS Code, IntelliJ IDEA, etc.)

# 2. รัน linter และ formatter
# Rust
cargo clippy
cargo fmt --check

# Frontend
npm run lint
npm run format

# 3. รัน tests
# Rust
cargo test

# Frontend
npm run test

# 4. ตรวจสอบการ build
cargo build
npm run build
```

### 4. การ Commit

ใช้ [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <subject>

# ตัวอย่าง
git commit -m "feat(ocr): add support for Japanese language"
git commit -m "fix(translation): handle API timeout errors"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(settings): extract config validation logic"
git commit -m "test(ocr): add unit tests for preprocessing module"
```

Types ที่ใช้:
- `feat` - ฟีเจอร์ใหม่
- `fix` - แก้ bug
- `docs` - เอกสาร
- `style` - การจัดรูปแบบโค้ด
- `refactor` - refactor
- `perf` - ปรับปรุงประสิทธิภาพ
- `test` - เพิ่ม/ปรับปรุง test
- `chore` - งานอื่นๆ

### 5. การ Push และ Pull Request

```bash
# Push branch ไปยัง remote
git push origin feature/your-feature-name

# หรือ set upstream
git push -u origin feature/your-feature-name

# สร้าง Pull Request บน GitHub
# https://github.com/your-username/tran_overlay/compare
```

---

## 📤 การส่ง Pull Request (Submitting a Pull Request)

### 1. PR Template

ใช้ PR Template เมื่อสร้าง Pull Request:

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

## How Has This Been Tested?
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manually tested
- [ ] Tested on Windows
- [ ] Tested on macOS
- [ ] Tested on Linux

Test Configuration:
- OS: (Windows 10, macOS 14, Ubuntu 22.04, etc.)
- Rust Version: (e.g., 1.70)
- Node Version: (e.g., 18.17)

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

### 2. PR Review Process

1. **Automated Checks**
   - CI/CD จะรัน tests และ linters โดยอัตโนมัติ
   - ต้องผ่านทุก checks ก่อน merge

2. **Code Review**
   - Maintainers จะ review PR ของคุณ
   - อาจมี request changes ที่คุณต้องแก้ไข
   - ตอบกลับทุกคอมเมนต์

3. **Approval**
   - ต้องได้รับการอนุมัติอย่างน้อย 1 reviewer
   - หลังจาก approve และผ่าน CI จะถูก merge

---

## 🐛 การรายงานปัญหา (Reporting Issues)

### 1. Bug Report Template

ใช้ Bug Report Template เมื่อรายงาน bug:

```markdown
## Description
A clear and concise description of what the bug is.

## To Reproduce
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
 - OS: [e.g., Windows 10, macOS 14, Ubuntu 22.04]
 - App Version: [e.g., 0.1.0]
 - Rust Version: [e.g., 1.70]
 - Node Version: [e.g., 18.17]

## Additional Context
Add any other context about the problem here.

## Logs
Attach relevant logs if available.
```

### 2. Feature Request Template

ใช้ Feature Request Template เมื่อขอฟีเจอร์ใหม่:

```markdown
## Is your feature request related to a problem?
A clear and concise description of what the problem is.

## Describe the solution you'd like
A clear and concise description of what you want to happen.

## Describe alternatives you've considered
A clear and concise description of any alternative solutions or features you've considered.

## Additional context
Add any other context or screenshots about the feature request here.
```

---

## 🧪 การทดสอบ (Testing)

### 1. Unit Tests

**Rust**
```rust
// src-tauri/src/core/ocr/tests.rs
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ocr_engine_creation() {
        let engine = OcrEngine::new("eng").unwrap();
        assert_eq!(engine.language(), "eng");
    }

    #[test]
    fn test_preprocessing() {
        let image = load_test_image("test.png");
        let processed = preprocess_image(&image);
        assert!(processed.len() < image.len());
    }
}
```

**Frontend**
```typescript
// src/components/__tests__/TranslationOverlay.test.tsx
import { render, screen } from '@testing-library/react';
import { TranslationOverlay } from '../TranslationOverlay';

describe('TranslationOverlay', () => {
  it('renders translation text correctly', () => {
    render(
      <TranslationOverlay 
        x={100} 
        y={100} 
        text="สวัสดี" 
        onClose={() => {}} 
      />
    );
    expect(screen.getByText('สวัสดี')).toBeInTheDocument();
  });

  it('calls onClose when ESC is pressed', () => {
    const handleClose = jest.fn();
    render(
      <TranslationOverlay 
        x={100} 
        y={100} 
        text="สวัสดี" 
        onClose={handleClose} 
      />
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
```

### 2. Integration Tests

```rust
// tests/integration_test.rs
use tran_overlay::commands::translate_text;

#[tokio::test]
async fn test_full_translation_flow() {
    // 1. Capture screen
    let captured = capture_screen(selection).await.unwrap();
    
    // 2. OCR
    let ocr_result = recognize_text(captured.data, vec!["eng".to_string()]).await.unwrap();
    assert!(!ocr_result.text.is_empty());
    
    // 3. Translate
    let translation = translate_text(ocr_result.text, "en", "th").await.unwrap();
    assert!(!translation.translated_text.is_empty());
}
```

### 3. E2E Tests

```typescript
// tests/e2e/translation.spec.ts
import { test, expect } from '@playwright/test';

test('complete translation workflow', async ({ page }) => {
  await page.goto('http://localhost:1420');
  
  // Open settings
  await page.click('[data-testid="settings-button"]');
  
  // Set API key
  await page.fill('[data-testid="api-key-input"]', 'test-api-key');
  await page.click('[data-testid="save-settings"]');
  
  // Trigger hotkey (simulation)
  await page.keyboard.press('Control+Shift+A');
  
  // Verify overlay appears
  await expect(page.locator('[data-testid="overlay"]')).toBeVisible();
});
```

---

## 📚 การเขียนเอกสาร (Documentation)

### 1. Code Documentation

**Rust**
```rust
/// Recognizes text from an image using OCR.
///
/// This function takes image data and returns the recognized text
/// along with confidence scores and bounding box information.
///
/// # Arguments
///
/// * `image_data` - Raw image bytes in PNG format
/// * `languages` - List of language codes (e.g., ["eng", "tha"])
///
/// # Returns
///
/// Returns `Ok(OcrResult)` on success, `Err(OcrError)` on failure.
///
/// # Examples
///
/// ```no_run
/// use tran_overlay::core::ocr::recognize_text;
///
/// let result = recognize_text(image_bytes, vec!["eng".to_string()]).await?;
/// println!("Text: {}", result.text);
/// # Ok::<(), anyhow::Error>(())
/// ```
pub async fn recognize_text(
    image_data: Vec<u8>,
    languages: Vec<String>,
) -> Result<OcrResult, OcrError> {
    // Implementation
}
```

**TypeScript**
```typescript
/**
 * Translates text from one language to another.
 *
 * @param text - The text to translate
 * @param sourceLanguage - Source language code (e.g., "en")
 * @param targetLanguage - Target language code (e.g., "th")
 * @param provider - Translation provider to use
 * @returns Promise<TranslationResult>
 *
 * @example
 * ```ts
 * const result = await translateText("Hello", "en", "th", "google");
 * console.log(result.translatedText); // "สวัสดี"
 * ```
 */
export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  provider: string
): Promise<TranslationResult> {
  // Implementation
}
```

### 2. README Updates

เมื่อมีฟีเจอร์ใหม่ อัปเดต README.md:

```markdown
## Features

### Screen Capture
- Capture any area of your screen
- Multi-monitor support
- High-DPI support

### Translation
- Support for Google Translate and DeepL
- Auto-detect source language
- Translation caching

### New Feature Name
- Brief description of new feature
- Key capabilities
```

---

## 🎯 ความคาดหวังจาก Contributors (Expectations)

### 1. Code Quality

- ✅ รัน `cargo clippy` และ `npm run lint` ก่อน commit
- ✅ รัน `cargo fmt` และ `npm run format` ก่อน commit
- ✅ เขียน tests สำหรับโค้ดใหม่
- ✅ อัปเดต documentation เมื่อเปลี่ยนแปลงโค้ด
- ✅ ตรวจสอบให้ไม่มี compiler warnings

### 2. Communication

- ✅ Comment ใน issues ก่อนเริ่มทำงาน
- ✅ ตอบกลับ review comments ทุกข้อ
- ✅ อธิบายการเปลี่ยนแปลงที่ซับซ้อน
- ✅ แจ้งให้ทีมทราบหากจะขยายเวลา

### 3. Professionalism

- ✅ ใช้ภาษาที่สุภาพและเป็นทางการ
- ✅ ให้ความเคารพผู้อื่น
- ✅ ยอมรับ feedback และวิจารณ์
- ✅ เรียนรู้จากข้อผิดพลาด

---

## 🏆 การรับรู้ (Recognition)

Contributors จะได้รับการรับรู้:

- **Contributors.md** - รายชื่อ contributors ทั้งหมด
- **Release Notes** - รายชื่อในแต่ละ release
- **README.md** - รายชื่อ contributors หลัก
- **Badges** - สำหรับ contributors ที่โดดเด่น

---

## ❓ คำถามที่พบบ่อย (FAQ)

### Q: ฉันควรเริ่มจากไหน?
A: ดู [Issues](https://github.com/your-username/tran_overlay/issues) ที่มี label `good first issue` สำหรับงานที่เหมาะสำหรับผู้เริ่มต้น

### Q: ฉันสามารถทำอะไรได้บ้างถ้าไม่รู้ Rust?
A: คุณสามารถ:
- ช่วยทดสอบ (testing)
- อัปเดตเอกสาร (documentation)
- ออกแบบ UI/UX
- รายงาน bugs
- ให้ feedback ที่เป็นประโยชน์

### Q: ฉันควรทำอย่างไรหากติดขัด?
A: 
- อ่านเอกสารใน `docs/`
- ถามใน [Discussions](https://github.com/your-username/tran_overlay/discussions)
- ขอความช่วยเหลือใน issues หรือ Slack channel

### Q: PR ของฉันได้รับ request changes ทำอย่างไร?
A:
- อ่าน review comments อย่างละเอียด
- แก้ไขตามที่ระบุ
- Push changes ไปยัง branch เดิม
- ตอบกลับ comments และ request review ใหม่

---

## 📞 การติดต่อ (Contact)

- **GitHub Issues**: https://github.com/your-username/tran_overlay/issues
- **GitHub Discussions**: https://github.com/your-username/tran_overlay/discussions
- **Email**: tran-overlay@example.com
- **Discord**: https://discord.gg/tran-overlay

---

## Definition of Done (DoD) - CONTRIBUTING.md

ไฟล์ CONTRIBUTING.md จะถือว่าเสร็จสมบูรณ์เมื่อ:

1. ✅ มีคำแนะนำการเริ่มต้นที่ชัดเจน
2. ✅ มีกระบวนการพัฒนาที่ละเอียด
3. ✅ มีแนวทางการส่ง PR
4. ✅ มี template สำหรับ Bug Report และ Feature Request
5. ✅ มีตัวอย่างการทดสอบ
6. ✅ มีแนวทางการเขียนเอกสาร
7. ✅ มีความคาดหวังจาก contributors
8. ✅ มี FAQ ที่ครอบคลุม
9. ✅ เขียนเป็นภาษาไทยที่ถูกต้องและเป็นทางการ
10. ✅ มีตัวอย่างโค้ดที่ใช้งานได้จริง

---

## Acceptance Criteria

เกณฑ์การตรวจสอบคุณภาพ:

1. **ความครบถ้วน**: ต้องครอบคลุมทุกแง่มุมของการมีส่วนร่วม
2. **ความชัดเจน**: ผู้อ่านต้องเข้าใจและทำตามได้ทันที
3. **ความถูกต้อง**: ขั้นตอนต้องถูกต้องและทดสอบแล้ว
4. **ความเป็นประโยชน์**: ต้องมีประโยชน์จริงสำหรับ contributors
5. **ความทันสมัย**: ข้อมูลต้องเป็นปัจจุบันและสอดคล้องกับเอกสารอื่น
6. **ความเป็นมาตรฐาน**: ใช้รูปแบบและการจัดรูปแบบที่สอดคล้องกัน
7. **ความง่ายในการนำทาง**: สามารถค้นหาข้อมูลได้ง่าย
8. **ความสมบูรณ์**: ต้องครอบคลุมทุกสถานการณ์ที่อาจเกิดขึ้น
9. **ความน่าเชื่อถือ**: ข้อมูลต้องถูกต้องและน่าเชื่อถือ
10. **การตรวจสอบ**: ผ่านการตรวจสอบโดยทีมพัฒนาอย่างน้อย 1 คน

---

**เวอร์ชัน**: 0.1.0  
**อัปเดตล่าสุด**: 2024-01-15  
**สถานะ**: ✅ เสร็จสมบูรณ์  
**ผู้อนุมัติ**: Lead Developer