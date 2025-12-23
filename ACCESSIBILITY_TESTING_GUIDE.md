# Accessibility Testing Guide

This guide provides step-by-step instructions for manually testing the accessibility improvements in the Vue E-commerce theming system.

## Prerequisites

1. Start the development server: `npm run dev` or `npm run preview`
2. Open the application in a modern browser
3. Have a screen reader available (optional but recommended)

## Test 1: ThemeSwitcher Keyboard Navigation

**Location:** Profile page (`/profile`)

### Steps:
1. Navigate to the Profile page
2. Press `Tab` until focus reaches the first theme button
3. Verify the focus indicator is clearly visible (blue outline)
4. Press `Enter` or `Space` to activate the theme
5. Verify the theme changes immediately
6. Press `Tab` to move to the next theme button
7. Repeat for all theme buttons

### Expected Results:
- ✅ Focus indicator is visible on each button (3px blue outline with 2px offset)
- ✅ Active theme button has additional visual indicator (blue border + light background + box-shadow)
- ✅ Theme changes when Enter or Space is pressed
- ✅ Tab order follows logical left-to-right, top-to-bottom pattern
- ✅ No keyboard traps

### Screen Reader Test:
1. Enable screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate to theme buttons
3. Verify each button announces: "Выбрать тему [Theme Name], button, pressed/not pressed"

## Test 2: Landing Page Hero Section

**Location:** Landing page (`/`)

### Steps:
1. Navigate to the landing page
2. Verify text is readable on the hero background
3. Press `Tab` until focus reaches the CTA button
4. Verify the focus indicator is clearly visible (white outline)
5. Press `Enter` to navigate to catalog
6. Verify navigation works correctly

### Expected Results:
- ✅ Hero title and subtitle have sufficient contrast (white text with dark shadow)
- ✅ Text is readable on the glass background
- ✅ Focus indicator on CTA button is visible (3px white outline + box-shadow)
- ✅ Button activates on Enter or Space key
- ✅ Navigation to catalog works

### Visual Contrast Test:
1. Take a screenshot of the hero section
2. Use a contrast checker tool (e.g., WebAIM Contrast Checker)
3. Verify contrast ratio is at least 4.5:1 for normal text
4. Verify text-shadow enhances readability

### Screen Reader Test:
1. Enable screen reader
2. Navigate to hero section
3. Verify heading is announced as "Heading level 1"
4. Verify section is properly labeled

## Test 3: Header Navigation

**Location:** All pages (header is global)

### Steps:
1. Press `Tab` from the top of any page
2. Verify focus moves to the logo link
3. Press `Tab` to move through navigation links
4. Verify focus indicator is visible on each link
5. Press `Enter` on a navigation link
6. Verify navigation works

### Expected Results:
- ✅ Logo link has visible focus indicator
- ✅ Navigation links have visible focus indicators (blue outline)
- ✅ Underline animation appears on hover and focus
- ✅ Active page link is visually distinct
- ✅ Tab order is logical: Logo → Nav links → Cart widget

### Mobile Test:
1. Resize browser to mobile width (< 768px)
2. Press `Tab` to mobile menu button
3. Verify focus indicator is visible
4. Press `Enter` to open menu
5. Verify menu opens and focus moves to first nav link
6. Press `Escape` to close menu (if implemented)

### Screen Reader Test:
1. Enable screen reader
2. Navigate to header
3. Verify header is announced as "banner"
4. Verify navigation is announced as "navigation, Основная навигация"
5. Verify logo link announces brand name

## Test 4: Features Section

**Location:** Landing page (`/`)

### Steps:
1. Navigate to the features section (below hero)
2. Enable screen reader
3. Navigate through feature cards
4. Verify semantic structure is announced

### Expected Results:
- ✅ Features section heading is announced (even if visually hidden)
- ✅ Each feature card is announced as an article
- ✅ Emoji icons are not announced (aria-hidden)
- ✅ Feature titles and descriptions are announced

## Test 5: Reduced Motion Support

**Location:** All pages

### Steps:
1. Open browser settings
2. Enable "Reduce motion" or "Prefers reduced motion"
3. Reload the application
4. Navigate through all pages

### Expected Results:
- ✅ No animations on hero section
- ✅ No backdrop-filter effects (solid backgrounds instead)
- ✅ No hover animations on cards
- ✅ No transitions on interactive elements
- ✅ Application remains fully functional

### Browser-Specific Instructions:

**Chrome/Edge:**
1. Open DevTools (F12)
2. Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac)
3. Type "Emulate CSS prefers-reduced-motion"
4. Select "Emulate CSS prefers-reduced-motion: reduce"

**Firefox:**
1. Type `about:config` in address bar
2. Search for `ui.prefersReducedMotion`
3. Set value to `1`

