// Screenshot helper built on modern-screenshot (SVG foreignObject — supports oklch/oklab).
//
// CARD mode:  full slide render → crop to card → composite on themed background
//             (dark #080612 + stars + radial glow in card's accent color)
// SLIDE mode: desktop-width iframe render → full screenshot, pixel-accurate

// ── canvas helpers ────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(hex.trim());
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [124, 58, 237];
}

function seededRand(seed: number): () => number {
  let s = (seed ^ 0xdeadbeef) >>> 0;
  return () => {
    s = (Math.imul(s ^ (s >>> 16), 0x45d9f3b) ^ ((Math.imul(s ^ (s >>> 16), 0x45d9f3b)) >>> 16)) >>> 0;
    return s / 0xffffffff;
  };
}

/**
 * Composite a card canvas onto a themed background.
 * The `card` canvas contains a BLEED of Math.round(3*scale) pixels on all sides.
 * We account for this to position the border stroke at the actual card edge.
 */
function compositeCardOnBg(
  card: HTMLCanvasElement,
  accent: string,
  paddingPx: number,
  scale: number,
): HTMLCanvasElement {
  const [r, g, b] = hexToRgb(accent);
  const BLEED = Math.round(3 * scale); // must match captureElement crop bleed
  const pad = Math.round(paddingPx * scale);
  const W = card.width + pad * 2;
  const H = card.height + pad * 2;
  const radius = Math.round(24 * scale); // rounded-3xl

  const out = document.createElement("canvas");
  out.width = W;
  out.height = H;
  const ctx = out.getContext("2d");
  if (!ctx) return card;

  // 1 ── dark base
  ctx.fillStyle = "#080612";
  ctx.fillRect(0, 0, W, H);

  // 2 ── procedural stars (deterministic from accent colour)
  const rand = seededRand(r * 657 + g * 311 + b * 197);
  const starCount = Math.round((W * H) / 2200);
  for (let i = 0; i < starCount; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const big = rand() < 0.09;
    const alpha = big ? 0.5 + rand() * 0.4 : 0.12 + rand() * 0.45;
    const sz = (big ? 1.3 : 0.6) * scale;
    ctx.beginPath();
    ctx.arc(x, y, sz, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
    ctx.fill();
  }

  // 3 ── wide ambient accent glow
  const cx = W / 2, cy = H / 2;
  const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.72);
  g1.addColorStop(0, `rgba(${r},${g},${b},0.30)`);
  g1.addColorStop(0.5, `rgba(${r},${g},${b},0.10)`);
  g1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);

  // 4 ── tight core glow (directly behind the card)
  const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.52);
  g2.addColorStop(0, `rgba(${r},${g},${b},0.18)`);
  g2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);

  // 5 ── corner vignette
  const vig = ctx.createRadialGradient(cx, cy, Math.min(W, H) * 0.28, cx, cy, Math.max(W, H) * 0.88);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.58)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // 6 ── card image (the cropped canvas includes BLEED pixels on all sides)
  ctx.drawImage(card, pad, pad);

  // 7 ── explicit card border at actual card position (skipping the bleed margin)
  // The CSS `border: 1px solid accentColor+2e` (18% opacity) is too faint and
  // unreliable in foreignObject. Draw it explicitly so all four sides are visible.
  // The CSS top accent bar is already rendered correctly in the foreignObject image —
  // we do NOT redraw it here to avoid doubling.
  const cardX = pad + BLEED;
  const cardY = pad + BLEED;
  const cardW = card.width - BLEED * 2;
  const cardH = card.height - BLEED * 2;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, radius);
  ctx.strokeStyle = `rgba(${r},${g},${b},0.28)`;
  ctx.lineWidth = Math.ceil(1 * scale);
  ctx.stroke();
  ctx.restore();

  return out;
}

/**
 * Extract all CSS custom properties from live document stylesheets so they
 * can be re-injected into the off-screen iframe (theme vars, etc.).
 */
