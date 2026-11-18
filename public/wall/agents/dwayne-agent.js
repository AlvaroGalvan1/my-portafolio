/*
 * <dwayne-agent> — Dwayne, a block lineman on watch.
 *
 * One of three agent characters made to stand side by side (Fuego, Hunter,
 * Dwayne): the same 480 x 480 stage, the character on the same baseline at the
 * same height, a soft shadow under it, two eyes, a little hop when selected,
 * then a quiet idle. Dwayne is the block one: pixel blocks, a blue hard hat with a lamp, eyes that keep scanning.
 *
 *   <script src="dwayne-agent.js" defer></script>
 *   <dwayne-agent></dwayne-agent>
 *
 * Hover or click hops it; el.select() does the same. Attribute `static` stops
 * the motion (as does prefers-reduced-motion). Square, 100% of its box,
 * transparent background, pauses off screen. No dependencies.
 */
(() => {
  if (customElements.get("dwayne-agent")) return;

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

  // Dwayne: a block lineman, Minecraft style, on a 20 x 28 pixel grid at 10 units
  // a pixel. Blue hard hat with a lamp that blinks, on watch day and night; its eyes
  // sweep left and right; a two-frame breathing idle, the way game sprites do.
  // Colours from docs/DESIGN.md: blue is Dwayne's, ink and card the calm base.
  const P = 10;
  const OX = S / 2 - 10 * P, OY = BASE - 28 * P;
  const C = {
    blue: "#5189FF", blue2: "#4677E6", brim: "#3B66CC", lamp: "#8DABFE", lampOn: "#EAF0FF",
    ink: "#303030", soft: "#5A574E", card: "#ECEADC", card2: "#DDD9C6",
  };
  const hash = (x, y) => {
    const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const LOOK = [0, 0, -1, -1, -1, 0, 0, 1, 1, 1]; // where the eyes are, every 0.4 s

  function draw(ctx, t, h) {
    const lift = Math.round(h.lift / P) * P; // pixel art moves in whole pixels
    const breath = Math.min(1, (Math.floor(t / 0.7) % 2) + (h.squash > 0.3 ? 1 : 0)); // upper body drops a pixel
    const px = (x, y, w, hh, c, up = true) => {
      ctx.fillStyle = c;
      ctx.fillRect(OX + x * P, OY + y * P - lift + (up ? breath * P : 0), w * P, hh * P);
    };
    const dither = (x0, y0, w, hh, a, b, cut = 0.78) => {
      px(x0, y0, w, hh, a);
      for (let y = y0; y < y0 + hh; y++) for (let x = x0; x < x0 + w; x++) if (hash(x, y) > cut) px(x, y, 1, 1, b);
    };

    // legs and boots (they don't breathe)
    px(5, 22, 4, 5, C.soft, false);
    px(11, 22, 4, 5, C.soft, false);
    px(4, 27, 5, 1, C.ink, false);
    px(11, 27, 5, 1, C.ink, false);

    // arms, body, chest light
    px(1, 15, 2, 6, C.ink);
    px(17, 15, 2, 6, C.ink);
    px(1, 21, 2, 1, C.card);
    px(17, 21, 2, 1, C.card);
    px(3, 15, 14, 7, C.ink);
    dither(4, 15, 12, 6, C.card, C.card2);
    px(9, 17, 2, 2, Math.floor(t / 1.2) % 2 ? C.blue : C.lamp);

    // neck and head
    px(8, 14, 4, 1, C.ink);
    px(3, 5, 14, 9, C.ink);
    dither(4, 5, 12, 8, C.card, C.card2);
    const ex = LOOK[Math.floor(t / 0.4) % LOOK.length];
    const shut = blink(t, 3.8) < 0.5;
    for (const x of [6, 12]) px(x + ex, shut ? 9 : 8, 2, shut ? 1 : 2, C.ink);

    // hard hat, and the lamp that keeps watch
    px(6, 0, 8, 1, C.blue);
    dither(4, 1, 12, 1, C.blue, C.blue2, 0.7);
    dither(3, 2, 14, 2, C.blue, C.blue2, 0.7);
    px(1, 4, 18, 1, C.brim);
    px(9, 1, 2, 2, Math.floor(t * 1.25) % 2 ? C.lampOn : C.lamp);
  }

  class Agent extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = `<style>:host{display:block;width:100%;aspect-ratio:1/1;cursor:pointer}
        canvas{display:block;width:100%;height:100%}</style>
        <canvas role="img" aria-label="Dwayne, a blocky robot lineman in a blue hard hat"></canvas>`;
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

  customElements.define("dwayne-agent", Agent);
})();