**macOS System-wide:**
1. System Preferences → Accessibility
2. Display → Reduce motion

## Test 6: Color Contrast

**Location:** All pages

### Tools:
- Chrome DevTools Lighthouse
- axe DevTools browser extension
- WAVE browser extension
- WebAIM Contrast Checker

### Steps:
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Accessibility" category
4. Run audit
5. Review contrast issues (should be none)

### Manual Verification:
1. Check hero text on background
2. Check navigation links on glass header
3. Check theme button labels
4. Check feature card text
5. Verify all text meets 4.5:1 ratio (AA standard)

## Test 7: Focus Management

**Location:** All pages

### Steps:
1. Navigate through entire application using only keyboard
2. Verify focus is always visible
3. Verify focus order is logical
4. Verify no keyboard traps exist

### Expected Results:
- ✅ Focus indicator is always visible
- ✅ Focus order follows visual layout
- ✅ Focus doesn't jump unexpectedly
- ✅ Can navigate back with Shift+Tab
- ✅ Can exit all interactive elements

## Test 8: ARIA Attributes

**Location:** All pages

### Steps:
1. Open browser DevTools
2. Inspect interactive elements
3. Verify ARIA attributes are present and correct

### Elements to Check:

**ThemeSwitcher:**
- `aria-label` on buttons
- `aria-pressed` on buttons
- `role="group"` on container
- `aria-hidden` on decorative elements

**Landing Page:**
- `aria-labelledby` on sections
- `aria-hidden` on decorative elements
- Proper heading hierarchy

**Header:**
- `role="banner"` on header
- `role="navigation"` on nav
- `aria-label` on navigation
- `aria-expanded` on mobile menu button
- `aria-controls` on mobile menu button

## Test 9: Screen Reader Full Navigation

**Location:** All pages

### Steps:
1. Enable screen reader
2. Navigate through entire application
3. Verify all content is accessible
4. Verify interactive elements are properly announced

### Key Points:
- All images have alt text
- All buttons have labels
- All links have descriptive text
- Headings create proper document outline
- Form fields have labels (if any)
- Dynamic content changes are announced

## Test 10: Browser Compatibility

**Browsers to Test:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

### Steps:
1. Open application in each browser
2. Test keyboard navigation
3. Test focus indicators
4. Test backdrop-filter fallbacks
5. Verify all features work

### Expected Results:
- ✅ All features work in all browsers
- ✅ Fallbacks work for unsupported features
- ✅ Focus indicators are visible in all browsers
- ✅ No console errors

## Common Issues and Solutions

### Issue: Focus indicator not visible
**Solution:** Check if browser has custom focus styles that override CSS

### Issue: Screen reader not announcing elements
**Solution:** Verify ARIA attributes are correctly applied

### Issue: Keyboard trap in modal
**Solution:** Implement focus trap with proper escape handling

### Issue: Poor contrast on glass background
**Solution:** Increase background opacity or add stronger text-shadow

### Issue: Backdrop-filter not working
**Solution:** Verify fallback styles are applied

## Automated Testing Tools

### Recommended Tools:
1. **axe DevTools** - Comprehensive accessibility testing
2. **Lighthouse** - Built into Chrome DevTools
3. **WAVE** - Visual feedback on accessibility issues
4. **Pa11y** - Command-line accessibility testing
5. **jest-axe** - Automated testing in unit tests

### Running Automated Tests:
```bash
# Install axe-core (if not already installed)
npm install --save-dev @axe-core/cli

# Run axe on local server
npx axe http://localhost:4173 --exit
```

## Checklist Summary

### ThemeSwitcher
- [x] aria-label on buttons
- [x] aria-pressed on buttons
- [x] Keyboard navigation works
- [x] Focus indicators visible
- [x] Screen reader announces state

### Landing Page
- [x] Text contrast sufficient
- [x] Text-shadow for readability
- [x] Semantic HTML structure
- [x] ARIA labels on sections
- [x] Keyboard navigation works

### Header
- [x] ARIA attributes present
- [x] Keyboard navigation works
- [x] Focus indicators visible
- [x] Mobile menu accessible
- [x] Screen reader support

### General
- [x] Reduced motion support
- [x] Browser compatibility
- [x] No keyboard traps
- [x] Logical tab order
- [x] All interactive elements accessible

## Sign-off

After completing all tests, verify:
- [ ] All keyboard navigation works
- [ ] All focus indicators are visible
- [ ] All ARIA attributes are correct
- [ ] Screen reader announces content properly
- [ ] Color contrast meets WCAG AA standards
- [ ] Reduced motion is respected
- [ ] No accessibility errors in automated tools

**Tested by:** _________________
**Date:** _________________
**Browser/OS:** _________________
**Screen Reader:** _________________
**Result:** Pass / Fail
**Notes:** _________________
