let currentMusic = null;

export function playOneShot(src, volume = 1) {
  const a = new Audio(src);
  a.volume = volume;
  a.play().catch(() => {});
  return a;
}

/*
=====================================================
START MUSIC

IMPORTANT:
This function ONLY prepares the music.
It does NOT automatically play it.

The Music scene will call audio.play()
when the PLAY button is clicked.
=====================================================
*/

export function startMusic(src) {

  stopMusic(0);

  const a = new Audio(src);

  a.loop = true;
  a.volume = 0.72;

  currentMusic = a;

  return a;
}


/*
=====================================================
STOP MUSIC
=====================================================
*/

export function stopMusic(duration = 1200) {

  const a = currentMusic;

  if (!a) return;

  currentMusic = null;

  const startVol = a.volume;
  const start = performance.now();

  const tick = now => {

    const p = Math.min(
      1,
      (now - start) / duration
    );

    a.volume = startVol * (1 - p);

    if (p < 1) {

      requestAnimationFrame(tick);

    } else {

      a.pause();
      a.currentTime = 0;
      a.volume = 0;

    }

  };

  requestAnimationFrame(tick);
}