function extractCSSVars(): string {
  let out = ":root{";
  try {
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) {
          if (
            rule instanceof CSSStyleRule &&
            /^(:root|html)$/i.test(rule.selectorText.trim())
          ) {
            const s = rule.style;
            for (let i = 0; i < s.length; i++) {
              const p = s[i];
              if (p.startsWith("--")) out += `${p}:${s.getPropertyValue(p)};`;
            }
          }
        }
      } catch {
        /* cross-origin stylesheet — skip */
      }
    }
  } catch {
    /* ignore */
  }
  return out + "}";
}

// ── live-DOM capture ──────────────────────────────────────────────────────────

type Opts = { scale?: number; background?: string; cropTo?: HTMLElement | null };

export async function captureElement(root: HTMLElement, opts: Opts = {}): Promise<Blob | null> {
  const { scale = 2.5, background = "#080612", cropTo = null } = opts;
  const restores: Array<() => void> = [];

  const setStyle = (el: HTMLElement, props: Record<string, string>) => {
    const prev: Record<string, string> = {};
    for (const k of Object.keys(props)) {
      prev[k] = el.style.getPropertyValue(k);
      el.style.setProperty(k, props[k]);
    }
    restores.push(() => {
      for (const k of Object.keys(prev)) {
        if (prev[k]) el.style.setProperty(k, prev[k]);
        else el.style.removeProperty(k);
      }
    });
  };

  // Fix rendering in foreignObject:
  //   - Neutralise backdrop-filter (unsupported)
  //   - Lock all flex/grid containers to their live width (prevents layout collapse)
  //   - Apply white-space: nowrap for inline-flex (badges/pills)
  //   - Apply white-space: nowrap + replace spaces with   for single-line leaf text
  //     (  = non-breaking space, respected universally even in SVG foreignObject)
  const nodes: HTMLElement[] = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))];
  for (const el of nodes) {
    const cs = getComputedStyle(el);

    if (cs.backdropFilter !== "none" || cs.getPropertyValue("-webkit-backdrop-filter") !== "none") {
      setStyle(el, { "backdrop-filter": "none", "-webkit-backdrop-filter": "none" });
    }

    const d = cs.display;

    // Lock all flex/grid containers to their live width — foreignObject can shrink them
    if (d === "flex" || d === "grid" || d === "inline-flex" || d === "inline-grid") {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        setStyle(el, { "min-width": `${rect.width}px` });
      }
    }

    if (d === "inline-flex" || d === "inline-grid") {
      // Pills/badges: also force nowrap so text doesn't reflow
      setStyle(el, { "white-space": "nowrap" });
    } else if (d !== "flex" && d !== "grid") {
      // Block/inline elements: nowrap for single-line content
      const text = el.textContent;
      if (text && text.trim() && cs.whiteSpace !== "nowrap") {
        const rawLh = cs.lineHeight;
        const fontSize = parseFloat(cs.fontSize) || 16;
        const parsedLh = parseFloat(rawLh);
        // lineHeight may be unitless (e.g. "1.25") or pixel (e.g. "15px").
        // If < 10, treat as a multiplier and multiply by fontSize.
        const lh = (parsedLh > 0 && parsedLh < 10) ? parsedLh * fontSize : (parsedLh || fontSize * 1.2);
        if (el.clientHeight > 0 && el.clientHeight <= lh * 1.5) {
          setStyle(el, { "white-space": "nowrap" });
          // For leaf text nodes with spaces: replace with non-breaking spaces.
          // This is the most reliable fix —   cannot break across lines in any renderer.
          if (el.childElementCount === 0 && text.includes(" ")) {
            const orig = text;
            el.textContent = orig.replace(/ /g, " ");
            restores.push(() => { el.textContent = orig; });
          }
        }
      }
    }
  }

  try {
    const { domToCanvas } = await import("modern-screenshot");
    const canvas = await domToCanvas(root, {
      backgroundColor: background,
      scale,
      filter: (node) => !(node instanceof Element && node.hasAttribute("data-share-ignore")),
    });

    // Full-slide mode — return as-is
    if (!cropTo) {
      return await new Promise<Blob | null>((res) => canvas.toBlob((b) => res(b), "image/png"));
    }

    // Card mode — crop then composite
    // 3px bleed so the card border/accent bar are never clipped by sub-pixel rounding
    const BLEED = Math.round(3 * scale);
    const r0 = root.getBoundingClientRect();
    const rc = cropTo.getBoundingClientRect();
    const sx = Math.round(Math.max(0, rc.left - r0.left) * scale) - BLEED;
    const sy = Math.round(Math.max(0, rc.top - r0.top) * scale) - BLEED;
    const sw = Math.round(rc.width * scale) + BLEED * 2;
    const sh = Math.round(rc.height * scale) + BLEED * 2;

    const cropped = document.createElement("canvas");
    cropped.width = sw;
    cropped.height = sh;
    const cCtx = cropped.getContext("2d");
    if (cCtx) {
      cCtx.fillStyle = background;
      cCtx.fillRect(0, 0, sw, sh);
      cCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
    }

    const accent = cropTo.getAttribute("data-accent") ?? "#7c3aed";
    const final = compositeCardOnBg(cropped, accent, 68, scale);
    return await new Promise<Blob | null>((res) => final.toBlob((b) => res(b), "image/png"));
  } finally {
    restores.forEach((fn) => fn());
  }
}

