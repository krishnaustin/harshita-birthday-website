import {birthdayConfig as C} from "./config.js";
import {wait, typeText, safeAsset, resourceFallback} from "./animations.js";
import {playOneShot, startMusic, stopMusic} from "./audio.js";
import {CelebrationFX} from "./effects.js";

export const SCENES = {
  QUESTION:"question", CURTAINS:"curtains", BULB:"bulb", MUSIC:"music",
  AGE:"age", CELEBRATION:"celebration", CALM:"calm", LETTER:"letter", FINAL:"final"
};

export class SceneManager {
  constructor(root) {
    this.root = root;
    this.current = null;
    this.cleanup = [];
    this.music = null;
  }

  async go(scene) {
    this.cleanup.forEach(fn => { try { fn(); } catch {} });
    this.cleanup = [];
    this.current = scene;
    this.root.className = `scene scene-${scene}`;
    this.root.replaceChildren();
    const fn = {
      [SCENES.QUESTION]:this.question,
      [SCENES.CURTAINS]:this.curtains,
      [SCENES.BULB]:this.bulb,
      [SCENES.MUSIC]:this.musicScene,
      [SCENES.AGE]:this.age,
      [SCENES.CELEBRATION]:this.celebration,
      [SCENES.CALM]:this.calm,
      [SCENES.LETTER]:this.letter,
      [SCENES.FINAL]:this.final
    }[scene];
    await fn.call(this);
  }

  on(el, event, fn) {
    el.addEventListener(event, fn);
    this.cleanup.push(() => el.removeEventListener(event, fn));
  }

  add(el) { this.root.appendChild(el); return el; }

  shell(kicker, title) {
    const s = document.createElement("section");
    s.className = "scene-shell";
    if(kicker) { const k=document.createElement("div"); k.className="kicker"; k.textContent=kicker; s.appendChild(k); }
    if(title) { const h=document.createElement("h1"); h.textContent=title; s.appendChild(h); }
    return this.add(s);
  }

