export class CelebrationFX {
  constructor(root) {
    this.root = root;
    this.running = false;
    this.timers = new Set();
    this.balloonCount = 0;
  }

  start({duration = 60000, muted = false} = {}) {
    this.stop(false);
    this.running = true;
    this.muted = muted;
    this.until = performance.now() + duration;
    this.loop();
    this.spawnTimer("burst", () => this.firework(), 700, true);
    this.spawnTimer("balloons", () => this.balloon(), 850, true);
    this.spawnTimer("paper", () => this.paperBurst(), 2800, true);
  }

  loop() {
    if (!this.running) return;
    if (performance.now() >= this.until) { this.stop(false); return; }
    this.raf = requestAnimationFrame(() => this.loop());
  }

  spawnTimer(name, fn, ms, repeat) {
    const run = () => {
      if (!this.running) return;
      fn();
      const id = setTimeout(run, ms * (0.7 + Math.random() * 0.9));
      this.timers.add(id);
    };
    const id = setTimeout(run, ms);
    this.timers.add(id);
  }

  firework() {
    const el = document.createElement("div");
    el.className = "fx-firework";
    el.style.left = `${10 + Math.random() * 80}%`;
    el.style.top = `${12 + Math.random() * 55}%`;
    const dots = 12 + Math.floor(Math.random() * 8);
    for (let i=0;i<dots;i++) {
      const d = document.createElement("i");
      const angle = (Math.PI * 2 * i) / dots;
      d.style.setProperty("--dx", `${Math.cos(angle) * (35 + Math.random()*45)}px`);
      d.style.setProperty("--dy", `${Math.sin(angle) * (35 + Math.random()*45)}px`);
      el.appendChild(d);
    }
    this.root.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }

  balloon() {
    const el = document.createElement("div");
    el.className = "fx-balloon";
    const colors = ["#e85d75","#5da9e8","#f1c75b","#d98be8"];
    el.style.setProperty("--balloon-color", colors[this.balloonCount++ % colors.length]);
    el.style.left = `${-5 + Math.random()*110}%`;
    el.style.setProperty("--drift", `${-40 + Math.random()*80}px`);
    el.style.setProperty("--duration", `${7 + Math.random()*7}s`);
    this.root.appendChild(el);
    setTimeout(() => el.remove(), 15000);
  }

  paperBurst() {
    const el = document.createElement("div");
    el.className = "fx-confetti";
    el.style.left = `${15 + Math.random()*70}%`;
    for(let i=0;i<18;i++) {
      const p = document.createElement("i");
      p.style.setProperty("--x", `${-100+Math.random()*200}px`);
      p.style.setProperty("--r", `${Math.random()*720-360}deg`);
      p.style.setProperty("--d", `${600+Math.random()*700}ms`);
      el.appendChild(p);
    }
    this.root.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }

  stop(fade = true) {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    for (const t of this.timers) clearTimeout(t);
    this.timers.clear();
    if (!fade) this.root.replaceChildren();
    else this.root.classList.add("fx-fading");
    setTimeout(() => this.root.classList.remove("fx-fading"), 900);
  }
}
