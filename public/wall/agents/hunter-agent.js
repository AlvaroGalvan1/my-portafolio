/*
 * <hunter-agent> — Hunter, the robot from the app icon.
 *
 * One of three agent characters made to stand side by side (Fuego, Hunter,
 * Dwayne): the same 480 x 480 stage, the character on the same baseline at the
 * same height, a soft shadow under it, two eyes, a little hop when selected,
 * then a quiet idle. Hunter is the line one: the app icon, black lines, a square head on a tripod.
 *
 *   <script src="hunter-agent.js" defer></script>
 *   <hunter-agent></hunter-agent>
 *
 * Hover or click hops it; el.select() does the same. Attribute `static` stops
 * the motion (as does prefers-reduced-motion). Square, 100% of its box,
 * transparent background, pauses off screen. No dependencies.
 */
(() => {
  if (customElements.get("hunter-agent")) return;

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

  // Hunter: the app icon itself, drawn in its own 64-unit grid (web/app/icon.png)
  // at 5x. The head bobs and tilts on its neck, the antenna sways behind it,
  // the eyes look around and blink. Black lines, nothing else.
  const U = 5;
  const OX = S / 2 - 32 * U, OY = BASE - 60 * U;
  const INK = "#000";

  function draw(ctx, t, h) {
    ctx.save();
    // landing squash, from the feet
    ctx.translate(S / 2, BASE);
    ctx.scale(1 + 0.05 * h.squash, 1 - 0.07 * h.squash);
    ctx.translate(-S / 2, -BASE - h.lift);
    ctx.translate(OX, OY);
    ctx.scale(U, U);
    ctx.fillStyle = INK;

    // tripod: legs, the stub, the bar and the neck stay put
    ctx.beginPath();
    ctx.moveTo(24, 47); ctx.lineTo(26, 47); ctx.lineTo(22, 60); ctx.lineTo(20, 60); ctx.closePath();
    ctx.moveTo(38, 47); ctx.lineTo(40, 47); ctx.lineTo(44, 60); ctx.lineTo(42, 60); ctx.closePath();
    ctx.fill();
    ctx.fillRect(31, 46, 2, 1.2);
    ctx.fillRect(17, 44, 30, 2);
    ctx.fillRect(31, 38.5, 2, 6);

    // head: bobs, and tilts a touch around the neck
    const bob = 0.55 * Math.sin(t * 2.3) + h.lift * 0.012;
    const tilt = 0.035 * Math.sin(t * 1.15);
    ctx.save();
    ctx.translate(32, 39);
    ctx.rotate(tilt);
    ctx.translate(-32, -39 + bob);
    ctx.fillRect(30, 38, 4, 1.2); // neck cap
    // the box: 36 x 28, a 2-unit line
    ctx.fillRect(14, 10, 36, 2);
    ctx.fillRect(14, 36, 36, 2);
    ctx.fillRect(14, 10, 2, 28);
    ctx.fillRect(48, 10, 2, 28);
    // eyes
    const glance = 1.6 * Math.sin(t * 0.8) ** 3;
    const b = blink(t, 3.2);
    for (const ex of [24.5, 39.5]) {
      ctx.beginPath();
      ctx.ellipse(ex + glance, 24.3, 3.6, Math.max(0.35, 3.6 * b), 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // antenna: sways a beat behind the head, and swings back on a hop
    ctx.save();
    ctx.translate(32, 10);
    ctx.rotate(0.12 * Math.sin(t * 2.3 - 0.9) - h.lift * 0.004 + h.squash * 0.15);
    ctx.fillRect(-1, -4.2, 2, 4.4);
    ctx.fillRect(-2, -7, 4, 3);
    ctx.restore();
    ctx.restore();
    ctx.restore();
  }

  class Agent extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = `<style>:host{display:block;width:100%;aspect-ratio:1/1;cursor:pointer}
        canvas{display:block;width:100%;height:100%}</style>
        <canvas role="img" aria-label="Hunter, a square-headed robot on a tripod, drawn in black lines"></canvas>`;
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

  customElements.define("hunter-agent", Agent);
})();