  button(text, cls="") {
    const b=document.createElement("button");
    b.className=`premium-btn ${cls}`; b.type="button"; b.textContent=text;
    return b;
  }

async question() {
  const s = this.shell("A tiny mystery", "Yaardu birthday?");

  const sub = document.createElement("p");
  sub.className = "subtle";
  sub.textContent = "Choose carefully.";
  s.appendChild(sub);

  const grid = document.createElement("div");
  grid.className = "answer-grid";
  s.appendChild(grid);

  C.answerOptions.forEach(option => {
    const b = this.button(option);
    grid.appendChild(b);

    b.addEventListener("click", () => {

      // WRONG ANSWERS — SHAKE EVERY TIME
      if (option !== "Nindu") {
        b.classList.remove("wrong");
        void b.offsetWidth;
        b.classList.add("wrong");
        return;
      }

      // ==========================
      // CORRECT ANSWER - NINDU
      // ==========================

      // KEEP YOUR EXISTING NINDU CODE HERE
      // Remove question screen
      this.root.innerHTML = "";

      const videoScreen = document.createElement("div");
      videoScreen.style.width = "100%";
      videoScreen.style.height = "100%";
      videoScreen.style.display = "flex";
      videoScreen.style.flexDirection = "column";
      videoScreen.style.alignItems = "center";
      videoScreen.style.justifyContent = "center";
      videoScreen.style.padding = "30px";
      videoScreen.style.boxSizing = "border-box";

      const title = document.createElement("h1");
      title.textContent = "YESSS! YOU GOT IT RIGHT! 🐱";
      title.style.marginBottom = "20px";

      const video = document.createElement("video");

      video.src = "assets/videos/cat-correct-answer.mp4";
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.loop = false;

      video.style.width = "min(90vw, 800px)";
      video.style.maxHeight = "65vh";
      video.style.borderRadius = "20px";
      video.style.display = "block";

      const nextBtn = document.createElement("button");
      nextBtn.textContent = "NEXT";
      nextBtn.style.marginTop = "25px";

      videoScreen.appendChild(title);
      videoScreen.appendChild(video);
      videoScreen.appendChild(nextBtn);

      this.root.appendChild(videoScreen);

      // Start the video
      video.play().catch(error => {
        console.log("Autoplay blocked. Press the PLAY button.", error);
      });

      // NEXT -> CURTAINS
      nextBtn.addEventListener("click", async () => {
        video.pause();
        await this.go(SCENES.CURTAINS);
      });
    });
  });
}


async correctAnswer() {
  // =====================================================
  // CAT VIDEO PAGE
  // =====================================================

  // Allow the browser page to scroll
  document.documentElement.style.overflowY = "auto";
  document.documentElement.style.overflowX = "hidden";

  document.body.style.overflowY = "auto";
  document.body.style.overflowX = "hidden";

  // Clear the question screen
  this.root.innerHTML = "";

  // Remove height restrictions from the scene
  this.root.style.height = "auto";
  this.root.style.minHeight = "100vh";
  this.root.style.maxHeight = "none";
  this.root.style.overflow = "visible";
  this.root.style.position = "relative";


  // =====================================================
  // MAIN CAT PAGE
  // =====================================================

  const page = document.createElement("div");

  page.style.width = "100%";
  page.style.minHeight = "100vh";
  page.style.boxSizing = "border-box";

  page.style.display = "flex";
  page.style.flexDirection = "column";
  page.style.alignItems = "center";

  page.style.padding =
    "45px 20px 100px";


  // =====================================================
  // TITLE
  // =====================================================

  const title = document.createElement("h1");

  title.textContent =
    "YESSS! YOU GOT IT RIGHT! 🐱";

  title.style.width = "100%";
  title.style.textAlign = "center";

  title.style.margin =
    "0 0 28px";

  title.style.fontSize =
    "clamp(30px, 5vw, 64px)";

  title.style.lineHeight = "1.1";

  title.style.fontWeight = "500";

  page.appendChild(title);


  // =====================================================
  // VIDEO CARD
  // =====================================================

  const videoCard =
    document.createElement("div");

  videoCard.style.width =
    "min(900px, 92vw)";

  videoCard.style.padding =
    "10px";

  videoCard.style.boxSizing =
    "border-box";

  videoCard.style.borderRadius =
    "28px";

  videoCard.style.background =
    "rgba(255,255,255,0.06)";

  videoCard.style.border =
    "1px solid rgba(255,255,255,0.15)";

  videoCard.style.boxShadow =
    "0 30px 90px rgba(0,0,0,0.65)";

  videoCard.style.flexShrink = "0";


  // =====================================================
  // CAT VIDEO
  // =====================================================

  const video =
    document.createElement("video");

  video.src =
    "assets/videos/cat-correct-answer.mp4";

  video.autoplay = true;
  video.controls = true;
  video.playsInline = true;
  video.preload = "auto";
  video.loop = false;

  video.style.display = "block";
  video.style.width = "100%";
  video.style.height = "auto";

  video.style.maxHeight =
    "70vh";

  video.style.objectFit =
    "contain";

  video.style.borderRadius =
    "20px";

  video.style.background =
    "#000";

  videoCard.appendChild(video);

  page.appendChild(videoCard);


  // =====================================================
  // MESSAGE
  // =====================================================

  const message =
    document.createElement("p");

  message.textContent =
    "Okay... that was worth getting the answer right 😭😂";

  message.style.margin =
    "25px 0 10px";

  message.style.textAlign =
    "center";

  message.style.fontSize =
    "15px";

  message.style.opacity =
    "0.65";

  page.appendChild(message);


  // =====================================================
  // SCROLL INDICATOR
  // =====================================================

  const scrollText =
    document.createElement("div");

  scrollText.innerHTML =
    "SCROLL DOWN <span>↓</span>";

  scrollText.style.margin =
    "18px 0 30px";

  scrollText.style.fontSize =
    "11px";

  scrollText.style.letterSpacing =
    "3px";

  scrollText.style.opacity =
    "0.5";

  scrollText.style.animation =
    "catScrollDown 1.8s ease-in-out infinite";

  page.appendChild(scrollText);


  // =====================================================
  // PREMIUM NEXT AREA
  // =====================================================

  const nextArea =
    document.createElement("div");

  nextArea.style.display =
    "flex";

  nextArea.style.flexDirection =
    "column";

  nextArea.style.alignItems =
    "center";

  nextArea.style.width =
    "100%";

  nextArea.style.padding =
    "10px 0 20px";


  // =====================================================
  // PREMIUM NEXT BUTTON
  // =====================================================

  const nextBtn =
    document.createElement("button");

  nextBtn.type = "button";

  nextBtn.innerHTML = `
    <span class="cat-next-text">
      NEXT
    </span>

    <span class="cat-next-line"></span>

    <span class="cat-next-arrow">
      →
    </span>
  `;


  // Button size
  nextBtn.style.width =
    "280px";

  nextBtn.style.height =
    "76px";

  // Shape
  nextBtn.style.border =
    "1px solid rgba(255,255,255,0.35)";

  nextBtn.style.borderRadius =
    "18px";

  // Background
  nextBtn.style.background =
    "rgba(255,255,255,0.08)";

  nextBtn.style.backdropFilter =
    "blur(15px)";

  // Text
  nextBtn.style.color =
    "#ffffff";

  nextBtn.style.fontSize =
    "15px";

  nextBtn.style.fontWeight =
    "600";

  nextBtn.style.letterSpacing =
    "5px";

  // Layout
  nextBtn.style.display =
    "flex";

  nextBtn.style.alignItems =
    "center";

  nextBtn.style.justifyContent =
    "center";

  nextBtn.style.gap =
    "16px";

  nextBtn.style.position =
    "relative";

  nextBtn.style.cursor =
    "pointer";

  nextBtn.style.zIndex =
    "100";

  // Shadow
  nextBtn.style.boxShadow =
    "0 18px 60px rgba(0,0,0,0.45)";

  // Animation
  nextBtn.style.transition =
    "all 0.35s ease";


  // =====================================================
  // ARROW
  // =====================================================

  const arrow =
    nextBtn.querySelector(
      ".cat-next-arrow"
    );

  arrow.style.fontSize =
    "28px";

  arrow.style.fontWeight =
    "300";

  arrow.style.transition =
    "transform 0.35s ease";


  // =====================================================
  // SMALL LINE
  // =====================================================

  const line =
    nextBtn.querySelector(
      ".cat-next-line"
    );

  line.style.width =
    "1px";

  line.style.height =
    "22px";

  line.style.background =
    "rgba(255,255,255,0.35)";


  // =====================================================
  // HOVER
  // =====================================================

  nextBtn.addEventListener(
    "mouseenter",
    () => {

      nextBtn.style.transform =
        "translateY(-5px)";

      nextBtn.style.background =
        "rgba(255,255,255,0.14)";

      nextBtn.style.borderColor =
        "rgba(255,255,255,0.65)";

      nextBtn.style.boxShadow =
        "0 25px 75px rgba(255,255,255,0.12)";

      arrow.style.transform =
        "translateX(8px)";
    }
  );


  nextBtn.addEventListener(
    "mouseleave",
    () => {

      nextBtn.style.transform =
        "translateY(0)";

      nextBtn.style.background =
        "rgba(255,255,255,0.08)";

      nextBtn.style.borderColor =
        "rgba(255,255,255,0.35)";

      nextBtn.style.boxShadow =
        "0 18px 60px rgba(0,0,0,0.45)";

      arrow.style.transform =
        "translateX(0)";
    }
  );


  // =====================================================
  // TOUCH PRESS
  // =====================================================

  nextBtn.addEventListener(
    "pointerdown",
    () => {
      nextBtn.style.transform =
        "scale(0.96)";
    }
  );

  nextBtn.addEventListener(
    "pointerup",
    () => {
      nextBtn.style.transform =
        "scale(1)";
    }
  );


  nextArea.appendChild(nextBtn);


  // =====================================================
  // CAPTION
  // =====================================================

  const caption =
    document.createElement("div");

  caption.textContent =
    "THE SURPRISE CONTINUES";

  caption.style.marginTop =
    "16px";

  caption.style.fontSize =
    "10px";

  caption.style.letterSpacing =
    "4px";

  caption.style.opacity =
    "0.4";

  nextArea.appendChild(caption);

  page.appendChild(nextArea);


  // =====================================================
  // SCROLL ANIMATION
  // =====================================================

  const style =
    document.createElement("style");

  style.textContent = `
    @keyframes catScrollDown {
      0%, 100% {
        transform: translateY(0);
        opacity: 0.35;
      }

      50% {
        transform: translateY(8px);
        opacity: 0.8;
      }
    }
  `;

  document.head.appendChild(style);


  // =====================================================
  // ADD PAGE
  // =====================================================

  this.root.appendChild(page);


  // =====================================================
  // PLAY VIDEO
  // =====================================================

  video.load();

  try {
    await video.play();
  } catch (error) {
    console.log(
      "Autoplay blocked. Press PLAY on the video."
    );
  }


  // =====================================================
  // NEXT → CURTAINS
  // =====================================================

  nextBtn.addEventListener(
    "click",
    async () => {

      video.pause();

      nextBtn.disabled = true;

      nextBtn.style.opacity =
        "0.5";

      await this.go(
        SCENES.CURTAINS
      );
    }
  );
}

async curtains() {
  // ==========================================
  // THEATER CURTAINS SCENE
  // ==========================================

  const s = this.shell("", "");

  s.classList.add("curtain-stage");


  // ------------------------------------------
  // BLACK STAGE
  // ------------------------------------------

  const stage = document.createElement("div");
  stage.className = "theater-stage";

  this.root.appendChild(stage);


  // ------------------------------------------
  // LEFT CURTAIN
  // ------------------------------------------

  const left = document.createElement("div");
  left.className = "curtain curtain-left";

  left.style.backgroundImage =
    `url("${C.assets.curtainLeft}")`;


  // ------------------------------------------
  // RIGHT CURTAIN
  // ------------------------------------------

  const right = document.createElement("div");
  right.className = "curtain curtain-right";

  right.style.backgroundImage =
    `url("${C.assets.curtainRight}")`;

  this.root.appendChild(left);
  this.root.appendChild(right);


  // ==========================================
  // CURTAIN CENTER TEXT
  // ==========================================

  const curtainText = document.createElement("div");
  curtainText.className = "curtain-center-text";

  const curtainTitle = document.createElement("h1");
  curtainTitle.textContent = "THE STAGE IS READY";

  const curtainSubtitle = document.createElement("p");
  curtainSubtitle.textContent =
    "Something beautiful is about to begin.";

  curtainText.appendChild(curtainTitle);
  curtainText.appendChild(curtainSubtitle);

  this.root.appendChild(curtainText);


  // ==========================================
  // OPEN BUTTON
  // ==========================================

  const b = this.button(
    "OPEN THE CURTAINS",
    "curtain-btn"
  );

  this.add(b);


  // ------------------------------------------
  // INITIAL STATE
  // ------------------------------------------

  requestAnimationFrame(() => {
    left.classList.add("curtain-ready");
    right.classList.add("curtain-ready");

    // Show center text
    curtainText.classList.add(
      "curtain-center-text-visible"
    );

    // Show button
    b.classList.add(
      "curtain-button-visible"
    );
  });


  // ------------------------------------------
  // OPEN CURTAINS
  // ------------------------------------------

  this.on(b, "click", async () => {

    if (b.disabled) return;

    b.disabled = true;


    // Hide button
    b.classList.add(
      "curtain-button-hide"
    );


    // Hide center text
    curtainText.classList.add(
      "curtain-center-text-hide"
    );


    // Small dramatic pause
    await wait(450);


    // Slowly open both curtains
    left.classList.add("open");
    right.classList.add("open");


    // Slowly fade in black background
    stage.classList.add(
      "stage-reveal"
    );


    // Let the 3.5 second animation finish
    await wait(3500);


    // Move to existing bulb scene
    await this.go(
      SCENES.BULB
    );

  });
}

