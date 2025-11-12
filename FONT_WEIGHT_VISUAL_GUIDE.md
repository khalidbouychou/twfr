# Font Weight Visual Guide

## Quick Reference Card

### Default Text Weights

```
┌─────────────────────────────────────────────┐
│  FONT WEIGHT HIERARCHY                      │
├─────────────────────────────────────────────┤
│                                             │
│  Body Text (p, div, span)       400        │
│  ────────────────────────────────────────  │
│  This is normal text - clean & readable     │
│                                             │
│  Medium Emphasis (.font-medium)  500       │
│  ────────────────────────────────────────  │
│  This is medium text - subtle emphasis      │
│                                             │
│  Headings (h1-h6)               600        │
│  ────────────────────────────────────────  │
│  This is heading text - strong hierarchy    │
│                                             │
│  Bold (.font-bold)              600        │
│  ────────────────────────────────────────  │
│  This is bold text - clear emphasis         │
│                                             │
│  Semibold (.font-semibold)      500        │
│  ────────────────────────────────────────  │
│  This is semibold - medium emphasis         │
│                                             │
└─────────────────────────────────────────────┘
```

## Weight Comparison

### Before (Heavy)
```
font-normal:    400 ✅ (unchanged)
font-medium:    500 ✅ (unchanged)
font-semibold:  600 ⚠️  (was too heavy)
font-bold:      700 ❌ (too heavy)
<strong>:       700 ❌ (too heavy)
```

### After (Balanced)
```
font-normal:    400 ✅
font-medium:    500 ✅
font-semibold:  500 ✅ (lighter)
font-bold:      600 ✅ (lighter)
<strong>:       600 ✅ (lighter)
```

## Usage Examples

### ✅ Good Practice

```jsx
// Dashboard text
<p className="text-white">Your balance: 10,000 MAD</p>          // 400
<span className="font-medium text-green-400">+5.2%</span>        // 500
<h2 className="text-2xl text-white">Portfolio Summary</h2>      // 600
<button className="font-semibold">Invest Now</button>           // 500
```

### ❌ Avoid

```jsx
// Don't stack font weights unnecessarily
<div className="font-bold">
  <span className="font-extrabold">Too Heavy!</span>  // 700 on 600 = too much
</div>

// Don't use bold for large text
<h1 className="text-4xl font-bold">Huge Bold Text</h1>  // Overkill
```

## Component-Specific Guidelines

### Dashboard Cards
```jsx
<div className="bg-white/5 rounded-lg p-4">
  <h3 className="text-lg text-white">Card Title</h3>           // 600
  <p className="text-white/60">Subtitle or description</p>     // 400
  <span className="text-2xl text-green-400">$1,234</span>      // 400 (size does emphasis)
</div>
```

### Navigation
```jsx
<nav>
  <a className="text-white hover:text-green-400">Home</a>      // 400
  <a className="text-green-400 font-medium">Dashboard</a>      // 500 (active)
</nav>
```

### Buttons
```jsx
// Primary
<button className="bg-green-500 text-white font-medium">     // 500
  Confirm
</button>

// Secondary
<button className="bg-white/10 text-white">                  // 400
  Cancel
</button>
```

### Tables
```jsx
<thead>
  <th className="font-medium text-white/80">Product</th>     // 500
</thead>
<tbody>
  <td className="text-white">OPCVM Actions</td>              // 400
</tbody>
```

## Color & Weight Pairing

### Dark Backgrounds (current theme)
```
Light text (white) + Normal weight (400) = Perfect readability
Green accent (#3CD4AB) + Medium weight (500) = Clear emphasis
White + Semibold (600) = Strong headers
```

### Tips for Dark Mode
- Use 400 for body text (lighter weights on dark = better)
- Use 500 for subtle emphasis
- Use 600 only for headings and important CTAs
- Avoid 700+ on dark backgrounds (too harsh)

## Browser Rendering Notes

### Chrome/Edge
- Font smoothing: `-webkit-font-smoothing: antialiased`
- Result: Crisp, clean text
- Lighter weights render well

### Firefox
- Font smoothing: `-moz-osx-font-smoothing: grayscale`
- Result: Slightly softer text
- Weights appear consistent

### Safari
- Font smoothing: `-webkit-font-smoothing: antialiased`
- Result: Smooth, professional
- Best rendering of lighter weights

## Accessibility

### Readability
✅ 400 weight: Excellent for long-form text
✅ 500 weight: Good for emphasis without strain
✅ 600 weight: Ideal for headings and short text
❌ 700+ weight: Can reduce readability on dark backgrounds

### Contrast Ratios
- White (#FFFFFF) on Dark (#0F0F19) = 19.77:1 (AAA)
- Green (#3CD4AB) on Dark (#0F0F19) = 9.82:1 (AAA)
- Lighter fonts maintain these ratios better

## Quick Fixes

### If text still looks too heavy:
1. Check for nested font-weight classes
2. Inspect element for inherited weights
3. Verify Raleway font is loading correctly
4. Clear browser cache and hard reload

### If text looks too light:
1. Increase specific element to font-medium (500)
2. Use color contrast instead of weight for emphasis
3. Check if font smoothing is too aggressive

## Testing Checklist

```
□ Headers are distinct but not too bold
□ Body text is easy to read
□ Bold elements stand out appropriately
□ Navigation is clear
□ Buttons have good visual weight
□ Tables are readable
□ Charts/labels are clear
□ Mobile view is balanced
□ All browsers render consistently
```

## Recommended Weights by Component

| Component | Element | Weight | Class |
|-----------|---------|--------|-------|
| Header | Logo/Title | 600 | h1 |
| Header | Nav Links | 400 | default |
| Header | Active Nav | 500 | font-medium |
| Dashboard | Card Title | 600 | h3 |
| Dashboard | Card Value | 400 | default |
| Dashboard | Card Metric | 500 | font-medium |
| Sidebar | Menu Item | 400 | default |
| Sidebar | Active Item | 500 | font-medium |
| Modal | Title | 600 | h2/h3 |
| Modal | Body Text | 400 | p |
| Button | Primary | 500 | font-medium |
| Button | Secondary | 400 | default |
| Table | Header | 500 | th font-medium |
| Table | Cell | 400 | td |
| Alert | Title | 600 | font-semibold |
| Alert | Message | 400 | default |

## Performance Tips

1. **Avoid Variable Fonts if not needed** - Single weight font files load faster
2. **Preload Raleway** - Add to index.html for faster rendering
3. **Use System Fonts as Fallback** - `helvetica, arial, sans-serif`
4. **Subset Fonts** - Only load weights you use (400, 500, 600)

## CSS Variables (Future Enhancement)

Consider adding CSS custom properties for consistency:

```css
:root {
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-heading: 600;
}

body {
  font-weight: var(--font-weight-normal);
}

h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-heading);
}
```
