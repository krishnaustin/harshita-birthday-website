export const wait = ms => new Promise(r => setTimeout(r, ms));

export function typeText(el, text, {speed=22}={}) {
  el.textContent = "";
  let i = 0, cancelled = false;
  const step = () => {
    if (cancelled) return;
    if (i >= text.length) return;
    el.textContent += text[i++];
    const jitter = text[i-1] === " " ? speed*0.35 : speed*(0.55 + Math.random()*0.8);
    setTimeout(step, jitter);
  };
  step();
  return () => { cancelled = true; };
}

export function safeAsset(src, {kind="img", label="RESOURCE"}={}) {
  return new Promise(resolve => {
    if (kind === "img") {
      const img = new Image();
      img.onload = () => resolve({ok:true, element:img});
      img.onerror = () => resolve({ok:false});
      img.src = src;
    } else if (kind === "video") {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => resolve({ok:true, element:v});
      v.onerror = () => resolve({ok:false});
      v.src = src;
    } else resolve({ok:true});
  });
}

export function resourceFallback(label) {
  const el = document.createElement("div");
  el.className = "resource-fallback";
  el.textContent = `[${label}]`;
  return el;
}