  async bulb() {
  // ==========================================
  // BULB SCENE
  // ==========================================

  const s = this.shell(
    "THE STAGE WENT QUIET",
    "WHY IT'S DARK?"
  );

  s.classList.add("bulb-copy");


  // ==========================================
  // PREMIUM LIGHT MESSAGE
  // ==========================================

  const lightMessage = document.createElement("div");

  lightMessage.className = "light-on-message";

  lightMessage.innerHTML = `
    <div class="light-message-small">
      AND THEN...
    </div>

    <div class="light-message-main">
      LET THERE BE LIGHT.
    </div>

    <div class="light-message-sub">
      Some moments are meant to glow.
    </div>
  `;

  this.root.appendChild(lightMessage);


  // ==========================================
  // CEILING HANGING LIGHTS
  // ==========================================

  const ceiling = document.createElement("div");

  ceiling.className = "ceiling-lights";

  const positions = [
    "light-one",
    "light-two",
    "light-three",
    "light-four",
    "light-five"
  ];

  positions.forEach(className => {

    const light = document.createElement("div");

    light.className =
      `hanging-light ${className}`;

    const wire = document.createElement("div");

    wire.className = "light-wire";

    const glow = document.createElement("div");

    glow.className = "ceiling-bulb";

    light.appendChild(wire);
    light.appendChild(glow);

    ceiling.appendChild(light);
  });

  this.root.appendChild(ceiling);


  // ==========================================
  // MAIN HANGING BULB
  // ==========================================

  const mainBulb = document.createElement("button");

  mainBulb.type = "button";

  mainBulb.className =
    "main-hanging-bulb";

  mainBulb.setAttribute(
    "aria-label",
    "Turn the light on"
  );


  // ------------------------------------------
  // MAIN BULB WIRE
  // ------------------------------------------

  const mainWire =
    document.createElement("span");

  mainWire.className =
    "main-bulb-wire";


  // ------------------------------------------
  // SOCKET
  // ------------------------------------------

  const socket =
    document.createElement("span");

  socket.className =
    "bulb-socket";


  // ------------------------------------------
  // GLASS
  // ------------------------------------------

  const glass =
    document.createElement("span");

  glass.className =
    "bulb-glass";


  // ------------------------------------------
  // FILAMENT
  // ------------------------------------------

  const filament =
    document.createElement("span");

  filament.className =
    "bulb-filament";

  glass.appendChild(filament);

  socket.appendChild(glass);


  // ------------------------------------------
  // LIGHT HALO
  // ------------------------------------------

  const halo =
    document.createElement("span");

  halo.className =
    "bulb-halo";


  // ------------------------------------------
  // ASSEMBLE BULB
  // ------------------------------------------

  mainBulb.appendChild(mainWire);
  mainBulb.appendChild(socket);
  mainBulb.appendChild(halo);

  this.root.appendChild(mainBulb);


  // ==========================================
  // GOLDEN GLITTER
  // ==========================================

  const glitter =
    document.createElement("div");

  glitter.className =
    "golden-glitter";

  glitter.setAttribute(
    "aria-hidden",
    "true"
  );

  this.root.appendChild(glitter);


  // ==========================================
  // CREATE GLITTER PARTICLES
  // ==========================================

  const glitterCount = 55;

  for (let i = 0; i < glitterCount; i++) {

    const particle =
      document.createElement("span");

    particle.className =
      "gold-particle";

    particle.style.setProperty(
      "--x",
      `${Math.random() * 100}%`
    );

    particle.style.setProperty(
      "--delay",
      `${Math.random() * 5}s`
    );

    particle.style.setProperty(
      "--duration",
      `${4 + Math.random() * 5}s`
    );

    particle.style.setProperty(
      "--size",
      `${2 + Math.random() * 3}px`
    );

    particle.style.setProperty(
      "--drift",
      `${-40 + Math.random() * 80}px`
    );

    glitter.appendChild(particle);
  }


  // ==========================================
  // LIGHT CONTROL
  // ==========================================

  const control = this.button(
    "TURN ON LIGHT",
    "light-toggle-btn"
  );

  this.add(control);


  // ==========================================
  // NEXT BUTTON
  // ==========================================

  const nextButton = this.button(
    "NEXT",
    "bulb-next-btn"
  );

  this.add(nextButton);


  // Hide NEXT initially
  nextButton.classList.add(
    "bulb-next-hidden"
  );


  // ==========================================
  // LIGHT STATE
  // ==========================================

  let lightOn = false;


  // ==========================================
  // TURN LIGHT ON / OFF
  // ==========================================

  this.on(control, "click", () => {

    lightOn = !lightOn;


    if (lightOn) {

      // Turn everything ON
      this.root.classList.add(
        "lights-on"
      );

      mainBulb.classList.add(
        "bulb-on"
      );


      // Change button
      control.textContent =
        "TURN OFF LIGHT";


      // Update accessibility
      control.setAttribute(
        "aria-label",
        "Turn the light off"
      );

      mainBulb.setAttribute(
        "aria-label",
        "Turn the light off"
      );


      // Show NEXT
      nextButton.classList.remove(
        "bulb-next-hidden"
      );

    } else {

      // Turn everything OFF
      this.root.classList.remove(
        "lights-on"
      );

      mainBulb.classList.remove(
        "bulb-on"
      );


      // Restore button
      control.textContent =
        "TURN ON LIGHT";


      control.setAttribute(
        "aria-label",
        "Turn the light on"
      );

      mainBulb.setAttribute(
        "aria-label",
        "Turn the light on"
      );


      // Hide NEXT again
      nextButton.classList.add(
        "bulb-next-hidden"
      );
    }

  });


  // ==========================================
  // CLICK THE BULB ITSELF
  // ==========================================

  this.on(mainBulb, "click", () => {

    control.click();

  });


  // ==========================================
  // NEXT
  // ==========================================

  this.on(nextButton, "click", async () => {

    await this.go(
      SCENES.MUSIC
    );

  });
}

