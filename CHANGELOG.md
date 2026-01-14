# CHANGELOG - บันทึกการเปลี่ยนแปลง

เอกสารนี้บันทึกการเปลี่ยนแปลงทั้งหมดที่เกิดขึ้นกับโปรเจกต์ Tran Overlay โดยจัดเรียงตามเวอร์ชันจากใหม่ไปเก่า

รูปแบบนี้อิงตาม [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
และโปรเจกต์นี้ยึดตาม [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [Unreleased] - เวอร์ชันที่กำลังพัฒนา

### เพิ่ม (Added)
- สร้างเอกสารโครงสร้างโปรเจกต์ (Phase 1 - Documentation)
- กำหนดสถาปัตยกรรมระบบ
- ระบุสเปคฟีเจอร์หลักทั้งหมด
- วางแผนการพัฒนา Phase 1-3

### เปลี่ยนแปลง (Changed)
- อัปเดต README พร้อมภาพรวมโปรเจกต์ครบถ้วน

---

## [0.1.0] - 2024-01-15 - Phase 1: เอกสารและการวางแผน

### เพิ่ม (Added)
- **เอกสารหลัก (Core Documentation)**
  - README.md - ภาพรวมโปรเจกต์และเป้าหมาย
  - RULES.md - ข้อห้ามและแนวทางบังคับ
  - STYLEGUIDE.md - รูปแบบการเขียนโค้ด/คอมมิต/รีลีสโน้ต
  - SPEC.md - สเปคของฟีเจอร์หลัก
  - ARCHITECTURE.md - สถาปัตยกรรมระบบและ data flow
  - ASSUMPTIONS.md - สมมติฐานและข้อจำกัด
  - CHANGELOG.md - บันทึกการเปลี่ยนแปลง

- **การวางแผนฟีเจอร์ (Feature Planning)**
  - ฟีเจอร์หลัก 6 อย่างสำหรับ Phase 1:
    1. Screen Capture & Selection
    2. OCR Engine
    3. Translation Service
    4. Overlay Display
    5. Global Hotkeys
    6. Settings Panel

- **การวางแผน Phase (Phase Planning)**
  - Phase 1 - Documentation Phase (เสร็จสมบูรณ์)
  - Phase 2 - Core Development (วางแผน)
  - Phase 3 - Enhanced Features (วางแผน)
  - Phase 4 - Advanced Features (วางแผน)

- **เทคโนโลยีและ Dependency (Technology Stack)**
  - Backend: Rust 1.70+ พร้อม Tauri 2.0
  - Frontend: React 18+ พร้อม TypeScript
  - UI Framework: Tailwind CSS + shadcn/ui
  - OCR: Tesseract / Google Cloud Vision API
  - Translation: Google Translate / DeepL API

### เปลี่ยนแปลง (Changed)
- ไม่มี (เริ่มโปรเจกต์)

### ลบออก (Removed)
- ไม่มี (เริ่มโปรเจกต์)

### แก้ไข (Fixed)
- ไม่มี (เริ่มโปรเจกต์)

### ความปลอดภัย (Security)
- ไม่มี (เริ่มโปรเจกต์)

---

## [0.0.0] - 2024-01-01 - เริ่มโปรเจกต์

### เพิ่ม (Added)
- สร้างโปรเจกต์ Tran Overlay
- กำหนดวัตถุประสงค์หลัก: แอปแปลภาษาหน้าจอแบบ real-time

---

## เวอร์ชันที่จะเกิดขึ้น (Future Versions)

### [0.2.0] - Phase 2: Core Development (วางแผน)

#### เพิ่ม (Added)
- **Core Modules (โมดูลหลัก)**
  - Screen capture module
  - OCR engine integration
  - Translation service integration
  - Overlay window management
  - Global hotkey system
  - Settings management

- **Tauri Commands (คำสั่ง Tauri)**
  - capture_screen
  - recognize_text
  - translate_text
  - show_overlay
  - register_hotkey
  - save_settings
  - load_settings

- **Frontend Components (คอมโพเนนต์ Frontend)**
  - TranslationOverlay
  - SettingsPanel
  - HistoryList
  - Base UI components (Button, Input, Modal, etc.)

- **State Management (การจัดการสถานะ)**
  - Redux store configuration
  - Translation state slice
  - Settings state slice
  - History state slice

- **Services (บริการ)**
  - Tauri IPC wrapper
  - Translation API service
  - OCR service
  - Settings service

#### เปลี่ยนแปลง (Changed)
- อัปเดต Dependencies ตามที่วางแผน

---

### [0.3.0] - Phase 2: Testing & Bug Fixes (วางแผน)

#### เพิ่ม (Added)
- **Unit Tests (ทดสอบหน่วย)**
  - OCR engine tests
  - Translation service tests
  - Capture module tests
  - Settings management tests
  - Utility function tests

- **Integration Tests (ทดสอบการผนวก)**
  - Tauri command tests
  - API integration tests
  - Database tests

- **E2E Tests (ทดสอบ End-to-End)**
  - Translation flow tests
  - Settings flow tests
  - Hotkey flow tests

#### แก้ไข (Fixed)
- แก้ไข bugs ที่พบใน Phase 2.1
- ปรับปรุง performance
- แก้ไข memory leaks

---

### [0.4.0] - Phase 3: Enhanced Features (วางแผน)

#### เพิ่ม (Added)
- **History Log (บันทึกประวัติ)**
  - บันทึกการแปลทั้งหมด
  - ค้นหาและกรองประวัติ
  - ส่งออกประวัติเป็น CSV/JSON

- **Multiple Translation Providers (ผู้ให้บริการหลายราย)**
  - เลือกใช้ Google Translate, DeepL, หรือ local model
  - เปรียบเทียบผลการแปลจากหลาย provider

- **Custom Hotkeys (คีย์ลัดกำหนดเอง)**
  - ผู้ใช้กำหนดคีย์ลัดเองได้
  - ตรวจจับและแจ้งเตือน hotkey conflicts

- **Overlay Customization (ปรับแต่ง Overlay)**
  - เปลี่ยนสี, ขนาด, ฟอนต์
  - ปรับความโปร่งใส
  - กำหนดตำแหน่ง default

- **Auto-detect Language (ตรวจจับภาษาอัตโนมัติ)**
  - ตรวจจับภาษาของข้อความโดยอัตโนมัติ
  - แสดงภาษาที่ตรวจจับได้

- **Window Snapping (จัดตำแหน่งอัตโนมัติ)**
  - จัดตำแหน่ง overlay ให้อยู่ใกล้บริเวณที่แคป
  - จัดตำแหน่งให้อยู่ภายในหน้าจอ

#### เปลี่ยนแปลง (Changed)
- ปรับปรุง UI ให้ทันสมัยขึ้น
- เพิ่ม theme สี (light/dark mode)
- ปรับปรุง UX flow

---

### [0.5.0] - Phase 4: Advanced Features (วางแผน)

#### เพิ่ม (Added)
- **Batch Translation (แปลหลายบริเวณ)**
  - แปลหลายบริเวณพร้อมกัน
  - จัดการ multiple overlays

- **Translation Comparison (เปรียบเทียบการแปล)**
  - เปรียบเทียบผลการแปลจากหลาย provider
  - แสดงความแม่นยำของแต่ละ provider

- **Voice Output (เสียงอ่าน)**
  - อ่านข้อความที่แปลแล้วออกเสียง
  - รองรับหลายภาษา

- **Image Pre-processing (ปรับปรุงภาพ)**
  - ปรับปรุงคุณภาพภาพก่อน OCR
  - เพิ่มความแม่นยำสำหรับภาพที่ไม่ชัด
  - รองรับ image filters

- **Local Translation Mode (โหมดแปล offline)**
  - ใช้ AI model ในเครื่องสำหรับการแปล offline
  - ดาวน์โหลดและจัดการ language models

- **Cloud Sync (ซิงค์ผ่าน Cloud)**
  - ซิงค์การตั้งค่าผ่าน cloud
  - ซิงค์ประวัติการแปล
  - รองรับหลายอุปกรณ์

- **Advanced OCR (OCR ขั้นสูง)**
  - รองรับ handwritten text
  - รองรับ text orientation
  - เพิ่ม accuracy สำหรับภาษาไทย

#### เปลี่ยนแปลง (Changed)
- ปรับปรุง performance ทั้งระบบ
- เพิ่มความเสถียรของแอป
- ปรับปรุง error handling

---

### [1.0.0] - Stable Release (วางแผน)

#### เพิ่ม (Added)
- Production-ready release
- ครบทุกฟีเจอร์ที่วางแผน
- Documentation ครบถ้วน
- Testing coverage 80%+
- Performance ตรงตามเกณฑ์

#### เปลี่ยนแปลง (Changed)
- Stabilized APIs
- ปรับปรุง UX ตาม feedback จากผู้ใช้
- Optimize ทั้งระบบ

#### แก้ไข (Fixed)
- แก้ไข bugs ทั้งหมดจาก beta versions
- แก้ไข security issues

---

## ประเภทการเปลี่ยนแปลง (Change Types)

- **เพิ่ม (Added)**: ฟีเจอร์ใหม่
- **เปลี่ยนแปลง (Changed)**: เปลี่ยนแปลงฟีเจอร์ที่มีอยู่
- **ลบออก (Removed)**: ลบฟีเจอร์ที่มีอยู่
- **เลิกใช้ (Deprecated)**: ฟีเจอร์ที่จะถูกลบในอนาคต
- **แก้ไข (Fixed)**: แก้ไข bugs
- **ความปลอดภัย (Security)**: แก้ไขช่องโหว่ด้านความปลอดภัย

---

## Semantic Versioning (Semantic Versioning)

โปรเจกต์นี้ยึดตาม [Semantic Versioning](https://semver.org/spec/v2.0.0.html):

- **MAJOR (X.0.0)**: เมื่อมีการเปลี่ยนแปลงที่ไม่เข้ากันได้ (incompatible API changes)
- **MINOR (0.X.0)**: เมื่อมีฟีเจอร์ใหม่ แต่ยังเข้ากันได้ (backwards-compatible functionality)
- **PATCH (0.0.X)**: เมื่อมีการแก้ไข bugs แต่ยังเข้ากันได้ (backwards-compatible bug fixes)

ตัวอย่าง:
- `1.0.0` → `2.0.0`: Breaking changes
- `1.0.0` → `1.1.0`: New features
- `1.0.0` → `1.0.1`: Bug fixes

---

## Definition of Done (DoD) - CHANGELOG.md

ไฟล์ CHANGELOG.md จะถือว่าเสร็จสมบูรณ์เมื่อ:

1. ✅ มีบันทึกการเปลี่ยนแปลงทุกเวอร์ชัน
2. ✅ แต่ละเวอร์ชันมีวันที่ที่ชัดเจน
3. ✅ แบ่งประเภทการเปลี่ยนแปลง (Added, Changed, Fixed, etc.)
4. ✅ รายละเอียดการเปลี่ยนแปลงชัดเจนและเข้าใจง่าย
5. ✅ เรียงตามลำดับเวอร์ชันจากใหม่ไปเก่า
6. ✅ มีเวอร์ชัน unreleased สำหรับการพัฒนา
7. ✅ มีคำอธิบายเกี่ยวกับ Semantic Versioning
8. ✅ เขียนเป็นภาษาไทยที่ถูกต้องและเป็นทางการ
9. ✅ อัปเดตทุกครั้งที่มี release
10. ✅ ไม่มีการเปลี่ยนแปลงที่ไม่ได้บันทึก

---

## Acceptance Criteria

เกณฑ์การตรวจสอบคุณภาพ:

1. **ความครบถ้วน**: บันทึกต้องครอบคลุมทุกการเปลี่ยนแปลงที่สำคัญ
2. **ความชัดเจน**: ผู้อ่านต้องเข้าใจสิ่งที่เปลี่ยนแปลงได้ทันที
3. **ความถูกต้อง**: ต้องตรงตามเวอร์ชันและการเปลี่ยนแปลงจริง
4. **ความทันสมัย**: ต้องอัปเดตทุกครั้งที่มี release
5. **ความเป็นมาตรฐาน**: ใช้รูปแบบและการจัดรูปแบบที่สอดคล้องกัน
6. **ความสอดคล้อง**: ต้องสอดคล้องกับ Semantic Versioning
7. **ความเป็นประโยชน์**: ต้องมีประโยชน์สำหรับผู้ใช้และนักพัฒนา
8. **ความน่าเชื่อถือ**: ข้อมูลต้องถูกต้องและเป็นจริง
9. **ความง่ายในการค้นหา**: สามารถค้นหาการเปลี่ยนแปลงได้ง่าย
10. **การตรวจสอบ**: ผ่านการตรวจสอบโดยทีมพัฒนาอย่างน้อย 1 คนก่อน release

---

**เวอร์ชัน**: 0.1.0  
**อัปเดตล่าสุด**: 2024-01-15  
**สถานะ**: ✅ เสร็จสมบูรณ์  
**ผู้อนุมัติ**: Lead Developer