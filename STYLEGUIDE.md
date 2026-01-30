# Screen Translation Overlay - UI/UX Style Guide

## Version
- **Version**: 0.1.0
- **Last Updated**: 2025-01-31
- **Status**: Draft

---

## Table of Contents
1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Icons & Graphics](#icons--graphics)
7. [Animations](#animations)
8. [Accessibility](#accessibility)
9. [Screen-Specific Guidelines](#screen-specific-guidelines)

---

## Design Principles

### 1. Minimalism
- **Less is more**: Remove unnecessary elements
- Focus on content, not chrome
- Clean, uncluttered interfaces

### 2. Speed
- **Fast interactions**: Responsive UI (<100ms)
- Instant feedback for user actions
- Progressive loading for heavy operations

### 3. Transparency
- **Visual transparency**: Overlay windows use opacity
- **Functional transparency**: Clear indication of what's happening
- Progress indicators for long operations

### 4. Thai Language First
- **Primary language**: All UI in Thai
- **Secondary**: English labels for technical settings
- **Font support**: Proper Thai typography

### 5. Keyboard-First
- **Power user focus**: Keyboard shortcuts for all actions
- **Minimal mouse usage**: Efficient navigation
- **Visible shortcuts**: Show shortcuts in UI

---

## Color System

### Primary Colors
Based on Tailwind CSS palette (blue):

| Color | Hex | Usage |
|-------|-----|-------|
| Primary 50 | `#f0f9ff` | Background highlights |
| Primary 500 | `#0ea5e9` | Primary buttons, links |
| Primary 600 | `#0284c7` | Primary buttons (hover) |
| Primary 700 | `#0369a1` | Primary buttons (active) |

### Semantic Colors

| Role | Hex | Tailwind | Usage |
|------|-----|---------|-------|
| Success | `#10b981` | `green-500` | Success messages |
| Warning | `#f59e0b` | `amber-500` | Warnings |
| Error | `#ef4444` | `red-500` | Errors, destructive actions |
| Info | `#3b82f6` | `blue-500` | Information |

### Neutral Colors (Dark Mode)

| Shade | Hex | Usage |
|-------|-----|-------|
| Dark 50 | `#f8fafc` | Text (primary) |
| Dark 100 | `#f1f5f9` | Text (secondary) |
| Dark 200 | `#e2e8f0` | Borders |
| Dark 800 | `#1e293b` | Background (dark mode) |
| Dark 900 | `#0f172a` | Background (elevated) |

### Neutral Colors (Light Mode)

| Shade | Hex | Usage |
|-------|-----|-------|
| Gray 50 | `#f9fafb` | Background (primary) |
| Gray 100 | `#f3f4f6` | Background (secondary) |
| Gray 200 | `#e5e7eb` | Borders |
| Gray 700 | `#374151` | Text (primary) |
| Gray 900 | `#111827` | Text (inverse) |

### Overlay Colors

| Component | Default | Customizable |
|-----------|---------|--------------|
| Background | `rgba(15, 23, 42, 0.9)` | Yes (hex + opacity) |
| Text | `#f8fafc` | Yes |
| Border | `#3b82f6` (accent) | Yes |
| Selection | `rgba(59, 130, 246, 0.3)` | No |

### Usage Guidelines

```tsx
// ✅ GOOD: Semantic color usage
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  แปลภาษา
</button>

<SuccessMessage className="text-green-500">
  แปลสำเร็จ!
</SuccessMessage>

// ✅ GOOD: Dark mode support
<div className="bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-50">
  Content
</div>

// ❌ BAD: Hardcoded colors
<div style={{ backgroundColor: '#0ea5e9' }}>
  Button
</div>
```

---

## Typography

### Font Families

| Usage | Font Family | Fallback |
|-------|-------------|----------|
| Body (Thai) | **Sarabun** | `system-ui`, `sans-serif` |
| Body (English) | **Inter** | `system-ui`, `sans-serif` |
| Monospace | **JetBrains Mono** | `monospace` |
| UI Labels | Sarabun | `system-ui` |

### Font Sizes

| Scale | Size | Line Height | Usage |
|-------|------|-------------|-------|
| xs | 0.75rem (12px) | 1rem | Captions, labels |
| sm | 0.875rem (14px) | 1.25rem | Secondary text |
| base | 1rem (16px) | 1.5rem | Body text |
| lg | 1.125rem (18px) | 1.75rem | Emphasized text |
| xl | 1.25rem (20px) | 1.75rem | Subheadings |
| 2xl | 1.5rem (24px) | 2rem | Headings |
| 3xl | 1.875rem (30px) | 2.25rem | Page titles |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Normal | 400 | Body text |
| Medium | 500 | Emphasized text, labels |
| Semibold | 600 | Headings, important text |
| Bold | 700 | Titles, CTAs |

### Overlay Typography (Customizable)

| Property | Range | Default |
|----------|-------|---------|
| Font size | 12-32px | 16px |
| Font family | System fonts + bundled | Sarabun |
| Line height | 1.4-1.8 | 1.6 |

### Usage Guidelines

```tsx
// ✅ GOOD: Semantic typography
<h1 className="text-3xl font-bold text-gray-900 dark:text-dark-50">
  การตั้งค่า
</h1>

<p className="text-base text-gray-700 dark:text-gray-300">
  เลือกภาษาต้นฉบับสำหรับการแปล
</p>

<label className="text-sm font-medium text-gray-600 dark:text-gray-400">
  ภาษาต้นฉบับ
</label>

// ❌ BAD: Arbitrary sizes
<h1 style={{ fontSize: '23px', fontWeight: 550 }}>
  Settings
</h1>
```

---

## Spacing & Layout

### Spacing Scale
Based on Tailwind's spacing scale (4px base unit):

| Scale | Value | Usage |
|-------|-------|-------|
| 0 | 0px | No spacing |
| 1 | 4px | Tight spacing |
| 2 | 8px | Compact spacing |
| 3 | 12px | Comfortable spacing |
| 4 | 16px | Default spacing |
| 5 | 20px | Relaxed spacing |
| 6 | 24px | Section spacing |
| 8 | 32px | Large sections |
| 12 | 48px | Major sections |

### Layout Containers

| Component | Max Width | Padding |
|-----------|-----------|---------|
| Settings window | 800px | 24px |
| History window | 900px | 24px |
| Overlay window | 600px | 16px |
| Form sections | 100% | 16px vertical |

### Grid System
12-column grid for settings/forms:

```
|---|---|---|---|---|---|---|---|---|---|---|  (12 columns)
    [1 col]   [2 cols]  [3 cols]      [6 cols]
```

### Usage Guidelines

```tsx
// ✅ GOOD: Consistent spacing
<div className="space-y-4"> // Vertical spacing between children
  <Section />
  <Section />
  <Section />
</div>

<div className="flex gap-4"> // Horizontal gap
  <Button />
  <Button />
</div>

// ✅ GOOD: Responsive padding
<div className="px-6 py-4">
  Content with 24px horizontal, 16px vertical padding
</div>

// ❌ BAD: Inconsistent spacing
<div style={{ marginBottom: '13px' }}>
  Arbitrary spacing
</div>
```

---

## Components

### Button

#### Primary Button
```tsx
<button className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700
                   text-white font-medium px-4 py-2 rounded-lg
                   transition-colors duration-150
                   disabled:opacity-50 disabled:cursor-not-allowed">
  แปลภาษา
</button>
```

#### Secondary Button
```tsx
<button className="bg-white dark:bg-dark-800
                   border border-gray-300 dark:border-gray-600
                   hover:bg-gray-50 dark:hover:bg-dark-700
                   text-gray-700 dark:text-gray-300
                   font-medium px-4 py-2 rounded-lg
                   transition-colors duration-150">
  ยกเลิก
</button>
```

#### Icon Button
```tsx
<button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700
                   text-gray-600 dark:text-gray-400
                   transition-colors duration-150">
  <Icon name="close" />
</button>
```

### Input Fields

```tsx
<input
  type="text"
  className="w-full px-3 py-2
             border border-gray-300 dark:border-gray-600
             rounded-lg
             bg-white dark:bg-dark-800
             text-gray-900 dark:text-dark-50
             placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-primary-500
             transition-all duration-150"
  placeholder="กรอกข้อความ..."
/>
```

### Card/Panel

```tsx
<div className="bg-white dark:bg-dark-800
                border border-gray-200 dark:border-gray-700
                rounded-lg
                p-6
                shadow-sm">
  <h3 className="text-lg font-semibold mb-4">การตั้งค่า</h3>
  Content
</div>
```

### Overlay Window

```tsx
<div className="fixed inset-0 pointer-events-none flex items-start justify-center p-4">
  <div className="pointer-events-auto
                  bg-dark-900/90
                  backdrop-blur-sm
                  border border-primary-500
                  rounded-lg
                  p-4
                  max-w-[600px]
                  shadow-2xl
                  animate-fade-in">
    <p className="text-dark-50 text-base leading-relaxed">
      ข้อความแปลภาษา...
    </p>
  </div>
</div>
```

### Toast Notification

```tsx
<div className="fixed bottom-4 right-4
                bg-white dark:bg-dark-800
                border-l-4 border-green-500
                rounded-lg shadow-lg
                px-4 py-3
                animate-slide-up">
  <p className="text-sm font-medium text-gray-900 dark:text-dark-50">
    แปลสำเร็จ!
  </p>
</div>
```

---

## Icons & Graphics

### Icon Library
- **Phosphor Icons** or **Lucide Icons**
- Consistent stroke width (2px)
- Fill variants for active states

### Icon Sizes

| Size | Value | Usage |
|------|-------|-------|
| xs | 16px | Small buttons, inline |
| sm | 20px | Default UI icons |
| md | 24px | Navigation, list items |
| lg | 32px | Feature icons |
| xl | 48px | Hero icons |

### App Icon
- **Style**: Flat, modern
- **Colors**: Primary blue gradient
- **Symbol**: Translation/language symbol
- **Sizes**: 16px, 32px, 64px, 128px, 256px, 512px

### System Tray Icon
- **Template**: Monochrome for macOS
- **Color**: Dark/light variants
- **Size**: 16x16px standard

---

## Animations

### Duration Scale

| Duration | Usage |
|----------|-------|
| 75ms | Micro-interactions (hover) |
| 150ms | Fast transitions (dropdowns) |
| 200ms | Default transitions (modals) |
| 300ms | Slow transitions (page transitions) |
| 500ms | Very slow (rarely used) |

### Easing Functions

| Easing | Tailwind | Usage |
|--------|----------|-------|
| Ease-out | `ease-out` | Elements leaving |
| Ease-in | `ease-in` | Elements entering |
| Ease-in-out | `ease-in-out` | Movement |
| Linear | `linear` | Fades, color changes |

### Predefined Animations

```tsx
// Fade in
<div className="animate-fade-in">
  Content fades in (200ms)
</div>

// Slide up
<div className="animate-slide-up">
  Content slides up (300ms)
</div>

// Pulse (for loading states)
<div className="animate-pulse-slow">
  Loading indicator
</div>
```

### Animation Guidelines

```tsx
// ✅ GOOD: Subtle, purposeful animations
<button className="transition-colors duration-150 hover:bg-primary-600">
  Button
</button>

// ✅ GOOD: Loading states
<div className="animate-pulse">
  Loading translations...
</div>

// ❌ BAD: Distracting animations
<div className="animate-spin hover:animate-bounce">
  Too much motion!
</div>
```

---

## Accessibility

### Color Contrast

- **WCAG AA**: Minimum 4.5:1 for normal text
- **WCAG AA**: Minimum 3:1 for large text (18px+)
- **WCAG AAA**: Minimum 7:1 (enhanced)

Example compliant combinations:
- `#111827` on `#ffffff` (16.4:1) ✅
- `#0ea5e9` on `#ffffff` (4.6:1) ✅
- `#64748b` on `#ffffff` (5.1:1) ✅

### Focus States

```tsx
// ✅ GOOD: Visible focus indicator
<button className="focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Button with clear focus
</button>

// ❌ BAD: No focus indicator
<button className="focus:outline-none">
  Invisible focus
</button>
```

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Logical tab order
- Visible focus indicators
- Escape key closes modals/overlays

### Screen Readers

```tsx
// ✅ GOOD: Semantic HTML + ARIA labels
<button aria-label="แปลข้อความ">
  <TranslateIcon />
</button>

<div role="status" aria-live="polite">
  {status}
</div>

// ✅ GOOD: Alt text for images
<img src="screenshot.png" alt="ภาพหน้าจอที่จะแปล" />
```

### Text Sizing

- Support 200% zoom without horizontal scrolling
- Use relative units (rem) not pixels
- Respect user's font size preferences

---

## Screen-Specific Guidelines

### Settings Window

**Layout**: Sidebar navigation + main content area

```
┌─────────────────────────────────────────────┐
│ การตั้งค่า                          [_][□][×] │
├──────────┬──────────────────────────────────┤
│ ทั่วไป   │ การตั้งค่าทั่วไป                    │
│ ○ ทั่วไป  │ ┌────────────────────────────┐    │
│ ◀ ปุ่มลัด  │ │ ภาษาต้นฉบับ:            │    │
│ ○ การแสดง│ │ [Auto               ▼] │    │
│ ○ ประวัติ│ │                            │    │
│          │ └────────────────────────────┘    │
└──────────┴──────────────────────────────────┘
```

**Guidelines**:
- 240px sidebar (fixed width)
- 550px main content (scrollable)
- Sticky section headers
- Group related settings

### Overlay Window

**Characteristics**:
- Always-on-top
- Frameless (no title bar)
- Transparent background
- Click-through option
- Auto-hide after delay

**Positioning**:
- Near cursor (default)
- Screen center (optional)
- Last position (optional)

```tsx
// Cursor positioning example
const position = {
  top: Math.min(cursorY + 20, window.innerHeight - overlayHeight - 20),
  left: Math.min(cursorX, window.innerWidth - overlayWidth - 20)
}
```

### History Window

**Layout**: Search bar + filterable list

```
┌─────────────────────────────────────────────┐
│ ประวัติการแปล                       [_][□][×] │
├─────────────────────────────────────────────┤
│ 🔍 ค้นหา........................              │
├─────────────────────────────────────────────┤
│ Hello → สวัสดี          31 ม.ค. 2025  [×]   │
│ Game → เกม              31 ม.ค. 2025  [×]   │
│ Settings → การตั้งค่า   30 ม.ค. 2025  [×]   │
└─────────────────────────────────────────────┘
```

**Guidelines**:
- 900px width, 700px height
- Search bar always visible
- Pagination for 100+ entries
- Hover actions (copy, delete)

### Screen Selector

**Characteristics**:
- Fullscreen (per monitor)
- Semi-transparent dark overlay (50% opacity)
- Crosshair cursor
- Border around selection
- Size label (e.g., "300 × 200")

```
┌─────────────────────────────────────────────┐
│                   ╱│                         │
│                    ╱ 300 × 200              │
│                   ╱                          │
│                  ╱                           │
└─────────────────────────────────────────────┘
```

---

## Dark Mode

### Toggle
- System preference by default
- Manual override in settings
- Persists across sessions

### Adaptations

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Background | `#ffffff` | `#1e293b` |
| Text | `#111827` | `#f8fafc` |
| Border | `#e5e7eb` | `#334155` |
| Input BG | `#ffffff` | `#0f172a` |
| Hover | `#f3f4f6` | `#334155` |

### Implementation

```tsx
// ✅ GOOD: Dark mode variants
<div className="bg-white dark:bg-dark-800
                text-gray-900 dark:text-dark-50
                border border-gray-200 dark:border-gray-700">
  Content
</div>

// ❌ BAD: Separate dark mode components
if (isDarkMode) {
  return <DarkComponent />
}
return <LightComponent />
```

---

## Responsive Design

### Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| sm | 640px | Small screens |
| md | 768px | Tablets |
| lg | 1024px | Desktop (default) |
| xl | 1280px | Large desktop |

### Usage

```tsx
// ✅ GOOD: Responsive classes
<div className="w-full lg:w-1/2 px-4 lg:px-6">
  Content
</div>

// ✅ GOOD: Responsive utilities
<div className="hidden md:block">
  Desktop content
</div>
```

---

## Thai Language Considerations

### Typography
- Use Sarabun font for proper Thai rendering
- Line height 1.6-1.8 for readability
- No justification (causes poor spacing)

### Text Alignment
- Left alignment for body text
- Center for headings/titles
- Right alignment for numbers

### Input Methods
- Support Thai keyboard input
- Proper cursor placement in Thai text
- No text truncation on Thai characters

---

## Component Library

### Recommended Components

For rapid prototyping, use:
- **Headless UI** (accessible, unstyled components)
- **Radix UI** (primitives, composable)
- **Tailwind UI** (pre-built components, paid)

### Custom Components

Build custom for:
- Overlay window (special requirements)
- Screen selector (unique functionality)
- Translation display (domain-specific)

---

## Implementation Checklist

For each new component:
- [ ] Follows color system
- [ ] Uses semantic typography
- [ ] Proper spacing scale
- [ ] Dark mode support
- [ ] Accessible (ARIA labels, keyboard nav)
- [ ] Responsive (if applicable)
- [ ] Thai language support
- [ ] Loading/error states
- [ ] Hover/focus states
- [ ] Animation (if needed)