  async musicScene() {

  /* =========================================
     MUSIC
  ========================================= */

  if (!this.music) {
  this.music = new Audio(
    encodeURI("assets/audio/HBD song.mp3")
  );

  this.music.preload = "auto";
  this.music.loop = true;
  this.music.volume = 1;
}

const audio = this.music;

audio.preload = "auto";
audio.loop = true;
audio.volume = 1;

  /* =========================================
     ROOT
  ========================================= */

  this.root.innerHTML = "";

  this.root.style.position = "relative";
  this.root.style.width = "100%";
  this.root.style.minHeight = "100svh";
  this.root.style.overflow = "hidden";
  this.root.style.background =
    "radial-gradient(circle at 50% 42%, #21161d 0%, #0c080c 48%, #000 100%)";
  this.root.style.color = "#f7f1f3";

  /* =========================================
     MUSIC STYLES
  ========================================= */

  const style = document.createElement("style");

  style.textContent = `

    .birthday-music-stage {
      position: absolute;
      inset: 0;

      display: flex;
      flex-direction: column;
      align-items: center;

      text-align: center;

      padding-top: 13vh;

      box-sizing: border-box;

      z-index: 10;
    }

    /* soft center glow */

    .birthday-music-stage::before {
      content: "";

      position: absolute;

      left: 50%;
      top: 45%;

      width: 620px;
      height: 620px;

      transform: translate(-50%, -50%);

      border-radius: 50%;

      background:
        radial-gradient(
          circle,
          rgba(210,130,165,.10) 0%,
          rgba(150,80,115,.045) 38%,
          transparent 72%
        );

      pointer-events: none;

      z-index: -1;
    }

    /* kicker */

    .birthday-music-kicker {

      color: rgba(235,218,226,.58);

      font-family: Inter, system-ui, sans-serif;

      font-size: 10px;
      font-weight: 600;

      letter-spacing: .38em;

      text-transform: uppercase;

      margin-bottom: 18px;

      opacity: 0;

      animation:
        musicFadeIn
        1.2s
        cubic-bezier(.22,.61,.36,1)
        .2s
        forwards;
    }

    /* title */

    .birthday-music-title {

      margin: 0;

      color: #f8f2f4;

      font-family:
        "Cormorant Garamond",
        Georgia,
        serif;

      font-size: clamp(4rem, 8vw, 7.5rem);

      font-weight: 400;

      line-height: .84;

      letter-spacing: .025em;

      opacity: 0;

      transform:
        translateY(30px);

      filter: blur(8px);

      animation:
        musicTitle
        1.5s
        cubic-bezier(.22,.61,.36,1)
        .35s
        forwards;
    }

    .birthday-music-title span {
      font-style: italic;
    }

    /* subtitle */

    .birthday-music-subtitle {

      margin: 28px 0 0;

      color: rgba(228,213,220,.62);

      font-family:
        Inter,
        system-ui,
        sans-serif;

      font-size: 11px;

      letter-spacing: .16em;

      opacity: 0;

      transform:
        translateY(15px);

      animation:
        musicFadeIn
        1.1s
        cubic-bezier(.22,.61,.36,1)
        .85s
        forwards;
    }

    /* =====================================
       PLAY AREA
    ===================================== */

    .birthday-play-area {

      position: relative;

      width: 150px;
      height: 150px;

      margin-top: 55px;

      display: flex;

      align-items: center;
      justify-content: center;

      z-index: 20;

      opacity: 0;

      animation:
        musicFadeIn
        1.2s
        cubic-bezier(.22,.61,.36,1)
        1.1s
        forwards;
    }

    /* outer ring */

    .birthday-play-area::before {

      content: "";

      position: absolute;

      inset: 0;

      border-radius: 50%;

      border:
        1px solid
        rgba(230,190,210,.22);

      box-shadow:
        0 0 50px
        rgba(220,140,175,.08);

      animation:
        musicRing
        4s
        ease-in-out
        infinite;
    }

    /* inner ring */

    .birthday-play-area::after {

      content: "";

      position: absolute;

      inset: 12px;

      border-radius: 50%;

      border:
        1px solid
        rgba(230,190,210,.10);
    }

    /* =====================================
       PLAY BUTTON
    ===================================== */

    .birthday-play-button {

      position: relative;

      width: 96px;
      height: 96px;

      padding: 0;

      border-radius: 50%;

      border:
        1px solid
        rgba(245,215,228,.48);

      background:
        radial-gradient(
          circle at 35% 28%,
          rgba(255,255,255,.14),
          rgba(72,40,54,.72) 45%,
          rgba(16,9,14,.96) 100%
        );

      color: #f8edf2;

      display: flex;

      flex-direction: column;

      align-items: center;
      justify-content: center;

      gap: 3px;

      cursor: pointer;

      outline: none;

      box-shadow:
        0 20px 60px rgba(0,0,0,.55),
        0 0 40px rgba(220,140,175,.10),
        inset 0 1px 0
        rgba(255,255,255,.12);

      transition:
        transform .4s ease,
        box-shadow .4s ease,
        border-color .4s ease;
    }

    .birthday-play-button:hover {

      transform: scale(1.06);

      border-color:
        rgba(250,220,232,.78);

      box-shadow:
        0 25px 70px rgba(0,0,0,.6),
        0 0 60px rgba(220,140,175,.18),
        inset 0 1px 0
        rgba(255,255,255,.16);
    }

    .birthday-play-button:active {

      transform: scale(.96);
    }

    .birthday-play-icon {

      font-family: Georgia, serif;

      font-size: 31px;

      line-height: 1;

      transition:
        transform .4s ease;
    }

    .birthday-play-label {

      font-family:
        Inter,
        system-ui,
        sans-serif;

      font-size: 8px;

      font-weight: 600;

      letter-spacing: .27em;

      text-transform: uppercase;
    }

    /* playing */

    .birthday-play-button.playing {

      border-color:
        rgba(255,220,235,.8);

      box-shadow:
        0 0 45px
        rgba(220,140,175,.20),

        0 0 100px
        rgba(220,140,175,.08),

        inset 0 0 25px
        rgba(255,255,255,.05);
    }

    /* =====================================
       SOUND WAVES
    ===================================== */

    .birthday-waves {

      height: 32px;

      margin-top: 23px;

      display: flex;

      align-items: center;
      justify-content: center;

      gap: 5px;

      opacity: 0;

      transition:
        opacity 1s ease;
    }

    .birthday-music-playing
    .birthday-waves {

      opacity: .8;
    }

    .birthday-wave {

      width: 2px;

      height: 7px;

      border-radius: 10px;

      background:
        rgba(235,195,215,.8);

      animation:
        musicWave
        1s
        ease-in-out
        infinite;
    }

    .birthday-wave:nth-child(2) {
      animation-delay: -.2s;
    }

    .birthday-wave:nth-child(3) {
      animation-delay: -.45s;
    }

    .birthday-wave:nth-child(4) {
      animation-delay: -.25s;
    }

    .birthday-wave:nth-child(5) {
      animation-delay: -.4s;
    }

    /* =====================================
       NOW PLAYING
    ===================================== */

    .birthday-now-playing {

      position: absolute;

      left: 50%;

      top: 76%;

      transform:
        translate(-50%, 18px);

      text-align: center;

      opacity: 0;

      transition:
        opacity 1.2s ease,
        transform 1.2s
        cubic-bezier(.22,.61,.36,1);
    }

    .birthday-music-playing
    .birthday-now-playing {

      opacity: 1;

      transform:
        translate(-50%, 0);
    }

    .birthday-now-small {

      margin-bottom: 7px;

      color:
        rgba(230,198,212,.48);

      font-family:
        Inter,
        system-ui,
        sans-serif;

      font-size: 8px;

      font-weight: 600;

      letter-spacing: .3em;

      text-transform: uppercase;
    }

    .birthday-now-title {

      color:
        rgba(248,235,241,.88);

      font-family:
        "Cormorant Garamond",
        Georgia,
        serif;

      font-size: 24px;

      letter-spacing: .04em;
    }

    /* =====================================
       NEXT
    ===================================== */

    .birthday-music-next {

      position: absolute;

      right: 30px;
      bottom: 28px;

      z-index: 50;

      min-width: 118px;
      min-height: 52px;

      padding: 14px 24px;

      border-radius: 16px;

      border:
        1px solid
        rgba(235,200,218,.32);

      background:
        linear-gradient(
          135deg,
          rgba(75,42,58,.75),
          rgba(24,11,18,.94)
        );

      color: #f7eaf0;

      font-family:
        Inter,
        system-ui,
        sans-serif;

      font-size: 10px;

      font-weight: 600;

      letter-spacing: .25em;

      cursor: pointer;

      opacity: 1;

      transition:
        opacity .9s ease,
        transform .35s ease,
        box-shadow .35s ease;
    }

    .birthday-music-next.hidden {

      opacity: 0;

      pointer-events: none;

      transform:
        translateY(18px);
    }

    .birthday-music-next:hover {

      transform:
        translateY(-3px);

      box-shadow:
        0 20px 55px
        rgba(0,0,0,.55),

        0 0 30px
        rgba(220,140,175,.10);
    }

    /* =====================================
       ANIMATIONS
    ===================================== */

    @keyframes musicFadeIn {

      from {
        opacity: 0;
        transform:
          translateY(15px);
      }

      to {
        opacity: 1;
        transform:
          translateY(0);
      }
    }

    @keyframes musicTitle {

      from {
        opacity: 0;
        transform:
          translateY(30px);
        filter: blur(8px);
      }

      to {
        opacity: 1;
        transform:
          translateY(0);
        filter: blur(0);
      }
    }

    @keyframes musicRing {

      0%,100% {
        transform: scale(1);
        opacity: .65;
      }

      50% {
        transform: scale(1.035);
        opacity: 1;
      }
    }

    @keyframes musicWave {

      0%,100% {
        height: 7px;
      }

      50% {
        height: 27px;
      }
    }

    @media (max-width:700px) {

      .birthday-music-stage {
        padding-top: 15vh;
      }

      .birthday-music-title {
        font-size:
          clamp(3.5rem,15vw,5.5rem);
      }

      .birthday-music-subtitle {
        width: 82vw;
        line-height: 1.7;
      }

      .birthday-play-area {
        margin-top: 48px;
      }

      .birthday-now-playing {
        top: 78%;
      }

      .birthday-music-next {
        right: 18px;
        bottom: 18px;
      }
    }

  `;

  this.root.appendChild(style);

  /* =========================================
     STAGE
  ========================================= */

  const stage = document.createElement("div");

  stage.className =
    "birthday-music-stage";

  /* =========================================
     TEXT
  ========================================= */

  const kicker = document.createElement("div");

  kicker.className =
    "birthday-music-kicker";

  kicker.textContent =
    "ONE MORE THING";

  const title = document.createElement("h1");

  title.className =
    "birthday-music-title";

  title.innerHTML =
    `LET THE<br><span>MUSIC PLAY</span>`;

  const subtitle = document.createElement("p");

  subtitle.className =
    "birthday-music-subtitle";

  subtitle.textContent =
    "A little birthday magic, just for you.";

  /* =========================================
     PLAY
  ========================================= */

  const playArea = document.createElement("div");

  playArea.className =
    "birthday-play-area";

  const playButton = document.createElement("button");

playButton.type = "button";

playButton.className =
  "birthday-play-button";

playButton.style.position = "relative";
playButton.style.zIndex = "99999";
playButton.style.pointerEvents = "auto";
playButton.style.cursor = "pointer";

  const icon = document.createElement("span");

  icon.className =
    "birthday-play-icon";

  icon.textContent = "♫";

  const label = document.createElement("span");

  label.className =
    "birthday-play-label";

  label.textContent = "PLAY";

  playButton.appendChild(icon);
  playButton.appendChild(label);

  playArea.appendChild(playButton);

  /* =========================================
     WAVES
  ========================================= */

  const waves = document.createElement("div");

  waves.className =
    "birthday-waves";

  for (let i = 0; i < 5; i++) {

    const wave =
      document.createElement("span");

    wave.className =
      "birthday-wave";

    waves.appendChild(wave);
  }

  /* =========================================
     NOW PLAYING
  ========================================= */

  const nowPlaying =
    document.createElement("div");

  nowPlaying.className =
    "birthday-now-playing";

  const nowSmall =
    document.createElement("div");

  nowSmall.className =
    "birthday-now-small";

  nowSmall.textContent =
    "NOW PLAYING";

  const nowTitle =
    document.createElement("div");

  nowTitle.className =
    "birthday-now-title";

  nowTitle.textContent =
    "Happy Birthday";

  nowPlaying.appendChild(nowSmall);
  nowPlaying.appendChild(nowTitle);

  /* =========================================
     ASSEMBLE
  ========================================= */

  stage.appendChild(kicker);
  stage.appendChild(title);
  stage.appendChild(subtitle);
  stage.appendChild(playArea);
  stage.appendChild(waves);
  stage.appendChild(nowPlaying);

  this.root.appendChild(stage);

  /* =========================================
     NEXT
  ========================================= */

  const nextButton =
    document.createElement("button");

  nextButton.type = "button";

  nextButton.className =
    "birthday-music-next hidden";

  nextButton.textContent =
    "NEXT";

  this.root.appendChild(nextButton);

    /* =========================================
   PERSISTENT PREMIUM MUSIC CONTROL
========================================= */

if (!this.muteButton) {

  const muteButton = document.createElement("button");

  muteButton.type = "button";
  muteButton.className = "birthday-mute-button";

  muteButton.setAttribute(
    "aria-label",
    "Mute music"
  );

  muteButton.setAttribute(
    "title",
    "Mute music"
  );

  muteButton.innerHTML = `
    <svg
      class="mute-icon mute-icon-on"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M4 10v4h4l5 4V6l-5 4H4Z"
      ></path>

      <path
        d="M16 9.5c.8.7 1.2 1.5 1.2 2.5s-.4 1.8-1.2 2.5"
      ></path>

      <path
        d="M18.7 7c1.5 1.4 2.3 3 2.3 5s-.8 3.6-2.3 5"
      ></path>
    </svg>

    <svg
      class="mute-icon mute-icon-off"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M4 10v4h4l5 4V6l-5 4H4Z"
      ></path>

      <path
        d="M17 9l5 6"
      ></path>

      <path
        d="M22 9l-5 6"
      ></path>
    </svg>
  `;

  document.body.appendChild(muteButton);

  muteButton.addEventListener("click", () => {

    audio.muted = !audio.muted;

    muteButton.classList.toggle(
      "is-muted",
      audio.muted
    );

    muteButton.setAttribute(
      "aria-label",
      audio.muted
        ? "Unmute music"
        : "Mute music"
    );

    muteButton.setAttribute(
      "title",
      audio.muted
        ? "Unmute music"
        : "Mute music"
    );

    if (!audio.muted) {
      audio.play().catch(() => {});
    }

  });

  this.muteButton = muteButton;
}


/* Make sure the persistent controller is visible */

this.muteButton.style.display = "flex";

  /* =========================================
     PLAY MUSIC
  ========================================= */

 this.on(playButton, "click", async () => {

  console.log("PLAY BUTTON CLICKED");

  try {

    await audio.play();

    console.log("BIRTHDAY MUSIC STARTED");

    stage.classList.add("birthday-music-playing");

    playButton.classList.add("playing");

    icon.textContent = "Ⅱ";
    label.textContent = "PLAYING";

    await wait(1500);

    nextButton.classList.remove("hidden");

  } catch (error) {

    console.error("Music playback error:", error);

    label.textContent = "TRY AGAIN";

  }

});

  /* =========================================
     NEXT
  ========================================= */

  this.on(
    nextButton,
    "click",
    async () => {

      this.on(
  nextButton,
  "click",
  async () => {

    await this.go(
      SCENES.AGE
    );

  }
);
    }
  );
}
  async age() {
  const s = this.shell("", "");

  const page = document.createElement("div");
  page.className = "chapter-age";

  /* ---------- background ---------- */

  const glow = document.createElement("div");
  glow.className = "chapter-glow";

  /* ---------- top label ---------- */

  const label = document.createElement("div");
  label.className = "chapter-label";
  label.textContent = "THE NEXT CHAPTER";

  /* ---------- clock ---------- */

  const clock = document.createElement("div");
  clock.className = "chapter-clock";

  const outer = document.createElement("div");
  outer.className = "chapter-clock-outer";

  const inner = document.createElement("div");
  inner.className = "chapter-clock-inner";

  const marks = document.createElement("div");
  marks.className = "chapter-marks";

  for (let i = 0; i < 60; i++) {
  const mark = document.createElement("span");

  mark.className =
    i % 5 === 0
      ? "chapter-mark major"
      : "chapter-mark";

  const angle = i * 6;

  mark.style.setProperty(
    "--mark-angle",
    `${angle}deg`
  );

  marks.appendChild(mark);
}

  const hand = document.createElement("div");
  hand.className = "chapter-hand";

  const center = document.createElement("div");
  center.className = "chapter-center";

  clock.append(
    outer,
    inner,
    marks,
    hand,
    center
  );

  /* ---------- number ---------- */

  const number = document.createElement("div");
  number.className = "chapter-number";
  number.textContent = C.newAge;

  /* ---------- typography ---------- */

  const words = document.createElement("div");
  words.className = "chapter-words";
  words.textContent = "TWENTY SIX";

  const line = document.createElement("div");
  line.className = "chapter-line";

  const sub = document.createElement("div");
  sub.className = "chapter-sub";
  sub.textContent = "YEARS OF BECOMING";

  /* ---------- footer ---------- */

  const footer = document.createElement("div");
  footer.className = "chapter-footer";
  footer.textContent = "CHAPTER XXVI";

  /* ---------- next ---------- */

  const next = this.button(
    "NEXT →",
    "chapter-next"
  );

  /* ---------- assemble ---------- */

  page.append(
    glow,
    label,
    clock,
    number,
    words,
    line,
    sub,
    footer,
    next
  );

  s.appendChild(page);

  /* ==========================================
     INTERACTION
     ========================================== */

  this.on(page, "pointermove", (event) => {
    const rect = page.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
      rect.width -
      0.5;

    const y =
      (event.clientY - rect.top) /
      rect.height -
      0.5;

    clock.style.transform =
  `translate(calc(-50% + ${x * 10}px), calc(-50% + ${y * 10}px))`;

    number.style.transform =
      `translate(calc(-50% + ${x * -8}px), calc(-50% + ${y * -8}px))`;

    glow.style.transform =
      `translate(${x * 30}px, ${y * 30}px)`;
  });

  /* Tap the clock = accelerate the reveal */

  this.on(clock, "click", () => {
    clock.classList.add("chapter-clock-finish");
    number.classList.add("chapter-number-active");
  });

  /* ==========================================
     REVEAL
     ========================================== */

  await wait(300);

  page.classList.add("chapter-visible");

  await wait(1000);

  clock.classList.add("chapter-clock-visible");

  await wait(1200);

  marks.classList.add("chapter-marks-visible");

  await wait(1000);

  hand.classList.add("chapter-hand-move");

  await wait(3000);

  clock.classList.add("chapter-clock-finish");

  await wait(700);

  number.classList.add("chapter-number-active");

  await wait(1300);

  words.classList.add("chapter-detail-visible");

  await wait(500);

  line.classList.add("chapter-line-visible");

  await wait(500);

  sub.classList.add("chapter-detail-visible");

  await wait(1200);

  next.classList.add("chapter-next-visible");

  /* ==========================================
     NEXT
     ========================================== */

  this.on(next, "click", async () => {
    next.disabled = true;

    page.classList.add("chapter-leaving");

    await wait(900);

    await this.go(SCENES.CELEBRATION);
  });
}
  async celebration() {
    const s=this.shell("Now we celebrate", `HAPPY BIRTHDAY ${C.sisterName}`);
    const fxLayer=document.createElement("div"); fxLayer.className="fx-layer"; s.appendChild(fxLayer);
    const fx=new CelebrationFX(fxLayer); fx.start({duration:C.celebrationDurationMs});
    this.cleanup.push(()=>fx.stop(false));
    const controls=document.createElement("div"); controls.className="celebration-controls"; s.appendChild(controls);
    const replay=this.button("✦","icon-btn"); replay.setAttribute("aria-label","Replay celebration"); controls.appendChild(replay);
    const next=this.button("NEXT →","next-btn"); s.appendChild(next);
    this.on(replay,"click",()=>fx.start({duration:C.celebrationDurationMs}));
    this.on(next,"click",()=>{ stopMusic(1300); this.go(SCENES.CALM); });
  }

