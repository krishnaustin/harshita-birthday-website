let currentMusic = null;

export function playOneShot(src, volume = 1) {
  const a = new Audio(src);
  a.volume = volume;
  a.play().catch(() => {});
  return a;
}

export function startMusic(src) {
  stopMusic(700);
  const a = new Audio(src);
  a.loop = true;
  a.volume = 0;
  currentMusic = a;
  a.play().catch(() => {});
  const start = performance.now();
  const tick = now => {
    if (a !== currentMusic) return;
    const p = Math.min(1, (now - start) / 1200);
    a.volume = 0.72 * p;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return a;
}

export function stopMusic(duration = 1200) {
  const a = currentMusic;
  if (!a) return;
  currentMusic = null;
  const startVol = a.volume;
  const start = performance.now();
  const tick = now => {
    const p = Math.min(1, (now - start) / duration);
    a.volume = startVol * (1 - p);
    if (p < 1) requestAnimationFrame(tick);
    else { a.pause(); a.currentTime = 0; }
  };
  requestAnimationFrame(tick);
}
