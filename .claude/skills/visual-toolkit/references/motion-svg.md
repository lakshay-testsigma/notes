# Motion & animated SVG — "alive but calm"

Motion should clarify or delight for a moment, never compete with reading. Default to still visuals; add motion only when it explains behavior (a packet moving, a value filling, a state changing).

## Self-contained animated SVG (no lib, no JS)

SMIL/CSS animations live inside the SVG — safe to inline in MDX, work server-rendered.

```tsx
// packet travelling a path — good for pipelines / data flow
<svg viewBox="0 0 320 120" className="my-6 w-full max-w-md">
  <path id="t" d="M20,100 Q90,10 160,60 T300,30" fill="none"
        stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" opacity="0.4" />
  <circle r="7" fill="var(--chart-1)">
    <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
      <mpath href="#t" />
    </animateMotion>
  </circle>
</svg>
```

Other cheap, useful ones: filling progress `rect` (`<animate attributeName="width" …>`), self-drawing line (`stroke-dashoffset` keyframes), pulsing dots. Keep them short and looped.

## Micro-interactions

- Hover/appear transitions on cards and links: `transition-colors`, small `translate-y`, 150–250ms ease. Subtle.
- Scroll-reveal only if gentle; never block content on animation.
- `tw-animate-css` is installed for small utility animations if needed.
- Reserve richer motion (framer-motion) for a deliberate hero moment, not body content.

## Non-negotiable rules

- **Honor `prefers-reduced-motion`**: wrap or disable every animation.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- No infinite motion in the reading column that pulls the eye off text.
- Motion must read the same in light and dark (use `currentColor` / theme vars).
- If a still diagram explains it, prefer the still diagram.