  async calm() {
    const s=this.shell("A quieter little moment", "");
    const frame=document.createElement("div"); frame.className="photo-frame"; s.appendChild(frame);
    const r=await safeAsset(C.assets.sisterPhoto,{kind:"img"});
    if(r.ok) { const img=document.createElement("img"); img.src=C.assets.sisterPhoto; img.alt="Sister portrait"; frame.appendChild(img); }
    else frame.appendChild(resourceFallback("SISTER PHOTO — 9:16 PORTRAIT"));
    const fire=document.createElement("div"); fire.className="silent-fireworks"; s.appendChild(fire);
    const text=document.createElement("div"); text.className="type-message"; s.appendChild(text);
    typeText(text,C.calmMessage,{speed:24});
    const next=this.button("NEXT →","next-btn"); s.appendChild(next);
    this.on(next,"click",()=>this.go(SCENES.LETTER));
  }

  async letter() {
    const s=this.shell("One last little question", "Would you like to read it?");
    const env=document.createElement("div"); env.className="envelope-wrap"; s.appendChild(env);
    const er=await safeAsset(C.assets.envelope,{kind:"img"});
    if(er.ok) env.style.backgroundImage=`url("${C.assets.envelope}")`;
    else env.appendChild(resourceFallback("ENVELOPE CLOSED"));
    const actions=document.createElement("div"); actions.className="yes-no"; s.appendChild(actions);
    const yes=this.button("YES","yes-btn"), no=this.button("NO","no-btn"); actions.append(yes,no);
    let noClicks=0;
    this.on(no,"click",()=>{
      noClicks++;
      const p=Math.min(noClicks/C.noClickLimit,1);
      yes.style.transform=`scale(${1+p*0.85})`;
      no.style.transform=`scale(${1-p*0.82})`;
      if(noClicks>=C.noClickLimit){ no.classList.add("gone"); no.disabled=true; }
    });
    this.on(yes,"click",()=>this.openLetter(env,s,actions));
  }