// ── desktop-layout capture (for mobile share) ────────────────────────────────
// On phones the live DOM is in mobile layout; Tailwind `lg:` rules don't fire.
// We clone the slide into an off-screen iframe sized to desktop width so that
// lg: breakpoints re-evaluate and produce the desktop appearance.

type DesktopOpts = {
  scale?: number;
  background?: string;
  cropToSelector?: string | null;
  width?: number;
  height?: number;
};

function waitForImages(el: HTMLElement): Promise<void> {
  const imgs = Array.from(el.querySelectorAll("img"));
  return Promise.all(
    imgs.map((img) =>
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise<void>((res) => {
            const done = () => res();
            img.addEventListener("load", done, { once: true });
            img.addEventListener("error", done, { once: true });
            setTimeout(done, 2500);
          }),
    ),
  ).then(() => undefined);
}

export async function captureDesktopElement(
  root: HTMLElement,
  opts: DesktopOpts = {},
): Promise<Blob | null> {
  const {
    scale = 2.5,
    background = "#080612",
    cropToSelector = null,
    width = 1440,
    height = 900,
  } = opts;

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText = `position:fixed;left:0;top:0;width:${width}px;height:${height}px;border:0;opacity:0;pointer-events:none;z-index:-1;`;
  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;
    if (!doc || !win) return null;

    doc.open();
    doc.write("<!DOCTYPE html><html><head><meta charset='utf-8'></head><body></body></html>");
    doc.close();

    // Copy app stylesheets (Tailwind + fonts)
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
      doc.head.appendChild(node.cloneNode(true));
    });

    // Inject CSS custom properties so theme vars work in the iframe
    const varsStyle = doc.createElement("style");
    varsStyle.textContent = extractCSSVars();
    doc.head.appendChild(varsStyle);

    doc.documentElement.style.cssText = `width:${width}px;`;
    doc.body.style.cssText = `margin:0;width:${width}px;min-height:${height}px;background:${background};overflow:hidden;`;

    // Clone slide and force desktop layout
    const clone = root.cloneNode(true) as HTMLElement;
    clone.style.cssText += `position:relative;width:${width}px;height:${height}px;min-height:${height}px;`;
    doc.body.appendChild(clone);

    // Wait: styles parse → media queries re-evaluate → fonts & images load
    await new Promise<void>((r) =>
      win.requestAnimationFrame(() => win.requestAnimationFrame(() => r())),
    );
    try {
      await (doc as Document & { fonts?: FontFaceSet }).fonts?.ready;
    } catch {
      /* fonts optional */
    }
    await waitForImages(clone);
    await new Promise((r) => setTimeout(r, 320));

    // Fix clone elements
    const nodes = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>("*"))];
    for (const el of nodes) {
      // Reset Framer Motion inline opacity so we capture the settled (visible) state
      if (el.style.opacity !== "" && parseFloat(el.style.opacity) < 1) {
        el.style.removeProperty("opacity");
      }
      // Reset FM translate/scale frozen at entry state
      if (el.style.transform && el.style.transform !== "none") {
        if (/translateY\((?:1[5-9]|[2-9]\d)px\)/.test(el.style.transform)) {
          el.style.removeProperty("transform");
        }
      }

      const cs = win.getComputedStyle(el);
      if (
        cs.backdropFilter !== "none" ||
        cs.getPropertyValue("-webkit-backdrop-filter") !== "none"
      ) {
        el.style.setProperty("backdrop-filter", "none");
        el.style.setProperty("-webkit-backdrop-filter", "none");
      }

      const d = cs.display;

      // Lock all flex/grid containers to their live width
      if (d === "flex" || d === "grid" || d === "inline-flex" || d === "inline-grid") {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0) {
          el.style.setProperty("min-width", `${rect.width}px`);
        }
      }

      if (d === "inline-flex" || d === "inline-grid") {
        el.style.setProperty("white-space", "nowrap");
      } else if (d !== "flex" && d !== "grid") {
        const text = el.textContent;
        if (text && text.trim() && cs.whiteSpace !== "nowrap") {
          const rawLh = cs.lineHeight;
        const fontSize = parseFloat(cs.fontSize) || 16;
        const parsedLh = parseFloat(rawLh);
        // lineHeight may be unitless (e.g. "1.25") or pixel (e.g. "15px").
        // If < 10, treat as a multiplier and multiply by fontSize.
        const lh = (parsedLh > 0 && parsedLh < 10) ? parsedLh * fontSize : (parsedLh || fontSize * 1.2);
          if (el.clientHeight > 0 && el.clientHeight <= lh * 1.5) {
            el.style.setProperty("white-space", "nowrap");
            // Replace spaces with non-breaking spaces in leaf text nodes
            if (el.childElementCount === 0 && text.includes(" ")) {
              el.textContent = text.replace(/ /g, " ");
            }
          }
        }
      }
    }

    const cropEl = cropToSelector
      ? clone.querySelector<HTMLElement>(cropToSelector)
      : null;

    const { domToCanvas } = await import("modern-screenshot");
    const canvas = await domToCanvas(clone, {
      backgroundColor: background,
      scale,
      width,
      height,
      filter: (node) => !(node instanceof Element && node.hasAttribute("data-share-ignore")),
    });

    // Full-slide mode — return as-is
    if (!cropEl) {
      return await new Promise<Blob | null>((res) => canvas.toBlob((b) => res(b), "image/png"));
    }

    // Card mode — crop then composite (3px bleed for border safety)
    const BLEED = Math.round(3 * scale);
    const r0 = clone.getBoundingClientRect();
    const rc = cropEl.getBoundingClientRect();
    const sx = Math.round(Math.max(0, rc.left - r0.left) * scale) - BLEED;
    const sy = Math.round(Math.max(0, rc.top - r0.top) * scale) - BLEED;
    const sw = Math.round(rc.width * scale) + BLEED * 2;
    const sh = Math.round(rc.height * scale) + BLEED * 2;

    const cropped = document.createElement("canvas");
    cropped.width = sw;
    cropped.height = sh;
    const cCtx = cropped.getContext("2d");
    if (cCtx) {
      cCtx.fillStyle = background;
      cCtx.fillRect(0, 0, sw, sh);
      cCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
    }

    const accent = cropEl.getAttribute("data-accent") ?? "#7c3aed";
    const final = compositeCardOnBg(cropped, accent, 68, scale);
    return await new Promise<Blob | null>((res) => final.toBlob((b) => res(b), "image/png"));
  } finally {
    iframe.remove();
  }
}
