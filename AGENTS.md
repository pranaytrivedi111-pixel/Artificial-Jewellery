# Project Rules & Instructions

## Prohibited Keywords & Brand Guidelines

### 1. Strict Prohibition of "Meesho"
- **NEVER use the word "Meesho" (or any case variation: meesho, MEESHO, Meesho) anywhere in the application.**
- This rule applies strictly across:
  - Product titles, subtitles, tags, and category names
  - Product badges (e.g. use "ROYAL VIRAL TREND", never marketplace names)
  - Urgency banners and stock counters
  - Product descriptions, material specs, and feature bullet points
  - Customer reviews, reviewer comments, customer media captions, and testimonials
  - UI labels, navigation menus, footers, checkout flows, and search inputs
  - Metadata, HTML titles, og:tags, and commit/code comments
  - JSON and static data files

### 2. Auto-Removal & Replacement Rules
- Always automatically remove or replace any reference:
  - `meesho viral` -> `Royal Viral` or `Signature Viral`
  - `viral on meesho` / `trending on meesho` -> `viral online` / `trending across India`
  - `on meesho` / `from meesho` -> `online` / `from Qavelle`
  - `meesho app` / `meesho.com` -> `QAVELLE Official Store` / `qavelle.com`
  - `meesho` -> `QAVELLE`
- Use the runtime helper `autoRemoveMeesho` and `sanitizeText` from `/src/utils/brandSanitizer.ts` to automatically scrub any user inputs or dynamic strings.

### 3. Brand Identity
- The website is exclusively **QAVELLE** – India's Most Trusted Royal Handcrafted Jewellery Store.
- Maintain high-end luxury atelier brand positioning at all times.
