// The FUEGO wordmark, as an SVG string: cream letters in an orange box.
// Ported from ~/Projects/fuego-earth/src/components/Logo.js.
type Corners = [number, number, number, number];

export function fuegoLogo(): string {
  const g = { W: 34, H: 100, S: 12, GAP: 8, R: 9, r: 4, BAR: 44 };
  const rect = (x: number, y: number, w: number, h: number, [tl, tr, br, bl]: Corners = [0, 0, 0, 0]) =>
    `M${x + tl} ${y}H${x + w - tr}` + (tr ? `A${tr} ${tr} 0 0 1 ${x + w} ${y + tr}` : "") +
    `V${y + h - br}` + (br ? `A${br} ${br} 0 0 1 ${x + w - br} ${y + h}` : "") +
    `H${x + bl}` + (bl ? `A${bl} ${bl} 0 0 1 ${x} ${y + h - bl}` : "") +
    `V${y + tl}` + (tl ? `A${tl} ${tl} 0 0 1 ${x + tl} ${y}` : "") + "Z";
  const hole = (x: number, y: number, w: number, h: number, [tl, tr, br, bl]: Corners = [0, 0, 0, 0]) =>
    `M${x + tl} ${y}` + (tl ? `A${tl} ${tl} 0 0 0 ${x} ${y + tl}` : "") +
    `V${y + h - bl}` + (bl ? `A${bl} ${bl} 0 0 0 ${x + bl} ${y + h}` : "") +
    `H${x + w - br}` + (br ? `A${br} ${br} 0 0 0 ${x + w} ${y + h - br}` : "") +
    `V${y + tr}` + (tr ? `A${tr} ${tr} 0 0 0 ${x + w - tr} ${y}` : "") + "Z";
  const L: Record<string, (x: number) => string> = {
    F: (x) => rect(x, 0, g.S, g.H, [g.R, 0, 0, 0]) + rect(x, 0, g.W, g.S, [g.R, 0, 0, 0]) + rect(x, g.BAR, g.W * 0.82, g.S),
    U: (x) => rect(x, 0, g.W, g.H, [0, 0, g.R, g.R]) + hole(x + g.S, 0, g.W - 2 * g.S, g.H - g.S, [0, 0, g.r, g.r]),
    E: (x) => rect(x, 0, g.S, g.H, [g.R, 0, 0, g.R]) + rect(x, 0, g.W, g.S, [g.R, 0, 0, 0]) + rect(x, g.BAR, g.W * 0.88, g.S) + rect(x, g.H - g.S, g.W, g.S, [0, 0, 0, g.R]),
    G: (x) =>
      rect(x, 0, g.S, g.H, [g.R, 0, 0, g.R]) + rect(x, 0, g.W, g.S, [g.R, g.R, 0, 0]) +
      rect(x + g.W - g.S, 0, g.S, g.S + g.H * 0.1, [0, g.R, 0, 0]) + rect(x, g.H - g.S, g.W, g.S, [0, 0, g.R, g.R]) +
      rect(x + g.W - g.S, g.BAR, g.S, g.H - g.BAR, [0, 0, g.R, 0]) + rect(x + g.W * 0.44, g.BAR, g.W * 0.56, g.S),
    O: (x) => rect(x, 0, g.W, g.H, [g.R, g.R, g.R, g.R]) + hole(x + g.S, g.S, g.W - 2 * g.S, g.H - 2 * g.S, [g.r, g.r, g.r, g.r]),
  };
  const bw = 5 * g.W + 4 * g.GAP + 32;
  const bh = g.H + 28;
  const letters = [..."FUEGO"].map((c, i) => `<path d="${L[c](i * (g.W + g.GAP))}"/>`).join("");
  return `<svg viewBox="0 0 ${bw} ${bh}" role="img" aria-label="FUEGO"><rect width="${bw}" height="${bh}" rx="24" fill="#ff5b14"/><g fill="#fff7ec" transform="translate(16 14)">${letters}</g></svg>`;
}
