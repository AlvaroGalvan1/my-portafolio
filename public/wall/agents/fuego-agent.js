/*
 * <fuego-agent> — Fuego, a ball of orange dots.
 *
 * One of three agent characters made to stand side by side (Fuego, Hunter,
 * Dwayne): the same 480 x 480 stage, the character on the same baseline at the
 * same height, a soft shadow under it, two eyes, a little hop when selected,
 * then a quiet idle. Fuego is the dot one: a sphere of dots in the logo orange, flickering like flame.
 *
 *   <script src="fuego-agent.js" defer></script>
 *   <fuego-agent></fuego-agent>
 *
 * Hover or click hops it; el.select() does the same. Attribute `static` stops
 * the motion (as does prefers-reduced-motion). Square, 100% of its box,
 * transparent background, pauses off screen. No dependencies.
 */
(() => {
  if (customElements.get("fuego-agent")) return;

  const S = 480; // the stage, in stage units
  const BASE = 425; // where every character stands
  const HOP = 0.5; // seconds a hop takes

  // The hop: up and down once, then a small squash on landing. Returns lift (px) and squash (0..1).
  function hop(sel) {
    if (sel < 0 || sel > HOP + 0.25) return { lift: 0, squash: 0 };
    if (sel < HOP) return { lift: 46 * Math.sin((Math.PI * sel) / HOP), squash: 0 };
    const k = (sel - HOP) / 0.25;
    return { lift: 0, squash: Math.sin(Math.PI * k) * (1 - k * 0.3) };
  }
  // Blink: eyes close for ~0.12 s every few seconds (two quick ones now and then).
  function blink(t, every = 3.4) {
    const p = t % every;
    const one = (x) => (x > 0 && x < 0.12 ? Math.abs(Math.cos((Math.PI * x) / 0.12)) : 1);
    return Math.min(one(p - (every - 0.3)), Math.floor(t / every) % 3 === 1 ? one(p - (every - 0.55)) : 1);
  }

  // Fuego: a ball of dots in the logo orange, turning slowly, its top dots
  // licking outward like flame. Two dark eyes, like the other two agents.
  const DEEP = [180, 64, 15]; // #b4400f, ember-deep
  const EMBER = [255, 91, 20]; // #ff5b14, the logo
  const HOT = [255, 150, 70]; // where the light catches it
  const EYE = "#13291f"; // the brand ink
  const R = 120; // the ball's radius: top at the same height as the others
  const N = 900;
  const DOTS = Array.from({ length: N }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / N;
    const r = Math.sqrt(1 - y * y);
    const a = i * 2.399963; // golden angle: an even spread over the sphere
    return [Math.cos(a) * r, y, Math.sin(a) * r, (i * 0.618034) % 1];
  });
  const L = (() => { const v = [-0.45, -0.6, 0.66], n = Math.hypot(...v); return v.map((c) => c / n); })();
  const mix = (a, b, k) => a.map((c, i) => Math.round(c + (b[i] - c) * k));
  const buf = DOTS.map(() => [0, 0, 0, 0, 0]);

  function draw(ctx, t, h) {
    const cx = S / 2;
    const bottom = BASE - 30 - h.lift + 6 * Math.sin(t * 1.9); // it floats
    const sx = 1 + 0.1 * h.squash, sy = 1 - 0.1 * h.squash;
    const cy = bottom - R * sy;
    const rot = t * 0.55, tilt = 0.32;
    const cr = Math.cos(rot), sr = Math.sin(rot), ct = Math.cos(tilt), st = Math.sin(tilt);
    const breathe = 1 + 0.018 * Math.sin(t * 2.2);

    for (let i = 0; i < N; i++) {
      const [x, y, z, ph] = DOTS[i];
      const x1 = x * cr + z * sr, z1 = -x * sr + z * cr;
      const y2 = y * ct - z1 * st, z2 = y * st + z1 * ct;
      // flicker: every dot breathes a little; the upper ones lick outward like flame
      const lick = y2 < 0 ? -y2 * 0.07 * (0.5 + 0.5 * Math.sin(t * 6.5 + ph * 40)) : 0;
      const d = R * breathe * (1 + 0.022 * Math.sin(t * 4.1 + ph * 25) + lick);
      const b = buf[i];
      b[0] = cx + x1 * d * sx;
      b[1] = cy + y2 * d * sy - lick * 30;
      b[2] = z2;
      b[3] = Math.max(0, x1 * L[0] + y2 * L[1] + z2 * L[2]);
      b[4] = ph;
    }
    const order = buf.slice().sort((a, b) => a[2] - b[2]);
    for (const [x, y, z, lam] of order) {
      const depth = (z + 1) / 2;
      const c = mix(mix(DEEP, EMBER, Math.min(1, depth * 1.6)), HOT, lam ** 4 * depth * 0.8);
      ctx.globalAlpha = 0.3 + 0.7 * depth;
      ctx.fillStyle = `rgb(${c})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.8 + 3.9 * depth ** 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // the eyes stay on the viewer while the dots turn under them
    const glance = 9 * Math.sin(t * 0.8) ** 3;
    const eh = 36 * blink(t, 3.6) * sy;
    ctx.fillStyle = EYE;
    for (const ex of [-36, 36]) {
      ctx.beginPath();
      ctx.roundRect(cx + ex + glance - 9, cy - 4 - eh / 2, 18, Math.max(3, eh), 9);
      ctx.fill();
    }
  }

  class Agent extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = `<style>:host{display:block;width:100%;aspect-ratio:1/1;cursor:pointer}
        canvas{display:block;width:100%;height:100%}</style>
        <canvas role="img" aria-label="Fuego, a ball of orange dots with two eyes"></canvas>`;
      this.canvas = root.querySelector("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.t0 = performance.now();
      this.selAt = 0; // hop once on arrival
      this.visible = true;
      this.loop = this.loop.bind(this);
    }
    get still() {
      return this.hasAttribute("static") || matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    get now() {
      return (performance.now() - this.t0) / 1000;
    }
    connectedCallback() {
      this.ro = new ResizeObserver(() => this.size());
      this.ro.observe(this);
      this.io = new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; this.play(); });
      this.io.observe(this);
      this.onSelect = () => this.select();
      this.addEventListener("pointerenter", this.onSelect);
      this.addEventListener("click", this.onSelect);
      this.size();
      this.play();
    }
    disconnectedCallback() {
      this.ro?.disconnect();
      this.io?.disconnect();
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
    select() {
      if (this.now - this.selAt > HOP + 0.25) this.selAt = this.now;
      this.play();
    }
    size() {
      const w = this.getBoundingClientRect().width;
      if (!w) return;
      const px = Math.round(w * Math.min(2, devicePixelRatio || 1));
      this.canvas.width = this.canvas.height = px;
      this.render(this.still ? 1.5 : this.now, this.still ? -1 : this.now - this.selAt);
    }
    play() {
      if (this.still) return this.render(1.5, -1);
      if (!this.raf && this.visible && !this.paused) this.raf = requestAnimationFrame(this.loop);
    }
    pause() {
      this.paused = true;
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
    loop() {
      this.raf = 0;
      if (!this.visible || this.still || this.paused) return;
      this.render(this.now, this.now - this.selAt);
      this.raf = requestAnimationFrame(this.loop);
    }
    /** Draw the frame at time t (s), sel seconds after the last select (negative: none). */
    render(t, sel) {
      const ctx = this.ctx;
      const k = this.canvas.width / S;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.setTransform(k, 0, 0, k, 0, 0);
      const h = hop(sel);
      // the shared shadow: shrinks and fades as the character lifts
      const f = 1 - h.lift / 120;
      ctx.fillStyle = `rgba(0,0,0,${0.11 * f})`;
      ctx.beginPath();
      ctx.ellipse(S / 2, BASE + 4, 96 * f * (1 + 0.08 * h.squash), 11 * f, 0, 0, Math.PI * 2);
      ctx.fill();
      draw(ctx, t, h);
    }
  }

  customElements.define("fuego-agent", Agent);
})();