  async openLetter(env,s,actions) {
    actions.classList.add("fade");
    env.classList.add("open");
    await wait(1000);
    const paper=document.createElement("article"); paper.className="letter-paper";
    const r=await safeAsset(C.assets.letterPaper,{kind:"img"});
    if(r.ok) paper.style.backgroundImage=`url("${C.assets.letterPaper}")`;
    const text=document.createElement("div"); text.className="letter-text"; paper.appendChild(text);
    const next=this.button("NEXT →","next-btn");
    s.append(paper,next);
    typeText(text,C.letterText,{speed:18});
    this.on(next,"click",()=>this.go(SCENES.FINAL));
  }

  async final() {
    const s=this.shell("The grand finale", "HAPPY BIRTHDAY");
    const fxLayer=document.createElement("div"); fxLayer.className="fx-layer"; s.appendChild(fxLayer);
    const fx=new CelebrationFX(fxLayer); fx.start({duration:Infinity});
    this.cleanup.push(()=>fx.stop(false));
    const end=this.button("Saaku malko","final-btn"); s.appendChild(end);
    this.on(end,"click",async()=>{
      end.disabled=true;
      const fade=document.createElement("div"); fade.className="ending-veil"; this.root.appendChild(fade);
      let start=performance.now();
      const reduce=()=>{
        const p=Math.min(1,(performance.now()-start)/4200);
        fx.root.style.opacity=String(1-p);
        if(p<1) requestAnimationFrame(reduce);
      };
      requestAnimationFrame(reduce);
      await wait(4300);
      fx.stop(false);
      document.querySelectorAll(".scene-shell").forEach(x=>x.classList.add("final-dark"));
      await wait(1200);
      document.querySelectorAll(".scene-shell").forEach(x=>x.classList.add("curtain-finale"));
      await wait(2800);
      this.root.classList.add("complete-black");
    });
  }
}
