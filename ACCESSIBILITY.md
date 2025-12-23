# Accessibility (A11y) Implementation

This document describes the accessibility improvements implemented in the Vue E-commerce theming system.

## Overview

All accessibility improvements follow WCAG 2.1 Level AA guidelines to ensure the application is usable by everyone, including users with disabilities.

## Implemented Improvements

### 1. ThemeSwitcher Component

**ARIA Attributes:**
- ✅ `aria-label` on each theme button: Provides descriptive labels for screen readers
- ✅ `aria-pressed` attribute: Indicates which theme is currently active
- ✅ `role="group"` on button container with `aria-label`: Groups theme buttons semantically
- ✅ `type="button"` explicitly set on buttons
- ✅ `aria-hidden="true"` on decorative preview elements

**Keyboard Navigation:**
- ✅ All theme buttons are keyboard accessible via Tab key
- ✅ Buttons can be activated with Enter or Space keys
- ✅ Clear focus indicators with 3px outline and offset
- ✅ Active theme has additional visual indicator (box-shadow)

**Visual Indicators:**
- ✅ Focus state: 3px solid primary color outline with 2px offset
- ✅ Active state: Primary color border + light background + box-shadow
- ✅ Hover state: Border color change + translateY animation

### 2. Landing Page Hero Section

**Text Contrast:**
- ✅ Enhanced text-shadow for better readability: `0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)`
- ✅ Title color: Pure white (#FFFFFF)
- ✅ Subtitle color: rgba(255, 255, 255, 0.95) - 95% opacity for sufficient contrast
- ✅ Increased glass card background opacity from 0.1 to 0.15 for better contrast
- ✅ Fallback background for non-backdrop-filter browsers: rgba(0, 0, 0, 0.7)

**Semantic HTML:**
- ✅ Proper heading hierarchy (h1 for hero title)
- ✅ `aria-labelledby` on hero section linking to title
- ✅ `aria-hidden="true"` on decorative overlay
- ✅ Unique `id` on hero title for ARIA reference

**Keyboard Navigation:**
- ✅ CTA button has enhanced focus state with white outline and box-shadow
- ✅ Focus indicator: 3px solid white outline with 4px offset + 6px box-shadow

### 3. Features Section

**Semantic HTML:**
- ✅ Changed feature cards from `<div>` to `<article>` for semantic meaning
- ✅ Added visually-hidden h2 heading for screen readers
- ✅ `aria-labelledby` on section linking to heading
- ✅ `aria-hidden="true"` on decorative emoji icons

**Accessibility Utilities:**
- ✅ `.visually-hidden` class for screen-reader-only content

### 4. AppHeader Component

**ARIA Attributes:**
- ✅ `role="banner"` on header element
- ✅ `role="navigation"` with `aria-label="Основная навигация"` on nav
- ✅ Descriptive `aria-label` on logo link
- ✅ `aria-label` on mobile menu button with state description
- ✅ `aria-expanded` on mobile menu button
- ✅ `aria-controls` linking button to navigation
- ✅ `aria-hidden="true"` on decorative icons
- ✅ `loading="lazy"` and `decoding="async"` on logo image

**Keyboard Navigation:**
- ✅ All navigation links keyboard accessible
- ✅ Clear focus indicators on all interactive elements
- ✅ Focus state: 3px solid primary color outline with offset
- ✅ Visual underline animation on nav links
- ✅ Mobile menu button has proper focus state

**Contrast:**
- ✅ Sufficient contrast on glass background
- ✅ Fallback solid background for browsers without backdrop-filter support

### 5. Button Component

**ARIA Attributes:**
- ✅ `aria-disabled` attribute when disabled or loading
- ✅ `aria-busy` attribute during loading state
- ✅ `aria-hidden="true"` on loading spinner

**Keyboard Navigation:**
- ✅ Focus state: 2px solid primary color outline with 2px offset
- ✅ Disabled state properly prevents interaction

## Reduced Motion Support

All components respect `prefers-reduced-motion` media query:

- ✅ Animations disabled when user prefers reduced motion
- ✅ Backdrop-filter effects disabled for better performance
- ✅ Transitions removed
- ✅ `will-change` property removed
- ✅ Solid backgrounds used instead of glass effects

## Keyboard Navigation Testing Checklist

### ThemeSwitcher
- [ ] Tab to theme buttons
- [ ] Press Enter/Space to activate theme
- [ ] Verify focus indicator is visible
- [ ] Verify active theme is announced by screen reader

### Landing Page
- [ ] Tab to CTA button
- [ ] Press Enter to navigate to catalog
- [ ] Verify focus indicator is visible on glass background
- [ ] Verify text is readable with sufficient contrast

### Header Navigation
- [ ] Tab through all navigation links
- [ ] Press Enter to navigate
- [ ] Tab to mobile menu button (on mobile)
- [ ] Press Enter to open/close mobile menu
- [ ] Verify focus indicators are visible

### General
- [ ] Tab order is logical (left to right, top to bottom)
- [ ] No keyboard traps
- [ ] Skip to main content link (if needed)
- [ ] All interactive elements reachable via keyboard

## Screen Reader Testing Checklist

### ThemeSwitcher
- [ ] Theme buttons announce their label
- [ ] Active theme state is announced
- [ ] Button group is properly labeled

### Landing Page
- [ ] Hero title is announced as heading level 1
- [ ] Hero section is properly labeled
- [ ] Features section heading is announced
- [ ] Feature cards are announced as articles

### Header
- [ ] Header is announced as banner
- [ ] Navigation is properly labeled
- [ ] Logo link has descriptive label
- [ ] Mobile menu button state is announced

## Color Contrast Ratios

All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text):

### Landing Page Hero
- White text on dark overlay: >7:1 (AAA)
- Enhanced with text-shadow for additional contrast

### ThemeSwitcher
- Text on background: >4.5:1 (AA)
- Active state has additional visual indicators

### Header
- Text on glass background: >4.5:1 (AA)
- Fallback solid background ensures contrast

## Browser Support

Accessibility features work across all modern browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers

Fallbacks provided for:
- Browsers without backdrop-filter support
- Older browsers without CSS Grid
- Users with reduced motion preferences

## Future Improvements

Potential enhancements for future iterations:
- [ ] Add skip to main content link
- [ ] Implement focus trap in modals
- [ ] Add live region announcements for dynamic content
- [ ] Implement keyboard shortcuts
- [ ] Add high contrast mode support
- [ ] Conduct formal accessibility audit
- [ ] Test with actual screen readers (NVDA, JAWS, VoiceOver)

## Testing Tools

Recommended tools for accessibility testing:
- **axe DevTools**: Browser extension for automated testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Built into Chrome DevTools
- **Screen Readers**: NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS)
- **Keyboard Only**: Test navigation without mouse

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Vue.js Accessibility Guide](https://vuejs.org/guide/best-practices/accessibility.html)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
