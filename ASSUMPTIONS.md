# Screen Translation Overlay - Project Assumptions

## Version
- **Version**: 0.1.0
- **Last Updated**: 2025-01-31
- **Status**: Draft

---

## Table of Contents
1. [Business Assumptions](#business-assumptions)
2. [Technical Assumptions](#technical-assumptions)
3. [User Assumptions](#user-assumptions)
4. [Platform Assumptions](#platform-assumptions)
5. [External Service Assumptions](#external-service-assumptions)
6. [Performance Assumptions](#performance-assumptions)
7. [Constraint Assumptions](#constraint-assumptions)

---

## Business Assumptions

### BA-1: Target Market
**Assumption**: Primary users are Thai-speaking individuals who frequently encounter foreign language text on their screens.

**Rationale**:
- Gaming community in Thailand is large and growing
- Many software applications don't support Thai language
- Mobile-only translation apps exist, but desktop solutions are limited

**Impact**: Feature prioritization, UI language (Thai-first design)

**Risk**: If market is smaller than expected, may limit adoption

---

### BA-2: Pricing Model
**Assumption**: Application will be free and open-source.

**Rationale**:
- Lower barrier to adoption
- Community contributions improve quality
- No commercial support infrastructure needed initially

**Impact**:
- No payment infrastructure needed
- No licensing/DRM systems
- Relies on free-tier APIs

**Risk**: Limited API quotas may restrict usage

---

### BA-3: Monetization (Future)
**Assumption**: Future monetization may come from:
- Premium translation services (DeepL, professional APIs)
- Cloud OCR for better accuracy
- Plugin marketplace

**Impact**: Architecture should support:
- Multiple translation providers
- Service tier switching
- Plugin system

---

## Technical Assumptions

### TA-1: OCR Accuracy
**Assumption**: Tesseract.js can achieve 90%+ accuracy on clear, printed text with proper preprocessing.

**Rationale**:
- Tesseract v5 improved significantly
- Image preprocessing (contrast, grayscale) helps
- Gaming text is typically high-contrast, printed fonts

**Impact**:
- Need image preprocessing pipeline
- May need confidence thresholding
- User can manually correct if needed

**Risk**: Accuracy may be lower on:
- Handwritten text
- Low-resolution images
- Complex fonts/stylized text

---

### TA-2: Translation API Availability
**Assumption**: Google Translate's unofficial API will remain functional and free.

**Rationale**:
- API has been stable for years
- Widely used in open-source projects
- No immediate plans to restrict access

**Impact**:
- No API key required
- No usage limits (strictly speaking)
- Fallback strategy needed if blocked

**Risk**:
- Google may block automated access
- IP-based rate limiting
- Service may become paid

**Mitigation**:
- Cache extensively
- Implement multiple providers
- Allow custom API endpoints

---

### TA-3: Local Processing Feasibility
**Assumption**: Modern CPUs can handle OCR processing in under 2 seconds for typical screen regions.

**Rationale**:
- Tesseract.js uses WebAssembly
- Multi-core processors are common
- Typical capture is small (100-500 words)

**Impact**:
- No cloud processing needed
- Privacy-preserving (local OCR)
- Offline capability

**Risk**: Older machines may be slower

---

### TA-4: Database Performance
**Assumption**: SQLite can handle translation history for typical usage (1000+ entries) without performance degradation.

**Rationale**:
- SQLite is optimized for read-heavy workloads
- Full-text search with FTS5 extension
- Single-user application (no concurrent writes)

**Impact**:
- No external database server needed
- Simple deployment
- Fast search queries

**Risk**: Very large history (>10k entries) may slow down

**Mitigation**:
- Pagination for display
- Auto-prune old entries
- Archive old data

---

## User Assumptions

### UA-1: Technical Proficiency
**Assumption**: Users have basic computer literacy but are not developers.

**Impact**:
- Simple, intuitive UI
- Clear error messages in Thai
- Minimal configuration required
- Sensible defaults

---

### UA-2: Usage Patterns
**Assumption**: Typical usage is:
- 10-20 translations per session
- Sessions last 1-2 hours
- Users want quick results, not perfect accuracy
- History is accessed occasionally

**Impact**:
- Optimization for speed over accuracy
- History search, not detailed analytics
- Keyboard shortcuts over mouse navigation

---

### UA-3: Display Configurations
**Assumption**: Users have:
- 1920x1080 or higher resolution
- Single monitor (70%) or dual monitor (30%)
- DPI scaling enabled (Windows/macOS)

**Impact**:
- Multi-monitor support is critical
- DPI-aware rendering required
- Overlay positioning must adapt

---

### UA-4: Keyboard Preference
**Assumption**: Power users prefer keyboard shortcuts over mouse interaction.

**Impact**:
- Global shortcuts for all common actions
- Minimal mouse usage in primary workflow
- Shortcuts should be customizable

---

## Platform Assumptions

### PA-1: Windows Dominance
**Assumption**: 70% of users are on Windows, 20% macOS, 10% Linux.

**Rationale**:
- Gaming is predominantly Windows
- Thailand Windows market share is ~80%

**Impact**:
- Windows is primary development target
- Test on Windows first
- macOS/Linux are secondary priorities

---

### PA-2: OS Version Support
**Assumption**:
- Windows: Windows 10/11 only (no Windows 7/8)
- macOS: macOS 11+ (Big Sur and later)
- Linux: Ubuntu 20.04+, Debian 11+

**Rationale**:
- Electron 28+ drops support for older OS versions
- Modern APIs required (screen capture, etc.)

**Impact**:
- Smaller testing matrix
- Can use modern JavaScript features

---

### PA-3: Hardware Capabilities
**Assumption**: Users have:
- 4GB+ RAM
- Dual-core CPU or better
- 500MB free disk space

**Impact**:
- Electron app size is acceptable (~150MB)
- Memory usage targets are achievable

---

## External Service Assumptions

### EA-1: Google Translate API
**Assumption**: Unofficial Google Translate API will remain accessible at `https://translate.googleapis.com/translate_a/single`.

**Rationale**: Widely used, stable endpoint

**Risk**: May be blocked or require authentication

**Mitigation**: Implement alternative providers (DeepL, LibreTranslate)

---

### EA-2: Tesseract Language Data
**Assumption**: Tesseract language data files can be downloaded from official repositories and bundled with the app.

**Rationale**: Standard practice for Tesseract.js deployments

**Impact**: App size increases by ~20MB per language

---

### EA-3: No API Keys Required
**Assumption**: Initial version does not require users to provide API keys.

**Rationale**: Lower barrier to adoption

**Future**: Pro users may bring their own API keys for better services

---

## Performance Assumptions

### PF-1: Network Latency
**Assumption**: Average internet latency in Thailand is ~50ms.

**Impact**: Translation API calls should complete in <500ms

---

### PF-2: CPU Availability
**Assumption**: App can use up to 20% CPU during OCR without impacting user experience.

**Rationale**: OCR is brief and infrequent

---

### PF-3: Memory Usage
**Assumption**: Users have 8GB+ RAM, so 200MB idle usage is acceptable.

**Impact**: Caching strategies can be more aggressive

---

## Constraint Assumptions

### CA-1: Development Timeline
**Assumption**: Single developer working part-time can complete MVP in 4-6 weeks.

**Impact**: Scope must be limited to P0 features

---

### CA-2: Budget
**Assumption**: Zero budget for third-party services.

**Impact**:
- Use free-tier services only
- No paid APIs
- No cloud infrastructure

---

### CA-3: Maintenance
**Assumption**: Community contributions will help with maintenance and bug fixes.

**Impact**: Code should be well-documented, modular, and welcoming to contributors

---

## Validation Strategy

### High-Risk Assumptions to Validate

1. **OCR Accuracy (TA-1)**
   - **Validation**: Prototype OCR with sample game screenshots
   - **Success Criteria**: 90%+ accuracy on 50 test images
   - **Timeline**: Week 2

2. **Google Translate API (EA-1)**
   - **Validation**: Load test with 1000 translations
   - **Success Criteria**: <5% failure rate
   - **Timeline**: Week 3

3. **Performance Targets (PF-1, PF-2, PF-3)**
   - **Validation**: Profile on minimum spec hardware
   - **Success Criteria**: All targets met
   - **Timeline**: Week 4

4. **User Workflow (UA-2)**
   - **Validation**: User testing with 5-10 beta users
   - **Success Criteria**: Positive feedback on workflow
   - **Timeline**: Week 5

---

## Assumptions Review

This document should be reviewed:
- **When**: At each sprint planning
- **Who**: Product owner + technical lead
- **Why**: Identify invalidated assumptions early

### Assumption Change Process

1. **Identify**: Assumption no longer valid
2. **Assess Impact**: How does this affect the project?
3. **Update Plan**: Adjust architecture, features, or timeline
4. **Communicate**: Update team and stakeholders
5. **Document**: Record change here with rationale

---

## Appendix: Assumption Log

| ID | Date | Status | Notes |
|----|------|--------|-------|
| TA-1 | 2025-01-31 | Active | To be validated in Week 2 |
| EA-1 | 2025-01-31 | Active | To be validated in Week 3 |
| UA-2 | 2025-01-31 | Active | To be validated in Week 5 |
