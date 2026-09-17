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
  this.musicStarted = false;
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
  const s = this.shell("A tiny mystery", "Yaardu bartudayyyy?");

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

      // =====================================================
// SWIPE NAVIGATION — CAT VIDEO ONLY
// =====================================================

const swipeArea = document.createElement("div");

swipeArea.style.width = "260px";
swipeArea.style.height = "70px";
swipeArea.style.marginTop = "28px";

swipeArea.style.display = "flex";
swipeArea.style.alignItems = "center";
swipeArea.style.justifyContent = "center";

swipeArea.style.position = "relative";

swipeArea.style.cursor = "grab";
swipeArea.style.userSelect = "none";
swipeArea.style.webkitUserSelect = "none";

swipeArea.style.touchAction = "pan-y";

swipeArea.style.overflow = "visible";
swipeArea.style.filter = "drop-shadow(0 0 18px rgba(255, 190, 120, 0.08))";
swipeArea.style.transition = "filter 0.5s ease, transform 0.5s ease";


// =====================================================
// SWIPE CONTENT
// =====================================================

const swipeContent = document.createElement("div");

swipeContent.innerHTML = `
  <span class="swipe-back">← BACK</span>
  <span class="swipe-label">SWIPE</span>
  <span class="swipe-next">NEXT →</span>
`;

swipeContent.style.display = "flex";
swipeContent.style.alignItems = "center";
swipeContent.style.justifyContent = "center";
swipeContent.style.gap = "14px";

swipeContent.style.whiteSpace = "nowrap";

swipeContent.style.transition =
  "transform 0.55s cubic-bezier(.22,1,.36,1), opacity 0.4s ease";


// =====================================================
// TEXT ELEMENTS
// =====================================================

const backText =
  swipeContent.querySelector(".swipe-back");

const swipeText =
  swipeContent.querySelector(".swipe-label");

const nextText =
  swipeContent.querySelector(".swipe-next");


backText.style.fontSize = "10px";
backText.style.fontWeight = "500";
backText.style.letterSpacing = "2px";
backText.style.opacity = "0";
backText.style.color = "#d9b3ff";
backText.style.textShadow = "0 0 14px rgba(210,150,255,0.7)";
backText.style.transition =
"opacity 0.25s ease, transform 0.35s ease";
backText.style.transform = "translateX(8px)";

swipeText.style.fontSize = "11px";
swipeText.style.fontWeight = "500";
swipeText.style.letterSpacing = "5px";
swipeText.style.color = "#ffe7c9";
swipeText.style.textShadow =
  "0 0 8px rgba(255,220,180,0.35), 0 0 20px rgba(210,150,255,0.25)";
swipeText.style.opacity = "0.72";

swipeText.style.transition =
  "opacity 0.25s ease, letter-spacing 0.35s ease";


nextText.style.fontSize = "10px";
nextText.style.fontWeight = "500";
nextText.style.letterSpacing = "2px";
nextText.style.opacity = "0";
nextText.style.color = "#ffd49a";
nextText.style.textShadow = "0 0 14px rgba(255,190,110,0.7)";
nextText.style.transition =
"opacity 0.25s ease, transform 0.35s ease";
nextText.style.transform = "translateX(-8px)";


swipeArea.appendChild(swipeContent);


// =====================================================
// SWIPE LINE
// =====================================================

const swipeLine = document.createElement("div");

swipeLine.style.position = "absolute";
swipeLine.style.left = "50%";
swipeLine.style.bottom = "4px";

swipeLine.style.width = "54px";
swipeLine.style.height = "1px";

swipeLine.style.transform =
  "translateX(-50%)";

swipeLine.style.background =
  "rgba(255,255,255,0.20)";

swipeLine.style.transition =
  "width 0.45s ease, opacity 0.35s ease";

swipeArea.appendChild(swipeLine);


// =====================================================
// SWIPE LOGIC
// =====================================================

let swipeStartX = 0;
let swipeCurrentX = 0;
let swiping = false;

const SWIPE_DISTANCE = 100;


// =====================================================
// START
// =====================================================

swipeArea.addEventListener(
  "pointerdown",
  (event) => {

    swiping = true;

    swipeStartX = event.clientX;
    swipeCurrentX = event.clientX;

    swipeArea.style.cursor = "grabbing";

    swipeArea.setPointerCapture(event.pointerId);
  }
);


// =====================================================
// MOVE
// =====================================================

swipeArea.addEventListener(
  "pointermove",
  (event) => {

    if (!swiping) return;

    swipeCurrentX = event.clientX;

    const distance =
      swipeCurrentX - swipeStartX;

    const limitedDistance =
      Math.max(-130, Math.min(130, distance));

    swipeContent.style.transform =
      `translateX(${limitedDistance}px)`;

    const progress =
      Math.min(
        Math.abs(limitedDistance) / SWIPE_DISTANCE,
        1
      );

    // -----------------------------
    // SWIPE LEFT
    // -----------------------------

    if (distance < -10) {

      backText.style.opacity =
        String(progress);

      nextText.style.opacity = "0";

      swipeText.style.opacity =
        String(0.72 + progress * 0.28);

      swipeLine.style.width =
        `${54 + progress * 35}px`;
    }

    // -----------------------------
    // SWIPE RIGHT
    // -----------------------------

    else if (distance > 10) {

      nextText.style.opacity =
        String(progress);

      backText.style.opacity = "0";

      swipeText.style.opacity =
        String(0.72 + progress * 0.28);

      swipeLine.style.width =
        `${54 + progress * 35}px`;
    }

    // -----------------------------
    // CENTER
    // -----------------------------

    else {

      backText.style.opacity = "0";
      nextText.style.opacity = "0";
      swipeText.style.opacity = "0.72";

      swipeLine.style.width = "54px";
    }
  }
);


// =====================================================
// RELEASE
// =====================================================

swipeArea.addEventListener(
  "pointerup",
  async (event) => {

    if (!swiping) return;

    swiping = false;

    const distance =
      swipeCurrentX - swipeStartX;

    swipeArea.style.cursor = "grab";

    // =================================================
    // SWIPE LEFT — BACK
    // =================================================

    if (distance <= -SWIPE_DISTANCE) {

      swipeContent.style.transform =
        "translateX(-180px)";

      swipeContent.style.opacity = "0";

      swipeLine.style.width = "90px";
      swipeLine.style.opacity = "0";

      await new Promise(resolve =>
        setTimeout(resolve, 350)
      );

      video.pause();

      await this.go(SCENES.QUESTION);

      return;
    }


    // =================================================
    // SWIPE RIGHT — NEXT
    // =================================================

    if (distance >= SWIPE_DISTANCE) {

      swipeContent.style.transform =
        "translateX(180px)";

      swipeContent.style.opacity = "0";

      swipeLine.style.width = "90px";
      swipeLine.style.opacity = "0";

      await new Promise(resolve =>
        setTimeout(resolve, 350)
      );

      video.pause();

      await this.go(SCENES.CURTAINS);

      return;
    }


    // =================================================
    // INCOMPLETE SWIPE — RETURN TO CENTER
    // =================================================

    swipeContent.style.transform =
      "translateX(0)";

    swipeContent.style.opacity = "1";

    backText.style.opacity = "0";
    nextText.style.opacity = "0";

    swipeText.style.opacity = "0.72";

    swipeLine.style.width = "54px";
    swipeLine.style.opacity = "1";
  }
);


// =====================================================
// CANCEL
// =====================================================

swipeArea.addEventListener(
  "pointercancel",
  () => {

    swiping = false;

    swipeArea.style.cursor = "grab";

    swipeContent.style.transform =
      "translateX(0)";

    swipeContent.style.opacity = "1";

    backText.style.opacity = "0";
    nextText.style.opacity = "0";

    swipeText.style.opacity = "0.72";

    swipeLine.style.width = "54px";
    swipeLine.style.opacity = "1";
  }
);


// =====================================================
// ADD TO CAT VIDEO PAGE
// =====================================================

videoScreen.appendChild(title);
videoScreen.appendChild(video);
videoScreen.appendChild(swipeArea);

this.root.appendChild(videoScreen);


// =====================================================
// START VIDEO
// =====================================================

video.play().catch(error => {
  console.log(
    "Autoplay blocked. Press the PLAY button.",
    error
  );
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
    "",
    "WHY IT'S DARK?"
  );

  s.classList.add("bulb-copy");

  // ==========================================
// SLOW CINEMATIC SCENE REVEAL
// ==========================================

s.style.opacity = "0";
s.style.transform = "scale(1.035)";
s.style.filter = "brightness(0.12)";

s.style.transition =
  "opacity 3.8s cubic-bezier(.16,1,.3,1), " +
  "transform 5.5s cubic-bezier(.16,1,.3,1), " +
  "filter 5s cubic-bezier(.16,1,.3,1)";

// Let the darkness breathe before revealing
setTimeout(() => {

  requestAnimationFrame(() => {

    s.style.opacity = "1";
    s.style.transform = "scale(1)";
    s.style.filter = "brightness(1)";

  });

}, 700);


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

  const glitterCount = 75;

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

// NEXT — bottom right
const nextButton = this.button(
  "NEXT",
  "bulb-next-btn"
);

this.add(nextButton);

nextButton.classList.add(
  "bulb-next-hidden"
);


// BACK — bottom left
const backButton = this.button(
  "BACK",
  "bulb-back-btn"
);

this.add(backButton);




  // ==========================================
  // LIGHT STATE
  // ==========================================

  let lightOn = false;


  // ==========================================
  // TURN LIGHT ON / OFF
  // ==========================================

  this.on(control, "click", () => {

  // Button click sound
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(700, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    420,
    audioContext.currentTime + 0.08
  );

  gain.gain.setValueAtTime(0.12, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.12
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.12);


  lightOn = !lightOn;

  if (lightOn) {

  this.root.classList.add("lights-on");
  mainBulb.classList.add("bulb-on");

  // Turn all hanging ceiling lights ON
  ceiling.querySelectorAll(".ceiling-bulb").forEach(
    bulb => bulb.classList.add("ceiling-bulb-on")
  );

  control.textContent = "TURN OFF LIGHT";
  control.setAttribute("aria-label", "Turn the light off");
  mainBulb.setAttribute("aria-label", "Turn the light off");

  nextButton.classList.remove("bulb-next-hidden");
  backButton.classList.add("bulb-back-hidden");


  } else {

    this.root.classList.remove("lights-on");
    mainBulb.classList.remove("bulb-on");

    // Turn all hanging ceiling lights OFF
    ceiling.querySelectorAll(".ceiling-bulb").forEach(
      bulb => bulb.classList.remove("ceiling-bulb-on")
    );

    control.textContent = "TURN ON LIGHT";
    control.setAttribute("aria-label","Turn the light on");
    mainBulb.setAttribute("aria-label","Turn the light on");

    nextButton.classList.add("bulb-next-hidden");
backButton.classList.remove("bulb-back-hidden");

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

// ==========================================
// NEXT
// ==========================================

this.on(nextButton, "click", async () => {

  await this.go(
    SCENES.MUSIC
  );

});


// ==========================================
// BACK
// ==========================================

this.on(backButton, "click", async () => {

  await this.go(
    SCENES.CURTAINS
  );

});


// ==========================================
// BACK
// ==========================================

this.on(backButton, "click", async () => {
  await this.go(
    SCENES.CURTAINS
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

    const muteButton =
      document.createElement("button");

    muteButton.type = "button";

    muteButton.className =
      "birthday-mute-button";

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

    muteButton.addEventListener(
      "click",
      () => {

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

      }
    );

    this.muteButton = muteButton;
  }

  /* Make sure the persistent controller is visible */

  this.muteButton.style.display = "flex";

  /* =========================================
     PLAY MUSIC
  ========================================= */

  this.on(
    playButton,
    "click",
    async () => {

      console.log("PLAY BUTTON CLICKED");

      try {

        await audio.play();

        console.log(
          "BIRTHDAY MUSIC STARTED"
        );

        stage.classList.add(
          "birthday-music-playing"
        );

        playButton.classList.add(
          "playing"
        );

        icon.textContent = "Ⅱ";

        label.textContent =
          "PLAYING";

        await wait(1500);

        nextButton.classList.remove(
          "hidden"
        );

      } catch (error) {

        console.error(
          "Music playback error:",
          error
        );

        label.textContent =
          "TRY AGAIN";
      }

    }
  );

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

  /* =========================================================
     CANVAS LAYERS
     ========================================================= */

  const spaceCanvas = document.createElement("canvas");
  spaceCanvas.className = "chapter-space";

  const fxCanvas = document.createElement("canvas");
  fxCanvas.className = "chapter-fx-canvas";

  const numberCanvas = document.createElement("canvas");
  numberCanvas.className = "chapter-number-canvas";

  /* =========================================================
     UI
     ========================================================= */

  const label = document.createElement("div");
  label.className = "chapter-label";
  label.textContent = "A NEW ORBIT BEGINS";

  const words = document.createElement("div");
  words.className = "chapter-words";
  words.textContent = "TWENTY SIX";

  const line = document.createElement("div");
  line.className = "chapter-line";

  const sub = document.createElement("div");
  sub.className = "chapter-sub";
  sub.textContent = "ANOTHER YEAR AROUND THE SUN";

  const footer = document.createElement("div");
  footer.className = "chapter-footer";
  footer.textContent = "CHAPTER XXVI";

  const next = this.button("NEXT →", "chapter-next");

  page.append(
    spaceCanvas,
    fxCanvas,
    numberCanvas,
    label,
    words,
    line,
    sub,
    footer,
    next
  );

  s.appendChild(page);

  /* =========================================================
     CONTEXT
     ========================================================= */

  const spaceCtx = spaceCanvas.getContext("2d");
  const fxCtx = fxCanvas.getContext("2d");
  const numCtx = numberCanvas.getContext("2d");

  let W = 0;
  let H = 0;

  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  /* =========================================================
     MATH
     ========================================================= */

  const clamp = (v, a = 0, b = 1) =>
    Math.max(a, Math.min(b, v));

  const lerp = (a, b, t) =>
    a + (b - a) * t;

  const easeOutCubic = (t) =>
    1 - Math.pow(1 - t, 3);

  const easeInOutCubic = (t) => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const easeOutExpo = (t) =>
    t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);

  const smoothstep = (a, b, x) => {
    const t = clamp((x - a) / (b - a));
    return t * t * (3 - 2 * t);
  };

  const rand = (a, b) =>
    a + Math.random() * (b - a);

  /* =========================================================
     POINTER / CAMERA
     ========================================================= */

  let pointerX = 0;
  let pointerY = 0;

  let targetPointerX = 0;
  let targetPointerY = 0;

  this.on(page, "pointermove", (e) => {
    const rect = page.getBoundingClientRect();

    targetPointerX =
      ((e.clientX - rect.left) / rect.width - 0.5);

    targetPointerY =
      ((e.clientY - rect.top) / rect.height - 0.5);
  });

  this.on(page, "pointerleave", () => {
    targetPointerX = 0;
    targetPointerY = 0;
  });

  /*
     Touch drag gives the same feeling on mobile.
  */

  let touchStartX = 0;
  let touchStartY = 0;

  this.on(page, "touchstart", (e) => {
    if (!e.touches.length) return;

    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  this.on(page, "touchmove", (e) => {
    if (!e.touches.length) return;

    const dx =
      (e.touches[0].clientX - touchStartX) / Math.max(W, 1);

    const dy =
      (e.touches[0].clientY - touchStartY) / Math.max(H, 1);

    targetPointerX = clamp(dx * 2.4, -0.5, 0.5);
    targetPointerY = clamp(dy * 2.4, -0.5, 0.5);
  }, { passive: true });

  /* =========================================================
     CAMERA
     ========================================================= */

  const camera = {
    x: 0,
    y: 0,
    zoom: 1,
    roll: 0,
    velocity: 0,
    targetVelocity: 0
  };

  /* =========================================================
     COLORS
     ========================================================= */

  const STAR_COLORS = [
    [235, 241, 255],
    [255, 249, 235],
    [211, 224, 255],
    [255, 231, 205]
  ];

  /* =========================================================
     STAR FIELD
     ========================================================= */

  let starsBack = [];
  let starsMid = [];
  let starsFront = [];

  function createStars(count, depth, minSize, maxSize) {
    const arr = [];

    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random(),
        y: Math.random(),

        z: rand(0.05, 1),

        size: rand(minSize, maxSize),

        alpha: rand(0.18, 0.85),

        twinkle: rand(0, Math.PI * 2),

        twinkleSpeed: rand(0.0005, 0.002),

        depth,

        color:
          STAR_COLORS[
            Math.floor(Math.random() * STAR_COLORS.length)
          ]
      });
    }

    return arr;
  }

  /* =========================================================
     GALAXY / NEBULA
     ========================================================= */

  const nebulaClouds = [
    {
      x: 0.18,
      y: 0.28,
      r: 0.48,
      color: [54, 72, 132],
      alpha: 0.11,
      phase: 0.4
    },

    {
      x: 0.82,
      y: 0.25,
      r: 0.42,
      color: [102, 63, 132],
      alpha: 0.08,
      phase: 1.8
    },

    {
      x: 0.58,
      y: 0.78,
      r: 0.52,
      color: [48, 82, 125],
      alpha: 0.075,
      phase: 3.2
    }
  ];

  function drawNebula(time, alpha) {
    for (const n of nebulaClouds) {
      const driftX =
        Math.sin(time * 0.000035 + n.phase) * 0.025;

      const driftY =
        Math.cos(time * 0.000028 + n.phase) * 0.018;

      const x =
        (n.x + driftX + pointerX * 0.008) * W;

      const y =
        (n.y + driftY + pointerY * 0.008) * H;

      const r =
        n.r * Math.max(W, H);

      const g =
        spaceCtx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          r
        );

      g.addColorStop(
        0,
        `rgba(${n.color.join(",")},${n.alpha * alpha})`
      );

      g.addColorStop(
        0.35,
        `rgba(${n.color.join(",")},${n.alpha * 0.42 * alpha})`
      );

      g.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      spaceCtx.fillStyle = g;
      spaceCtx.fillRect(0, 0, W, H);
    }
  }

  /* =========================================================
     DISTANT GALAXY
     ========================================================= */

  const galaxy = {
    x: 0.18,
    y: 0.22,
    radius: 0.25,
    rotation: rand(0, Math.PI * 2)
  };

  function drawGalaxy(time, alpha) {
    const cx =
      galaxy.x * W +
      pointerX * 12;

    const cy =
      galaxy.y * H +
      pointerY * 8;

    const r =
      galaxy.radius * Math.min(W, H);

    spaceCtx.save();

    spaceCtx.translate(cx, cy);

    galaxy.rotation += 0.000035;

    spaceCtx.rotate(galaxy.rotation);

    /* diffuse galaxy body */

    const glow =
      spaceCtx.createRadialGradient(
        0,
        0,
        0,
        0,
        0,
        r
      );

    glow.addColorStop(
      0,
      `rgba(240,238,255,${0.20 * alpha})`
    );

    glow.addColorStop(
      0.22,
      `rgba(180,170,225,${0.08 * alpha})`
    );

    glow.addColorStop(
      0.6,
      `rgba(100,110,175,${0.035 * alpha})`
    );

    glow.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );

    spaceCtx.fillStyle = glow;

    spaceCtx.beginPath();
    spaceCtx.arc(0, 0, r, 0, Math.PI * 2);
    spaceCtx.fill();

    /* spiral dust */

    for (let arm = 0; arm < 2; arm++) {
      const offset =
        arm * Math.PI;

      spaceCtx.beginPath();

      for (let i = 0; i < 85; i++) {
        const t = i / 84;

        const angle =
          t * Math.PI * 2.5 +
          offset;

        const radius =
          t * r * 0.92;

        const x =
          Math.cos(angle) * radius;

        const y =
          Math.sin(angle) * radius * 0.42;

        if (i === 0)
          spaceCtx.moveTo(x, y);
        else
          spaceCtx.lineTo(x, y);
      }

      spaceCtx.strokeStyle =
        `rgba(155,165,215,${0.035 * alpha})`;

      spaceCtx.lineWidth =
        Math.max(1, r * 0.06);

      spaceCtx.filter = "blur(8px)";
      spaceCtx.stroke();
    }

    spaceCtx.filter = "none";

    spaceCtx.restore();
  }

  /* =========================================================
     PLANET TEXTURE
     ========================================================= */

  function createPlanetTexture(
    size,
    type
  ) {
    const c =
      document.createElement("canvas");

    c.width = size;
    c.height = size;

    const ctx = c.getContext("2d");

    if (type === "gas") {

      for (let i = 0; i < 120; i++) {
        const y =
          Math.random() * size;

        const bandHeight =
          rand(size * 0.008, size * 0.06);

        const colors = [
          [165, 148, 132],
          [105, 93, 90],
          [196, 177, 150],
          [72, 72, 84],
          [135, 125, 125]
        ];

        const col =
          colors[
            Math.floor(Math.random() * colors.length)
          ];

        const g =
          ctx.createLinearGradient(
            0,
            y,
            size,
            y + bandHeight
          );

        g.addColorStop(
          0,
          `rgba(${col.join(",")},0)`
        );

        g.addColorStop(
          0.45,
          `rgba(${col.join(",")},${rand(0.12, 0.34)})`
        );

        g.addColorStop(
          0.7,
          `rgba(${col.join(",")},${rand(0.08, 0.22)})`
        );

        g.addColorStop(
          1,
          `rgba(${col.join(",")},0)`
        );

        ctx.fillStyle = g;

        ctx.fillRect(
          0,
          y,
          size,
          bandHeight
        );
      }

      /* storm */

      const sx = size * 0.58;
      const sy = size * 0.55;

      const storm =
        ctx.createRadialGradient(
          sx,
          sy,
          0,
          sx,
          sy,
          size * 0.12
        );

      storm.addColorStop(
        0,
        "rgba(240,205,178,0.32)"
      );

      storm.addColorStop(
        0.5,
        "rgba(170,125,115,0.15)"
      );

      storm.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle = storm;

      ctx.fillRect(
        0,
        0,
        size,
        size
      );

    } else {

      /* rocky surface */

      for (let i = 0; i < 280; i++) {

        const x =
          Math.random() * size;

        const y =
          Math.random() * size;

        const r =
          rand(size * 0.006, size * 0.035);

        const shade =
          Math.floor(rand(70, 145));

        const g =
          ctx.createRadialGradient(
            x - r * 0.25,
            y - r * 0.25,
            0,
            x,
            y,
            r
          );

        g.addColorStop(
          0,
          `rgba(${shade + 35},${shade + 35},${shade + 38},0.18)`
        );

        g.addColorStop(
          0.7,
          `rgba(${shade},${shade},${shade + 4},0.12)`
        );

        g.addColorStop(
          1,
          "rgba(0,0,0,0)"
        );

        ctx.fillStyle = g;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    return c;
  }

  const gasTexture =
    createPlanetTexture(700, "gas");

  const rockTexture =
    createPlanetTexture(600, "rock");

  /* =========================================================
     PLANET RENDERER
     ========================================================= */

  function drawPlanet(
    cx,
    cy,
    radius,
    options = {}
  ) {

    const {
      texture,
      lightX = -0.65,
      lightY = -0.72,
      atmosphere = [100, 140, 255],
      atmosphereAlpha = 0.22,
      ring = false,
      rotation = 0,
      alpha = 1
    } = options;

    spaceCtx.save();

    spaceCtx.globalAlpha = alpha;

    /* atmospheric outer glow */

    spaceCtx.globalCompositeOperation =
      "screen";

    const outer =
      spaceCtx.createRadialGradient(
        cx,
        cy,
        radius * 0.82,
        cx,
        cy,
        radius * 1.42
      );

    outer.addColorStop(
      0,
      "rgba(0,0,0,0)"
    );

    outer.addColorStop(
      0.62,
      `rgba(${atmosphere.join(",")},${atmosphereAlpha})`
    );

    outer.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );

    spaceCtx.fillStyle = outer;

    spaceCtx.beginPath();

    spaceCtx.arc(
      cx,
      cy,
      radius * 1.42,
      0,
      Math.PI * 2
    );

    spaceCtx.fill();

    spaceCtx.globalCompositeOperation =
      "source-over";

    /* sphere */

    const lx =
      cx + lightX * radius;

    const ly =
      cy + lightY * radius;

    const sphere =
      spaceCtx.createRadialGradient(
        lx,
        ly,
        radius * 0.04,
        cx,
        cy,
        radius * 1.08
      );

    sphere.addColorStop(
      0,
      "rgba(205,207,220,1)"
    );

    sphere.addColorStop(
      0.30,
      "rgba(128,132,151,1)"
    );

    sphere.addColorStop(
      0.62,
      "rgba(60,63,79,1)"
    );

    sphere.addColorStop(
      0.86,
      "rgba(19,21,31,1)"
    );

    sphere.addColorStop(
      1,
      "rgba(3,4,8,1)"
    );

    spaceCtx.fillStyle = sphere;

    spaceCtx.beginPath();

    spaceCtx.arc(
      cx,
      cy,
      radius,
      0,
      Math.PI * 2
    );

    spaceCtx.fill();

    /* surface */

    if (texture) {

      spaceCtx.save();

      spaceCtx.beginPath();

      spaceCtx.arc(
        cx,
        cy,
        radius,
        0,
        Math.PI * 2
      );

      spaceCtx.clip();

      spaceCtx.translate(cx, cy);

      spaceCtx.rotate(rotation);

      spaceCtx.globalAlpha =
        alpha * 0.62;

      spaceCtx.globalCompositeOperation =
        "soft-light";

      spaceCtx.drawImage(
        texture,
        -radius * 1.06,
        -radius * 1.06,
        radius * 2.12,
        radius * 2.12
      );

      spaceCtx.restore();
    }

    /* night side */

    spaceCtx.save();

    spaceCtx.beginPath();

    spaceCtx.arc(
      cx,
      cy,
      radius,
      0,
      Math.PI * 2
    );

    spaceCtx.clip();

    const night =
      spaceCtx.createRadialGradient(
        cx + lightX * radius,
        cy + lightY * radius,
        radius * 0.1,
        cx,
        cy,
        radius * 1.2
      );

    night.addColorStop(
      0,
      "rgba(0,0,0,0)"
    );

    night.addColorStop(
      0.56,
      "rgba(0,0,0,0.04)"
    );

    night.addColorStop(
      0.76,
      "rgba(0,0,0,0.48)"
    );

    night.addColorStop(
      1,
      "rgba(0,0,0,0.92)"
    );

    spaceCtx.fillStyle = night;

    spaceCtx.fillRect(
      cx - radius,
      cy - radius,
      radius * 2,
      radius * 2
    );

    spaceCtx.restore();

    /* ring behind / around planet */

    if (ring) {

      spaceCtx.save();

      spaceCtx.translate(cx, cy);

      spaceCtx.rotate(-0.18);

      spaceCtx.scale(1, 0.28);

      const ringGradient =
        spaceCtx.createRadialGradient(
          0,
          0,
          radius * 1.15,
          0,
          0,
          radius * 2.35
        );

      ringGradient.addColorStop(
        0,
        "rgba(0,0,0,0)"
      );

      ringGradient.addColorStop(
        0.34,
        "rgba(205,195,180,0.08)"
      );

      ringGradient.addColorStop(
        0.47,
        "rgba(230,220,200,0.22)"
      );

      ringGradient.addColorStop(
        0.54,
        "rgba(120,115,112,0.08)"
      );

      ringGradient.addColorStop(
        0.70,
        "rgba(220,210,195,0.13)"
      );

      ringGradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      spaceCtx.fillStyle =
        ringGradient;

      spaceCtx.beginPath();

      spaceCtx.arc(
        0,
        0,
        radius * 2.3,
        0,
        Math.PI * 2
      );

      spaceCtx.fill();

      spaceCtx.restore();
    }

    /* fine rim */

    spaceCtx.save();

    spaceCtx.globalCompositeOperation =
      "screen";

    spaceCtx.strokeStyle =
      `rgba(${atmosphere.join(",")},0.20)`;

    spaceCtx.lineWidth =
      Math.max(1, radius * 0.012);

    spaceCtx.beginPath();

    spaceCtx.arc(
      cx,
      cy,
      radius * 0.995,
      Math.PI * 1.02,
      Math.PI * 1.92
    );

    spaceCtx.stroke();

    spaceCtx.restore();

    spaceCtx.restore();
  }

  /* =========================================================
     ASTEROIDS
     ========================================================= */

  let asteroids = [];

  function createAsteroid() {

    const vertices = [];

    const count =
      Math.floor(rand(7, 12));

    for (let i = 0; i < count; i++) {

      const angle =
        (i / count) * Math.PI * 2;

      vertices.push({
        angle,
        radius: rand(0.72, 1.18)
      });
    }

    return {
      x: rand(-0.2, 1.2),
      y: rand(-0.2, 1.2),

      z: rand(0.15, 1),

      size: rand(3, 12),

      speed: rand(0.000035, 0.00012),

      rotation: rand(0, Math.PI * 2),

      spin: rand(-0.003, 0.003),

      vertices
    };
  }

  function drawAsteroid(a, alpha, time) {

    const depth =
      0.35 + a.z * 1.7;

    const px =
      a.x * W +
      pointerX * depth * 55;

    const py =
      a.y * H +
      pointerY * depth * 40;

    const scale =
      (1 - a.z) * 1.7 + 0.45;

    const r =
      a.size * scale;

    if (r < 0.45) return;

    spaceCtx.save();

    spaceCtx.translate(px, py);

    spaceCtx.rotate(
      a.rotation +
      time * a.spin * 0.001
    );

    spaceCtx.globalAlpha =
      alpha * (0.35 + (1 - a.z) * 0.55);

    /* glow for close objects */

    if (r > 7) {
      spaceCtx.shadowColor =
        "rgba(180,190,215,0.18)";

      spaceCtx.shadowBlur = 8;
    }

    spaceCtx.beginPath();

    a.vertices.forEach((v, i) => {

      const x =
        Math.cos(v.angle) *
        r *
        v.radius;

      const y =
        Math.sin(v.angle) *
        r *
        v.radius;

      if (i === 0)
        spaceCtx.moveTo(x, y);
      else
        spaceCtx.lineTo(x, y);
    });

    spaceCtx.closePath();

    const g =
      spaceCtx.createRadialGradient(
        -r * 0.35,
        -r * 0.4,
        0,
        0,
        0,
        r * 1.25
      );

    g.addColorStop(
      0,
      "rgba(155,158,170,0.95)"
    );

    g.addColorStop(
      0.48,
      "rgba(70,73,82,0.98)"
    );

    g.addColorStop(
      1,
      "rgba(10,11,15,1)"
    );

    spaceCtx.fillStyle = g;
    spaceCtx.fill();

    /* small surface pits */

    for (let i = 0; i < 3; i++) {

      const px2 =
        rand(-r * 0.5, r * 0.5);

      const py2 =
        rand(-r * 0.5, r * 0.5);

      const pr =
        rand(r * 0.08, r * 0.2);

      spaceCtx.fillStyle =
        "rgba(0,0,0,0.20)";

      spaceCtx.beginPath();

      spaceCtx.arc(
        px2,
        py2,
        pr,
        0,
        Math.PI * 2
      );

      spaceCtx.fill();
    }

    spaceCtx.restore();
  }

  /* =========================================================
     METEORS
     ========================================================= */

  let meteors = [];

  function spawnMeteor(
    dramatic = false
  ) {

    const direction =
      Math.random() > 0.5 ? 1 : -1;

    const y =
      dramatic
        ? H * rand(0.25, 0.58)
        : H * rand(0.08, 0.7);

    meteors.push({
      x:
        direction === 1
          ? -120
          : W + 120,

      y,

      vx:
        direction *
        rand(7, dramatic ? 13 : 9),

      vy:
        rand(1.2, 3.6),

      life: 1,

      length:
        dramatic
          ? rand(26, 42)
          : rand(15, 27),

      width:
        dramatic
          ? 2
          : 1,

      alpha:
        dramatic
          ? 1
          : rand(0.55, 0.9)
    });
  }

  function drawMeteors() {

    for (
      let i = meteors.length - 1;
      i >= 0;
      i--
    ) {

      const m = meteors[i];

      m.x += m.vx;
      m.y += m.vy;

      m.life -= 0.012;

      const tx =
        m.x - m.vx * m.length * 0.15;

      const ty =
        m.y - m.vy * m.length * 0.15;

      const gradient =
        fxCtx.createLinearGradient(
          m.x,
          m.y,
          tx,
          ty
        );

      gradient.addColorStop(
        0,
        `rgba(255,255,255,${m.life * m.alpha})`
      );

      gradient.addColorStop(
        0.18,
        `rgba(210,225,255,${m.life * m.alpha * 0.55})`
      );

      gradient.addColorStop(
        1,
        "rgba(255,255,255,0)"
      );

      fxCtx.save();

      fxCtx.strokeStyle =
        gradient;

      fxCtx.lineWidth =
        m.width;

      fxCtx.lineCap = "round";

      fxCtx.shadowColor =
        `rgba(210,225,255,${m.life * 0.7})`;

      fxCtx.shadowBlur =
        m.width * 5;

      fxCtx.beginPath();

      fxCtx.moveTo(
        m.x,
        m.y
      );

      fxCtx.lineTo(
        tx,
        ty
      );

      fxCtx.stroke();

      fxCtx.restore();

      if (
        m.life <= 0 ||
        m.x < -250 ||
        m.x > W + 250 ||
        m.y > H + 250
      ) {
        meteors.splice(i, 1);
      }
    }
  }

  /* =========================================================
     SATELLITE
     ========================================================= */

  const satellite = {
    progress: -0.2,
    active: false
  };

  function drawSatellite(time, alpha) {

    if (!satellite.active)
      return;

    const p =
      satellite.progress;

    const x =
      lerp(
        W * 1.15,
        W * -0.15,
        p
      ) +
      pointerX * 30;

    const y =
      H * 0.27 +
      Math.sin(p * Math.PI * 2) *
      H * 0.13 +
      pointerY * 20;

    const scale =
      lerp(0.35, 1.0, Math.sin(p * Math.PI));

    const size =
      Math.min(W, H) * 0.025 * scale;

    const angle =
      -0.28 +
      Math.sin(time * 0.001) * 0.08;

    fxCtx.save();

    fxCtx.translate(x, y);
    fxCtx.rotate(angle);

    fxCtx.globalAlpha =
      alpha *
      clamp(Math.sin(p * Math.PI) * 2);

    /* antenna */

    fxCtx.strokeStyle =
      "rgba(220,225,240,0.78)";

    fxCtx.lineWidth =
      Math.max(0.7, size * 0.035);

    fxCtx.beginPath();

    fxCtx.moveTo(
      -size * 0.75,
      0
    );

    fxCtx.lineTo(
      -size * 1.8,
      -size * 0.25
    );

    fxCtx.moveTo(
      size * 0.75,
      0
    );

    fxCtx.lineTo(
      size * 1.8,
      -size * 0.25
    );

    fxCtx.stroke();

    /* solar panels */

    fxCtx.fillStyle =
      "rgba(92,112,155,0.78)";

    fxCtx.fillRect(
      -size * 2.1,
      -size * 0.48,
      size * 0.9,
      size * 0.72
    );

    fxCtx.fillRect(
      size * 1.2,
      -size * 0.48,
      size * 0.9,
      size * 0.72
    );

    /* body */

    fxCtx.fillStyle =
      "rgba(205,202,188,0.95)";

    fxCtx.fillRect(
      -size * 0.75,
      -size * 0.52,
      size * 1.5,
      size
    );

    /* small highlight */

    fxCtx.fillStyle =
      "rgba(255,255,255,0.7)";

    fxCtx.fillRect(
      -size * 0.35,
      -size * 0.42,
      size * 0.7,
      size * 0.12
    );

    fxCtx.restore();
  }

  /* =========================================================
     NUMBER PARTICLES
     ========================================================= */

  let numberParticles = [];

  function buildNumberParticles() {

    const off =
      document.createElement("canvas");

    off.width =
      Math.max(1, Math.floor(W));

    off.height =
      Math.max(1, Math.floor(H));

    const ctx =
      off.getContext("2d");

    const fontSize =
      Math.min(W, H) * 0.42;

    ctx.fillStyle = "#fff";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font =
      `500 ${fontSize}px "Cormorant Garamond", Georgia, serif`;

    ctx.fillText(
      String(C.newAge),
      W * 0.5,
      H * 0.46
    );

    const data =
      ctx.getImageData(
        0,
        0,
        off.width,
        off.height
      ).data;

    const step =
      Math.max(
        3,
        Math.floor(
          Math.min(W, H) / 180
        )
      );

    const points = [];

    for (
      let y = 0;
      y < H;
      y += step
    ) {

      for (
        let x = 0;
        x < W;
        x += step
      ) {

        const alpha =
          data[
            (y * off.width + x) * 4 + 3
          ];

        if (alpha > 80) {
          points.push({
            x,
            y
          });
        }
      }
    }

    /*
       Limit particle count for smoothness.
    */

    const max =
      W < 700
        ? 850
        : 1450;

    let sampled =
      points;

    if (points.length > max) {

      sampled =
        points
          .sort(() => Math.random() - 0.5)
          .slice(0, max);
    }

    numberParticles =
      sampled.map((p) => {

        const angle =
          Math.random() *
          Math.PI * 2;

        const radius =
          Math.max(W, H) *
          rand(0.35, 1.1);

        return {

          tx: p.x,
          ty: p.y,

          sx:
            W * 0.5 +
            Math.cos(angle) * radius,

          sy:
            H * 0.48 +
            Math.sin(angle) * radius,

          vx: rand(-0.3, 0.3),
          vy: rand(-0.3, 0.3),

          delay:
            Math.random() * 0.45,

          size:
            rand(0.65, 1.55),

          alpha:
            rand(0.55, 1),

          twinkle:
            rand(0, Math.PI * 2)
        };
      });
  }

  /* =========================================================
     NUMBER DRAW
     ========================================================= */

  let numberProgress = 0;
  let numberGlow = 0;

  function drawNumber(time) {

    numCtx.clearRect(
      0,
      0,
      W,
      H
    );

    if (!numberParticles.length)
      return;

    for (const p of numberParticles) {

      const local =
        clamp(
          (numberProgress - p.delay) /
          (1 - p.delay)
        );

      const e =
        easeOutExpo(local);

      let x =
        lerp(p.sx, p.tx, e);

      let y =
        lerp(p.sy, p.ty, e);

      /*
         Tiny settling turbulence.
      */

      if (local > 0.82) {

        const settle =
          (1 - local) * 2;

        x +=
          Math.sin(
            time * 0.0012 +
            p.twinkle
          ) *
          settle *
          1.6;

        y +=
          Math.cos(
            time * 0.001 +
            p.twinkle
          ) *
          settle *
          1.6;
      }

      const twinkle =
        0.84 +
        0.16 *
        Math.sin(
          time * 0.0017 +
          p.twinkle
        );

      const alpha =
        clamp(
          local * 1.4
        ) *
        p.alpha *
        twinkle;

      const size =
        lerp(
          p.size * 0.25,
          p.size * 1.18,
          e
        );

      numCtx.globalAlpha =
        alpha;

      numCtx.fillStyle =
        "rgba(246,247,255,1)";

      numCtx.shadowColor =
        "rgba(192,210,255,0.95)";

      numCtx.shadowBlur =
        lerp(
          0,
          8 + numberGlow * 8,
          e
        );

      numCtx.beginPath();

      numCtx.arc(
        x,
        y,
        size,
        0,
        Math.PI * 2
      );

      numCtx.fill();
    }

    numCtx.globalAlpha = 1;
    numCtx.shadowBlur = 0;
  }

  /* =========================================================
     FOREGROUND LIGHT STREAKS
     ========================================================= */

  const streaks =
    Array.from(
      { length: 22 },
      () => ({
        x: Math.random(),
        y: Math.random(),
        length: rand(20, 90),
        depth: rand(0.4, 1.0),
        speed: rand(0.2, 0.8)
      })
    );

  function drawSpeedStreaks(time, intensity) {

    if (intensity <= 0.001)
      return;

    fxCtx.save();

    fxCtx.globalCompositeOperation =
      "screen";

    for (const s of streaks) {

      const x =
        s.x * W +
        pointerX * s.depth * 80;

      const y =
        s.y * H +
        pointerY * s.depth * 50;

      const length =
        s.length *
        intensity *
        (0.6 + s.depth);

      const angle =
        -0.42;

      const dx =
        Math.cos(angle) *
        length;

      const dy =
        Math.sin(angle) *
        length;

      const g =
        fxCtx.createLinearGradient(
          x,
          y,
          x - dx,
          y - dy
        );

      g.addColorStop(
        0,
        `rgba(230,238,255,${0.18 * intensity})`
      );

      g.addColorStop(
        1,
        "rgba(230,238,255,0)"
      );

      fxCtx.strokeStyle = g;

      fxCtx.lineWidth =
        0.5 +
        s.depth * intensity;

      fxCtx.beginPath();

      fxCtx.moveTo(x, y);

      fxCtx.lineTo(
        x - dx,
        y - dy
      );

      fxCtx.stroke();
    }

    fxCtx.restore();
  }

  /* =========================================================
     MAIN WORLD STATE
     ========================================================= */

  let intro = 0;
  let flight = 0;
  let reveal = 0;
  let finalHold = 0;

  let running = true;

  let meteorCooldown =
    rand(100, 180);

  let satelliteProgress =
    -0.2;

  /* =========================================================
     RESIZE
     ========================================================= */

  function resize() {

    W =
      page.clientWidth;

    H =
      page.clientHeight;

    dpr =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );

    for (
      const canvas of [
        spaceCanvas,
        fxCanvas,
        numberCanvas
      ]
    ) {

      canvas.width =
        Math.floor(W * dpr);

      canvas.height =
        Math.floor(H * dpr);

      canvas.style.width =
        `${W}px`;

      canvas.style.height =
        `${H}px`;
    }

    spaceCtx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

    fxCtx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

    numCtx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

    starsBack =
      createStars(
        W < 700 ? 170 : 280,
        0.08,
        0.25,
        0.75
      );

    starsMid =
      createStars(
        W < 700 ? 110 : 190,
        0.32,
        0.4,
        1.15
      );

    starsFront =
      createStars(
        W < 700 ? 45 : 80,
        0.72,
        0.65,
        1.7
      );

    asteroids =
      Array.from(
        {
          length:
            W < 700 ? 6 : 11
        },
        createAsteroid
      );

    if (numberParticles.length) {
      buildNumberParticles();
    }
  }

  resize();

  const onResize =
    () => resize();

  window.addEventListener(
    "resize",
    onResize
  );

  /* =========================================================
     STAR DRAW
     ========================================================= */

  function drawStars(
    stars,
    time,
    alpha,
    motion
  ) {

    for (const star of stars) {

      const parallax =
        star.depth;

      let x =
        star.x * W +
        pointerX *
          parallax *
          70;

      let y =
        star.y * H +
        pointerY *
          parallax *
          55;

      /*
         During camera acceleration,
         foreground stars stretch.
      */

      const speedStretch =
        motion *
        parallax *
        35;

      x -= speedStretch;

      const twinkle =
        0.72 +
        0.28 *
        Math.sin(
          time *
            star.twinkleSpeed +
          star.twinkle
        );

      const a =
        star.alpha *
        alpha *
        twinkle;

      spaceCtx.globalAlpha =
        a;

      spaceCtx.fillStyle =
        `rgb(${star.color.join(",")})`;

      const r =
        star.size *
        (
          0.8 +
          parallax * 0.7
        );

      if (r > 1.1) {

        spaceCtx.shadowColor =
          `rgba(${star.color.join(",")},0.75)`;

        spaceCtx.shadowBlur =
          4 +
          parallax * 7;
      }

      spaceCtx.beginPath();

      spaceCtx.arc(
        x,
        y,
        r,
        0,
        Math.PI * 2
      );

      spaceCtx.fill();

      spaceCtx.shadowBlur = 0;
    }

    spaceCtx.globalAlpha = 1;
  }

  /* =========================================================
     PLANET POSITIONS
     ========================================================= */

  function drawWorld(time) {

    spaceCtx.clearRect(
      0,
      0,
      W,
      H
    );

    /*
       Background.
    */

    const bg =
      spaceCtx.createRadialGradient(
        W * 0.52,
        H * 0.43,
        0,
        W * 0.52,
        H * 0.43,
        Math.max(W, H) * 0.85
      );

    bg.addColorStop(
      0,
      "rgba(11,14,28,1)"
    );

    bg.addColorStop(
      0.55,
      "rgba(4,6,14,1)"
    );

    bg.addColorStop(
      1,
      "rgba(1,2,5,1)"
    );

    spaceCtx.fillStyle = bg;

    spaceCtx.fillRect(
      0,
      0,
      W,
      H
    );

    /*
       Nebula.
    */

    drawNebula(
      time,
      intro
    );

    /*
       Distant galaxy.
    */

    drawGalaxy(
      time,
      intro
    );

    /*
       Star layers.
    */

    drawStars(
      starsBack,
      time,
      intro * 0.72,
      flight
    );

    drawStars(
      starsMid,
      time,
      intro * 0.92,
      flight
    );

    drawStars(
      starsFront,
      time,
      intro,
      flight
    );

    /*
       Distant rocky planet.
    */

    const distantScale =
      Math.min(W, H);

    drawPlanet(
      W * 0.09 +
        pointerX * 18,

      H * 0.74 +
        pointerY * 12,

      distantScale * 0.045,

      {
        texture: rockTexture,

        lightX: -0.7,
        lightY: -0.65,

        atmosphere:
          [135,145,180],

        atmosphereAlpha:
          0.12,

        alpha:
          intro * 0.78,

        rotation:
          time * 0.000015
      }
    );

    /*
       Main gas giant.

       It approaches from the
       lower-right during the flight.
    */

    const planetApproach =
      easeOutCubic(
        clamp(flight)
      );

    const planetX =
      lerp(
        W * 1.22,
        W * 0.74,
        planetApproach
      ) +
      pointerX * 34;

    const planetY =
      lerp(
        H * 1.30,
        H * 0.48,
        planetApproach
      ) +
      pointerY * 25;

    const planetRadius =
      distantScale *
      lerp(
        0.065,
        0.145,
        planetApproach
      );

    drawPlanet(
      planetX,
      planetY,
      planetRadius,
      {
        texture: gasTexture,

        lightX: -0.72,
        lightY: -0.72,

        atmosphere:
          [112,135,210],

        atmosphereAlpha:
          0.24,

        ring:
          true,

        alpha:
          intro,

        rotation:
          time * 0.000025
      }
    );

    /*
       Tiny moon.
    */

    const moonOrbit =
      time * 0.00035;

    const moonDistance =
      planetRadius * 2.35;

    const moonX =
      planetX +
      Math.cos(moonOrbit) *
      moonDistance;

    const moonY =
      planetY +
      Math.sin(moonOrbit) *
      moonDistance *
      0.34;

    const moonR =
      planetRadius *
      0.13;

    const moonGradient =
      spaceCtx.createRadialGradient(
        moonX - moonR * 0.35,
        moonY - moonR * 0.35,
        0,
        moonX,
        moonY,
        moonR
      );

    moonGradient.addColorStop(
      0,
      "rgba(210,211,218,0.95)"
    );

    moonGradient.addColorStop(
      0.55,
      "rgba(95,97,107,0.85)"
    );

    moonGradient.addColorStop(
      1,
      "rgba(15,16,21,0.9)"
    );

    spaceCtx.globalAlpha =
      intro * 0.85;

    spaceCtx.fillStyle =
      moonGradient;

    spaceCtx.beginPath();

    spaceCtx.arc(
      moonX,
      moonY,
      moonR,
      0,
      Math.PI * 2
    );

    spaceCtx.fill();

    spaceCtx.globalAlpha = 1;

    /*
       Asteroid field.
    */

    for (const asteroid of asteroids) {

      asteroid.rotation +=
        asteroid.spin;

      /*
         Slow world drift.
      */

      asteroid.x +=
        asteroid.speed *
        (0.5 + flight * 3);

      asteroid.y +=
        asteroid.speed *
        0.28;

      if (asteroid.x > 1.35)
        asteroid.x = -0.35;

      if (asteroid.y > 1.35)
        asteroid.y = -0.35;

      drawAsteroid(
        asteroid,
        intro,
        time
      );
    }

    /*
       Meteors.
    */

    meteorCooldown -=
      1 + flight * 4;

    if (
      meteorCooldown <= 0 &&
      intro > 0.4
    ) {

      spawnMeteor(
        flight > 0.55
      );

      meteorCooldown =
        rand(
          flight > 0.6 ? 75 : 120,
          flight > 0.6 ? 150 : 220
        );
    }
  }

  /* =========================================================
     FX LAYER
     ========================================================= */

  function drawFX(time) {

    fxCtx.clearRect(
      0,
      0,
      W,
      H
    );

    /*
       Speed streaks.
    */

    drawSpeedStreaks(
      time,
      flight
    );

    /*
       Satellite.
    */

    if (
      flight > 0.2 &&
      flight < 0.86
    ) {

      satellite.active = true;

      satelliteProgress =
        clamp(
          (flight - 0.2) /
          0.66
        );

      satellite.progress =
        satelliteProgress;

      drawSatellite(
        time,
        intro
      );
    }

    drawMeteors();

    /*
       Cinematic center glow
       during number formation.
    */

    if (reveal > 0) {

      const g =
        fxCtx.createRadialGradient(
          W * 0.5,
          H * 0.46,
          0,
          W * 0.5,
          H * 0.46,
          Math.min(W, H) * 0.42
        );

      g.addColorStop(
        0,
        `rgba(180,200,255,${0.045 * reveal})`
      );

      g.addColorStop(
        0.45,
        `rgba(100,130,210,${0.018 * reveal})`
      );

      g.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      fxCtx.fillStyle = g;

      fxCtx.fillRect(
        0,
        0,
        W,
        H
      );
    }
  }

  /* =========================================================
     MAIN LOOP
     ========================================================= */

  function loop(time) {

    if (!running)
      return;

    /*
       Smooth pointer.
    */

    pointerX =
      lerp(
        pointerX,
        targetPointerX,
        0.055
      );

    pointerY =
      lerp(
        pointerY,
        targetPointerY,
        0.055
      );

    /*
       Camera movement.
    */

    camera.velocity =
      lerp(
        camera.velocity,
        camera.targetVelocity,
        0.035
      );

    camera.x =
      lerp(
        camera.x,
        pointerX * 18,
        0.035
      );

    camera.y =
      lerp(
        camera.y,
        pointerY * 14,
        0.035
      );

    camera.zoom =
      lerp(
        camera.zoom,
        1 + flight * 0.045,
        0.025
      );

    drawWorld(time);
    drawFX(time);
    drawNumber(time);

    requestAnimationFrame(
      loop
    );
  }

  requestAnimationFrame(loop);

  /* =========================================================
     CHOREOGRAPHY
     ========================================================= */

  await wait(180);

  page.classList.add(
    "chapter-visible"
  );

  /*
     0 → 1.6 sec
     Universe wakes up.
  */

  const introStart =
    performance.now();

  await new Promise((resolve) => {

    function animateIntro(time) {

      const p =
        clamp(
          (time - introStart) /
          1600
        );

      intro =
        easeInOutCubic(p);

      if (p < 1) {
        requestAnimationFrame(
          animateIntro
        );
      } else {
        resolve();
      }
    }

    requestAnimationFrame(
      animateIntro
    );
  });

  /*
     Small pause.
  */

  await wait(500);

  /*
     Begin camera flight.
  */

  camera.targetVelocity = 0.35;

  const flightStart =
    performance.now();

  await new Promise((resolve) => {

    function animateFlight(time) {

      const p =
        clamp(
          (time - flightStart) /
          4300
        );

      flight =
        easeInOutCubic(p);

      camera.targetVelocity =
        lerp(
          0.35,
          1.15,
          smoothstep(
            0.15,
            0.72,
            p
          )
        );

      if (p < 1) {
        requestAnimationFrame(
          animateFlight
        );
      } else {
        resolve();
      }
    }

    requestAnimationFrame(
      animateFlight
    );
  });

  /*
     Major meteor.
  */

  spawnMeteor(true);

  await wait(850);

  /*
     Slow the universe.
  */

  const brakeStart =
    performance.now();

  await new Promise((resolve) => {

    function brake(time) {

      const p =
        clamp(
          (time - brakeStart) /
          1200
        );

      flight =
        lerp(
          1,
          0.05,
          easeOutCubic(p)
        );

      camera.targetVelocity =
        lerp(
          1.15,
          0.02,
          easeOutCubic(p)
        );

      if (p < 1) {
        requestAnimationFrame(
          brake
        );
      } else {
        resolve();
      }
    }

    requestAnimationFrame(brake);
  });

  /*
     The universe becomes quiet.
  */

  await wait(450);

  /*
     Build 26.
  */

  buildNumberParticles();

  /*
     Number formation.
  */

  const revealStart =
    performance.now();

  await new Promise((resolve) => {

    function animateReveal(time) {

      const p =
        clamp(
          (time - revealStart) /
          2600
        );

      reveal =
        easeInOutCubic(p);

      numberProgress =
        p;

      numberGlow =
        smoothstep(
          0.45,
          0.9,
          p
        );

      if (p < 1) {

        camera.targetVelocity =
          lerp(
            0.02,
            0,
            p
          );

        requestAnimationFrame(
          animateReveal
        );

      } else {

        resolve();
      }
    }

    requestAnimationFrame(
      animateReveal
    );
  });

  /*
     Let the number breathe.
  */

  await wait(650);

  finalHold = 1;

  words.classList.add(
    "chapter-detail-visible"
  );

  await wait(650);

  line.classList.add(
    "chapter-line-visible"
  );

  await wait(550);

  sub.classList.add(
    "chapter-detail-visible"
  );

  await wait(1000);

  next.classList.add(
    "chapter-next-visible"
  );

  /* =========================================================
     NEXT
     ========================================================= */

  this.on(next, "click", async () => {

    next.disabled = true;

    page.classList.add(
      "chapter-leaving"
    );

    /*
       Accelerate through space
       during the transition.
    */

    const leaveStart =
      performance.now();

    await new Promise((resolve) => {

      function accelerate(time) {

        const p =
          clamp(
            (time - leaveStart) /
            950
          );

        camera.targetVelocity =
          lerp(
            0,
            4.5,
            easeInOutCubic(p)
          );

        flight =
          lerp(
            0,
            1.8,
            easeInCubicSafe(p)
          );

        if (p < 1) {
          requestAnimationFrame(
            accelerate
          );
        } else {
          resolve();
        }
      }

      function easeInCubicSafe(t) {
        return t * t * t;
      }

      requestAnimationFrame(
        accelerate
      );
    });

    running = false;

    window.removeEventListener(
      "resize",
      onResize
    );

    await wait(100);

    await this.go(
      SCENES.CELEBRATION
    );
  });
}
  async celebration() {

  /* =====================================================
     ENCHANTED GALA — PREMIUM CELEBRATION
     ===================================================== */

  const s = this.shell("", "");
  s.classList.add("enchanted-gala");

  /* =====================================================
     BACKGROUND
     ===================================================== */

  const atmosphere = document.createElement("div");
  atmosphere.className = "gala-atmosphere";
  s.appendChild(atmosphere);

  const nebula = document.createElement("div");
  nebula.className = "gala-nebula";
  s.appendChild(nebula);

  const stars = document.createElement("div");
  stars.className = "gala-stars";
  s.appendChild(stars);

  /* =====================================================
     FIREWORK LAYER
     ===================================================== */

  const fireworks = document.createElement("div");
  fireworks.className = "gala-fireworks";
  s.appendChild(fireworks);

  /* =====================================================
     BALLOON LAYER
     ===================================================== */

  const balloons = document.createElement("div");
  balloons.className = "gala-balloons";
  s.appendChild(balloons);

  /* =====================================================
     GLITTER LAYER
     ===================================================== */

  const magic = document.createElement("div");
  magic.className = "gala-magic";
  s.appendChild(magic);

  /* =====================================================
     WAND
     ===================================================== */

  const wand = document.createElement("div");
  wand.className = "fairy-wand";

  wand.innerHTML = `
    <span class="wand-aura"></span>

    <span class="wand-orbit orbit-one"></span>
    <span class="wand-orbit orbit-two"></span>

    <span class="wand-star">
      <i></i>
    </span>
  `;

  s.appendChild(wand);

  /* =====================================================
     MAIN CONTENT
     ===================================================== */

  const content = document.createElement("div");
  content.className = "gala-content";

  const eyebrow = document.createElement("div");
  eyebrow.className = "gala-eyebrow";

  eyebrow.innerHTML = `
    <span></span>
    TONIGHT IS YOURS
    <span></span>
  `;

  const title = document.createElement("h1");
  title.className = "gala-title";

  title.innerHTML = `
    <small>HAPPY</small>
    <strong>Birthday</strong>
    <em>${C.sisterName}</em>
  `;

  const subtitle = document.createElement("p");
  subtitle.className = "gala-subtitle";
  subtitle.textContent =
    "Touch a balloon. Let the celebration begin.";

  content.append(
    eyebrow,
    title,
    subtitle
  );

  s.appendChild(content);

  /* =====================================================
     STARS
     ===================================================== */

  for (let i = 0; i < 110; i++) {

    const star =
      document.createElement("span");

    star.className =
      "gala-star";

    star.style.left =
      `${Math.random() * 100}%`;

    star.style.top =
      `${Math.random() * 100}%`;

    star.style.setProperty(
      "--star-size",
      `${0.5 + Math.random() * 2}px`
    );

    star.style.setProperty(
      "--star-delay",
      `${Math.random() * 6}s`
    );

    star.style.setProperty(
      "--star-duration",
      `${2 + Math.random() * 5}s`
    );

    stars.appendChild(star);
  }

  /* =====================================================
     AUDIO CONTEXT
     ===================================================== */

  let audioContext = null;

  const getAudio = () => {

    try {

      if (!audioContext) {

        audioContext =
          new (
            window.AudioContext ||
            window.webkitAudioContext
          )();

      }

      if (
        audioContext.state ===
        "suspended"
      ) {
        audioContext.resume();
      }

      return audioContext;

    } catch {

      return null;

    }
  };

  /* =====================================================
     BALLOON POP SOUND
     ===================================================== */

  const popSound = () => {

    const ctx = getAudio();

    if (!ctx) return;

    const now =
      ctx.currentTime;

    /* noise */

    const buffer =
      ctx.createBuffer(
        1,
        Math.floor(
          ctx.sampleRate * 0.14
        ),
        ctx.sampleRate
      );

    const data =
      buffer.getChannelData(0);

    for (
      let i = 0;
      i < data.length;
      i++
    ) {

      data[i] =
        (Math.random() * 2 - 1) *
        Math.pow(
          1 - i / data.length,
          3
        );
    }

    const noise =
      ctx.createBufferSource();

    noise.buffer =
      buffer;

    const noiseGain =
      ctx.createGain();

    noiseGain.gain.setValueAtTime(
      0.0001,
      now
    );

    noiseGain.gain.exponentialRampToValueAtTime(
      0.34,
      now + 0.006
    );

    noiseGain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.12
    );

    noise.connect(
      noiseGain
    );

    noiseGain.connect(
      ctx.destination
    );

    noise.start(now);
    noise.stop(
      now + 0.14
    );

    /* low body */

    const body =
      ctx.createOscillator();

    const bodyGain =
      ctx.createGain();

    body.type =
      "sine";

    body.frequency.setValueAtTime(
      145,
      now
    );

    body.frequency.exponentialRampToValueAtTime(
      42,
      now + 0.14
    );

    bodyGain.gain.setValueAtTime(
      0.0001,
      now
    );

    bodyGain.gain.exponentialRampToValueAtTime(
      0.18,
      now + 0.008
    );

    bodyGain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.15
    );

    body.connect(
      bodyGain
    );

    bodyGain.connect(
      ctx.destination
    );

    body.start(now);
    body.stop(
      now + 0.16
    );
  };

  /* =====================================================
     FIREWORK SOUND
     ===================================================== */

  const fireworkSound = () => {

    const ctx = getAudio();

    if (!ctx) return;

    const now =
      ctx.currentTime;

    /* launch */

    const launch =
      ctx.createOscillator();

    const launchGain =
      ctx.createGain();

    launch.type =
      "sine";

    launch.frequency.setValueAtTime(
      180,
      now
    );

    launch.frequency.exponentialRampToValueAtTime(
      1100,
      now + 0.62
    );

    launchGain.gain.setValueAtTime(
      0.0001,
      now
    );

    launchGain.gain.exponentialRampToValueAtTime(
      0.045,
      now + 0.08
    );

    launchGain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.65
    );

    launch.connect(
      launchGain
    );

    launchGain.connect(
      ctx.destination
    );

    launch.start(now);
    launch.stop(
      now + 0.68
    );

    /* explosion */

    setTimeout(() => {

      const c = getAudio();

      if (!c) return;

      const t =
        c.currentTime;

      const explosion =
        c.createOscillator();

      const explosionGain =
        c.createGain();

      explosion.type =
        "sine";

      explosion.frequency.setValueAtTime(
        110,
        t
      );

      explosion.frequency.exponentialRampToValueAtTime(
        30,
        t + 0.35
      );

      explosionGain.gain.setValueAtTime(
        0.0001,
        t
      );

      explosionGain.gain.exponentialRampToValueAtTime(
        0.22,
        t + 0.01
      );

      explosionGain.gain.exponentialRampToValueAtTime(
        0.0001,
        t + 0.38
      );

      explosion.connect(
        explosionGain
      );

      explosionGain.connect(
        c.destination
      );

      explosion.start(t);

      explosion.stop(
        t + 0.4
      );

    }, 620);
  };

  /* =====================================================
     GLITTER BURST
     ===================================================== */

  /* =====================================================
   GOLDEN GLITTER — BURST + FALL
   ===================================================== */

const createGlitter = (
  x,
  y,
  amount = 52
) => {

  for (
    let i = 0;
    i < amount;
    i++
  ) {

    const particle =
      document.createElement("span");

    particle.className =
      "gala-glitter-particle";

    particle.style.left =
      `${x}px`;

    particle.style.top =
      `${y}px`;

    /* -------------------------------
       OUTWARD SPREAD
       ------------------------------- */

    particle.style.setProperty(
      "--dx",
      `${-130 + Math.random() * 260}px`
    );

    /* -------------------------------
       INITIAL UP/DOWN MOVEMENT
       ------------------------------- */

    particle.style.setProperty(
      "--dy",
      `${-120 + Math.random() * 90}px`
    );

    /* -------------------------------
       GRAVITY / FALL DISTANCE
       ------------------------------- */

    particle.style.setProperty(
      "--fall",
      `${110 + Math.random() * 240}px`
    );

    /* -------------------------------
       RANDOM SIZE
       ------------------------------- */

    particle.style.setProperty(
      "--size",
      `${2 + Math.random() * 4}px`
    );

    /* -------------------------------
       RANDOM ROTATION
       ------------------------------- */

    particle.style.setProperty(
      "--spin",
      `${180 + Math.random() * 720}deg`
    );

    /* -------------------------------
       RANDOM TIMING
       ------------------------------- */

    particle.style.setProperty(
      "--duration",
      `${1500 + Math.random() * 1300}ms`
    );

    particle.style.setProperty(
      "--delay",
      `${Math.random() * 100}ms`
    );

    magic.appendChild(
      particle
    );

    setTimeout(() => {

      particle.remove();

    }, 3100);
  }
};

  /* =====================================================
     BALLOON COLOURS
     ===================================================== */

  const balloonColours = [
    "gold",
    "rose",
    "ivory",
    "champagne"
  ];

  /* =====================================================
     CREATE BALLOON
     ===================================================== */

  const createBalloon = () => {

    const wrap =
      document.createElement("div");

    wrap.className =
      "gala-balloon-wrap";

    const balloon =
      document.createElement("button");

    balloon.type =
      "button";

    const colour =
      balloonColours[
        Math.floor(
          Math.random() *
          balloonColours.length
        )
      ];

    balloon.className =
      `gala-balloon gala-balloon-${colour}`;

    balloon.setAttribute(
      "aria-label",
      "Pop balloon"
    );

    balloon.innerHTML = `
      <span class="balloon-light"></span>
      <span class="balloon-shine"></span>
      <span class="balloon-knot"></span>
      <span class="balloon-string"></span>
    `;

    wrap.appendChild(
      balloon
    );

    balloons.appendChild(
      wrap
    );

    /* position */

    const side =
      Math.random() < 0.5
        ? "left"
        : "right";

    let x;

    if (side === "left") {

      x =
        3 +
        Math.random() * 29;

    } else {

      x =
        68 +
        Math.random() * 29;

    }

    const size =
      48 +
      Math.random() * 48;

    const duration =
      13 +
      Math.random() * 9;

    const drift =
      -55 +
      Math.random() * 110;

    const rotation =
      -8 +
      Math.random() * 16;

    wrap.style.left =
      `${x}%`;

    wrap.style.setProperty(
      "--balloon-size",
      `${size}px`
    );

    wrap.style.setProperty(
      "--rise-duration",
      `${duration}s`
    );

    wrap.style.setProperty(
  "--drift",
  `${drift}px`
);

    wrap.style.setProperty(
      "--rotation",
      `${rotation}deg`
    );

    wrap.style.animationDelay =
      `${-Math.random() * duration}s`;

    /* =================================================
       BALLOON HOVER
       ================================================= */

    this.on(
      balloon,
      "pointerenter",
      () => {

        balloon.classList.add(
          "balloon-hover"
        );

      }
    );

    this.on(
      balloon,
      "pointerleave",
      () => {

        balloon.classList.remove(
          "balloon-hover"
        );

      }
    );

    /* =================================================
       BALLOON POP
       ================================================= */

    let popped = false;

    this.on(
      balloon,
      "pointerdown",
      event => {

        event.preventDefault();

        if (popped) return;

        popped = true;

        const rect =
          balloon.getBoundingClientRect();

        const centerX =
          rect.left +
          rect.width / 2;

        const centerY =
          rect.top +
          rect.height / 2;

        /* sound */

        popSound();

        /* glitter */

        createGlitter(
          centerX,
          centerY,
          46
        );

        /* flash */

        const flash =
          document.createElement("div");

        flash.className =
          "gala-pop-flash";

        flash.style.left =
          `${centerX}px`;

        flash.style.top =
          `${centerY}px`;

        s.appendChild(
          flash
        );

        setTimeout(() => {
          flash.remove();
        }, 550);

        /* pop animation */

        balloon.classList.add(
          "gala-balloon-pop"
        );

        /* remove */

        setTimeout(() => {

          wrap.remove();

          /* new balloon appears */

          setTimeout(() => {

            if (
              document.body.contains(s)
            ) {
              createBalloon();
            }

          }, 500);

        }, 700);
      }
    );
  };

  /* =====================================================
     INITIAL BALLOONS
     ===================================================== */

  for (
    let i = 0;
    i < 12;
    i++
  ) {
    createBalloon();
  }

  /* =====================================================
     FIREWORK CREATION
     ===================================================== */

  const fireworkColours = [
    "gold",
    "rose",
    "violet",
    "blue",
    "emerald",
    "champagne",
    "white"
  ];

  const createFirework = (
    x,
    targetY,
    colour
  ) => {

    const firework =
      document.createElement("div");

    firework.className =
      `gala-firework firework-${colour}`;

    firework.style.left =
      `${x}%`;

    firework.style.setProperty(
      "--target-y",
      `${targetY}vh`
    );

    /* comet */

    const comet =
      document.createElement("span");

    comet.className =
      "firework-comet";

    /* trail */

    const tail =
      document.createElement("span");

    tail.className =
      "firework-tail";

    /* explosion */

    const explosion =
      document.createElement("div");

    explosion.className =
      "firework-explosion";

    /* rings */

    const ring1 =
      document.createElement("span");

    ring1.className =
      "firework-ring ring-one";

    const ring2 =
      document.createElement("span");

    ring2.className =
      "firework-ring ring-two";

    const core =
      document.createElement("span");

    core.className =
      "firework-core";

    explosion.append(
      ring1,
      ring2,
      core
    );

    /* outer sparks */

    for (
      let i = 0;
      i < 32;
      i++
    ) {

      const spark =
        document.createElement("span");

      spark.className =
        "firework-spark";

      spark.style.setProperty(
        "--angle",
        `${(360 / 32) * i}deg`
      );

      spark.style.setProperty(
        "--distance",
        `${55 + Math.random() * 95}px`
      );

      spark.style.setProperty(
        "--delay",
        `${Math.random() * 80}ms`
      );

      explosion.appendChild(
        spark
      );
    }

    /* inner sparks */

    for (
      let i = 0;
      i < 18;
      i++
    ) {

      const spark =
        document.createElement("span");

      spark.className =
        "firework-inner-spark";

      spark.style.setProperty(
        "--angle",
        `${(360 / 18) * i}deg`
      );

      spark.style.setProperty(
        "--distance",
        `${25 + Math.random() * 55}px`
      );

      explosion.appendChild(
        spark
      );
    }

    /* crackles */

    for (
      let i = 0;
      i < 12;
      i++
    ) {

      const crack =
        document.createElement("span");

      crack.className =
        "firework-crackle";

      crack.style.setProperty(
        "--angle",
        `${Math.random() * 360}deg`
      );

      crack.style.setProperty(
        "--distance",
        `${90 + Math.random() * 75}px`
      );

      crack.style.setProperty(
        "--delay",
        `${550 + Math.random() * 500}ms`
      );

      explosion.appendChild(
        crack
      );
    }

    firework.append(
      comet,
      tail,
      explosion
    );

    fireworks.appendChild(
      firework
    );

    fireworkSound();

    setTimeout(() => {
      firework.remove();
    }, 2800);
  };

  /* =====================================================
     FIREWORK CHANNELS
     ===================================================== */

  const fireworkTimers = [];

  const positions = [
    10,
    24,
    38,
    62,
    76,
    90
  ];

  const startFireworkChannel = (
    index
  ) => {

    const launch = () => {

      const x =
        positions[index] +
        (-5 + Math.random() * 10);

      const y =
        12 +
        Math.random() * 38;

      const colour =
        fireworkColours[
          Math.floor(
            Math.random() *
            fireworkColours.length
          )
        ];

      createFirework(
        x,
        y,
        colour
      );

      fireworkTimers[index] =
        setTimeout(
          launch,
          1800 +
          Math.random() * 3000
        );
    };

    fireworkTimers[index] =
      setTimeout(
        launch,
        900 +
        index * 500
      );
  };

  for (
    let i = 0;
    i < positions.length;
    i++
  ) {

    startFireworkChannel(i);

  }

  /* =====================================================
     CURSOR MAGIC
     ===================================================== */

  let mouseX = -100;
  let mouseY = -100;

  let targetX = -100;
  let targetY = -100;

  let lastTrail =
    0;

  this.on(
    s,
    "pointermove",
    event => {

      targetX =
        event.clientX;

      targetY =
        event.clientY;
    }
  );

  const animateMagic = () => {

    mouseX +=
      (targetX - mouseX) *
      0.16;

    mouseY +=
      (targetY - mouseY) *
      0.16;

    wand.style.transform =
      `translate3d(
        ${mouseX - 34}px,
        ${mouseY - 34}px,
        0
      )`;

    const now =
      performance.now();

    if (
      now - lastTrail >
      28
    ) {

      lastTrail =
        now;

      const particle =
        document.createElement("span");

      particle.className =
        "wand-trail-particle";

      particle.style.left =
        `${mouseX}px`;

      particle.style.top =
        `${mouseY}px`;

      particle.style.setProperty(
        "--trail-x",
        `${-18 + Math.random() * 36}px`
      );

      particle.style.setProperty(
        "--trail-y",
        `${8 + Math.random() * 24}px`
      );

      magic.appendChild(
        particle
      );

      setTimeout(() => {
        particle.remove();
      }, 1100);
    }

    wand._raf =
      requestAnimationFrame(
        animateMagic
      );
  };

  animateMagic();

  /* =====================================================
   BACKGROUND MOVEMENT
   ===================================================== */

/*
   IMPORTANT:
   Do NOT move the birthday text.

   The text stays perfectly centered.
   Only the background atmosphere moves.
*/

this.on(s, "pointermove", (event) => {

  const rect =
    s.getBoundingClientRect();

  const x =
    (event.clientX - rect.left) /
      rect.width -
    0.5;

  const y =
    (event.clientY - rect.top) /
      rect.height -
    0.5;

  atmosphere.style.setProperty(
    "--mouse-x",
    `${x * 10}px`
  );

  atmosphere.style.setProperty(
    "--mouse-y",
    `${y * 10}px`
  );

  nebula.style.setProperty(
    "--mouse-x",
    `${x * -12}px`
  );

  nebula.style.setProperty(
    "--mouse-y",
    `${y * -12}px`
  );
});

  /* =====================================================
     BACKGROUND CLICK GLITTER
     ===================================================== */

  this.on(
    s,
    "pointerdown",
    event => {

      if (
        event.target.closest(
          "button"
        )
      ) {
        return;
      }

      createGlitter(
        event.clientX,
        event.clientY,
        24
      );
    }
  );

  /* =====================================================
     PARALLAX
     ===================================================== */

  this.on(
    s,
    "pointermove",
    event => {

      const rect =
        s.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
          rect.width -
        0.5;

      const y =
        (event.clientY - rect.top) /
          rect.height -
        0.5;

      atmosphere.style.transform =
        `translate3d(
          ${x * 10}px,
          ${y * 10}px,
          0
        )`;

      nebula.style.transform =
        `translate3d(
          ${x * -14}px,
          ${y * -14}px,
          0
        )`;

      
    }
  );

  /* =====================================================
     NEXT
     ===================================================== */

  const next =
    this.button(
      "NEXT →",
      "gala-next"
    );

  s.appendChild(
    next
  );

  this.on(
    next,
    "click",
    () => {

      fireworkTimers.forEach(
        timer => {
          clearTimeout(timer);
        }
      );

      if (wand._raf) {

        cancelAnimationFrame(
          wand._raf
        );

      }

      if (audioContext) {

        try {
          audioContext.close();
        } catch {}

      }

      this.go(
        SCENES.CALM
      );
    }
  );

  /* =====================================================
     CLEANUP
     ===================================================== */

  this.cleanup.push(() => {

    fireworkTimers.forEach(
      timer => {
        clearTimeout(timer);
      }
    );

    if (wand._raf) {

      cancelAnimationFrame(
        wand._raf
      );

    }

    if (audioContext) {

      try {
        audioContext.close();
      } catch {}

    }

  });
}
  async calm() {
  const s = this.shell("", "");
  s.classList.add("calm-orbit");

  /* =====================================================
     BACKGROUND
     ===================================================== */

  const background = document.createElement("div");
  background.className = "orbit-background";
  s.appendChild(background);

  const stars = document.createElement("div");
  stars.className = "orbit-stars";
  s.appendChild(stars);

  /* Create subtle stars */
  for (let i = 0; i < 90; i++) {
    const star = document.createElement("span");

    star.className = "orbit-star";

    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;

    star.style.setProperty(
      "--size",
      `${0.5 + Math.random() * 1.8}px`
    );

    star.style.setProperty(
      "--delay",
      `${Math.random() * 6}s`
    );

    star.style.setProperty(
      "--duration",
      `${3 + Math.random() * 5}s`
    );

    stars.appendChild(star);
  }

  /* =====================================================
     CENTRAL CELESTIAL OBJECT
     ===================================================== */

  const universe = document.createElement("div");
  universe.className = "orbit-universe";
  s.appendChild(universe);

  const halo = document.createElement("div");
  halo.className = "orbit-halo";
  universe.appendChild(halo);

  const ringOuter = document.createElement("div");
  ringOuter.className = "orbit-ring orbit-ring-outer";
  universe.appendChild(ringOuter);

  const ringMiddle = document.createElement("div");
  ringMiddle.className = "orbit-ring orbit-ring-middle";
  universe.appendChild(ringMiddle);

  const ringInner = document.createElement("div");
  ringInner.className = "orbit-ring orbit-ring-inner";
  universe.appendChild(ringInner);

  const core = document.createElement("div");
  core.className = "orbit-core";

  core.innerHTML = `
    <span></span>
    <i></i>
  `;

  universe.appendChild(core);

  /* =====================================================
     ORBITING PARTICLES
     ===================================================== */

  const orbitParticles = document.createElement("div");
  orbitParticles.className = "orbit-particles";
  universe.appendChild(orbitParticles);

  for (let i = 0; i < 14; i++) {
    const particle = document.createElement("span");

    particle.className = "orbit-particle";

    particle.style.setProperty(
      "--angle",
      `${(360 / 14) * i}deg`
    );

    particle.style.setProperty(
      "--distance",
      `${105 + Math.random() * 45}px`
    );

    particle.style.setProperty(
      "--particle-delay",
      `${Math.random() * 3}s`
    );

    orbitParticles.appendChild(particle);
  }

  /* =====================================================
     TEXT
     ===================================================== */

  const message = document.createElement("div");
  message.className = "orbit-message";

  message.innerHTML = `
    <div class="orbit-eyebrow">
      A LITTLE PAUSE
    </div>

    <div class="orbit-main">
      some moments are<br>
      meant to be remembered
    </div>

    <div class="orbit-divider"></div>

    <div class="orbit-secondary">
      there's one more thing...
    </div>
  `;

  s.appendChild(message);

  /* =====================================================
     NEXT BUTTON
     ===================================================== */

  const next = this.button("NEXT →", "orbit-next");
  s.appendChild(next);

  /* =====================================================
     INTERACTION
     ===================================================== */

  let mouseX = 0;
  let mouseY = 0;

  this.on(s, "pointermove", (event) => {
    const rect = s.getBoundingClientRect();

    mouseX =
      (event.clientX - rect.left) / rect.width - 0.5;

    mouseY =
      (event.clientY - rect.top) / rect.height - 0.5;

    universe.style.setProperty(
      "--mouse-x",
      `${mouseX * 8}px`
    );

    universe.style.setProperty(
      "--mouse-y",
      `${mouseY * 8}px`
    );

    background.style.setProperty(
      "--bg-x",
      `${mouseX * -14}px`
    );

    background.style.setProperty(
      "--bg-y",
      `${mouseY * -10}px`
    );
  });

  /* Clicking the central light creates a tiny ripple */

  this.on(core, "pointerdown", () => {
    core.classList.remove("orbit-pulse");

    void core.offsetWidth;

    core.classList.add("orbit-pulse");
  });

  /* =====================================================
     NAVIGATION
     ===================================================== */

  this.on(next, "click", () => {
    this.go(SCENES.LETTER);
  });
}

  async letter() {
  const s = this.shell("", "");
  s.classList.add("letter-cinematic");

  /* =========================
     BACKGROUND
     ========================= */

  const ambient = document.createElement("div");
  ambient.className = "letter-ambient";
  s.appendChild(ambient);

  const vignette = document.createElement("div");
  vignette.className = "letter-vignette";
  s.appendChild(vignette);

  /* =========================
     FLOATING PARTICLES
     ========================= */

  const particles = document.createElement("div");
  particles.className = "letter-particle-field";
  s.appendChild(particles);

  for (let i = 0; i < 70; i++) {
    const p = document.createElement("span");
    p.className = "letter-floating-particle";

    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;

    p.style.setProperty(
      "--particle-size",
      `${0.5 + Math.random() * 2}px`
    );

    p.style.setProperty(
      "--particle-duration",
      `${5 + Math.random() * 8}s`
    );

    p.style.setProperty(
      "--particle-delay",
      `${Math.random() * 7}s`
    );

    particles.appendChild(p);
  }

  /* =========================
     DECORATIVE ORBIT
     ========================= */

  const orbit = document.createElement("div");
  orbit.className = "letter-orbit";
  s.appendChild(orbit);

  for (let i = 0; i < 4; i++) {
    const spark = document.createElement("span");
    spark.className = "letter-orbit-spark";
    spark.style.setProperty("--spark-angle", `${i * 90}deg`);
    spark.style.setProperty("--spark-delay", `${i * .8}s`);
    orbit.appendChild(spark);
  }

  /* =========================
     MAIN CONTENT
     ========================= */

  const content = document.createElement("div");
  content.className = "letter-cinematic-content";
  s.appendChild(content);

  /* eyebrow */

  const eyebrow = document.createElement("div");
  eyebrow.className = "letter-cinematic-eyebrow";

  eyebrow.innerHTML = `
    <span></span>
    <b>✦</b>
    A LETTER FOR YOU
    <b>✦</b>
    <span></span>
  `;

  content.appendChild(eyebrow);

  /* title */

  const title = document.createElement("h1");
  title.className = "letter-cinematic-title";

  title.innerHTML = `
    One last little
    <em>question</em>
  `;

  content.appendChild(title);

  /* subtitle */

  const subtitle = document.createElement("p");
  subtitle.className = "letter-cinematic-subtitle";
  subtitle.textContent = "There is something waiting for you.";

  content.appendChild(subtitle);

  /* =========================
     ENVELOPE
     ========================= */

  const envelopeStage = document.createElement("div");
  envelopeStage.className = "cinematic-envelope-stage";

  content.appendChild(envelopeStage);

  const envelopeShadow = document.createElement("div");
  envelopeShadow.className = "cinematic-envelope-shadow";
  envelopeStage.appendChild(envelopeShadow);

  const envelopeGlow = document.createElement("div");
  envelopeGlow.className = "cinematic-envelope-glow";
  envelopeStage.appendChild(envelopeGlow);

  const env = document.createElement("div");
  env.className = "envelope-wrap cinematic-envelope";
  envelopeStage.appendChild(env);

  /* envelope body */

  const envelopeBack = document.createElement("div");
  envelopeBack.className = "envelope-back";
  env.appendChild(envelopeBack);

  /* inside paper */

  const insidePaper = document.createElement("div");
  insidePaper.className = "envelope-inside-paper";

  insidePaper.innerHTML = `
    <span>For you</span>
  `;

  env.appendChild(insidePaper);

  /* left flap */

  const flapLeft = document.createElement("div");
  flapLeft.className = "envelope-flap envelope-flap-left";
  env.appendChild(flapLeft);

  /* right flap */

  const flapRight = document.createElement("div");
  flapRight.className = "envelope-flap envelope-flap-right";
  env.appendChild(flapRight);

  /* bottom flap */

  const flapBottom = document.createElement("div");
  flapBottom.className = "envelope-flap envelope-flap-bottom";
  env.appendChild(flapBottom);

  /* top flap */

  const flapTop = document.createElement("div");
  flapTop.className = "envelope-flap envelope-flap-top";
  env.appendChild(flapTop);

  /* envelope writing */

  const envelopeText = document.createElement("div");
  envelopeText.className = "envelope-address";

  envelopeText.innerHTML = `
    <span>For</span>
    <strong>Harshita</strong>
  `;

  env.appendChild(envelopeText);

  /* wax seal */

  const seal = document.createElement("div");
  seal.className = "envelope-seal";

  seal.innerHTML = `
    <span>♡</span>
  `;

  env.appendChild(seal);

  /* =========================
     QUESTION
     ========================= */

  const question = document.createElement("div");
  question.className = "letter-cinematic-question";
  question.textContent = "Would you like to read it?";

  content.appendChild(question);

  /* =========================
     ACTIONS
     ========================= */

  const actions = document.createElement("div");
  actions.className = "letter-cinematic-actions";

  const yes = this.button("✉  OPEN THE LETTER", "yes-btn");
  const no = this.button("NOT YET", "no-btn");

  actions.append(yes, no);
  content.appendChild(actions);

  /* =========================
     NO BUTTON INTERACTION
     ========================= */

  let noClicks = 0;

  this.on(no, "click", () => {
    noClicks++;

    const p = Math.min(
      noClicks / C.noClickLimit,
      1
    );

    yes.style.transform =
      `scale(${1 + p * 0.3})`;

    no.style.transform =
      `scale(${1 - p * 0.5})`;

    env.classList.remove("envelope-tease");

    void env.offsetWidth;

    env.classList.add("envelope-tease");

    /* make the seal react */

    seal.classList.remove("seal-pulse");

    void seal.offsetWidth;

    seal.classList.add("seal-pulse");

    if (noClicks >= C.noClickLimit) {
      no.classList.add("gone");
      no.disabled = true;
    }
  });

  /* =========================
     OPEN LETTER
     ========================= */

  this.on(yes, "click", () => {

    yes.disabled = true;
    no.disabled = true;

    env.classList.add("cinematic-envelope-opening");

    seal.classList.add("seal-opening");

    setTimeout(() => {
      this.openLetter(
        env,
        s,
        actions
      );
    }, 950);
  });

  /* =========================
     MOUSE PARALLAX
     ========================= */

  this.on(s, "pointermove", (event) => {

    const rect = s.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
      rect.width - 0.5;

    const y =
      (event.clientY - rect.top) /
      rect.height - 0.5;

    content.style.setProperty(
      "--content-x",
      `${x * 7}px`
    );

    content.style.setProperty(
      "--content-y",
      `${y * 5}px`
    );

    envelopeStage.style.setProperty(
      "--env-x",
      `${x * 12}px`
    );

    envelopeStage.style.setProperty(
      "--env-y",
      `${y * 10}px`
    );

    ambient.style.setProperty(
      "--ambient-x",
      `${x * -20}px`
    );

    ambient.style.setProperty(
      "--ambient-y",
      `${y * -14}px`
    );
  });
}

  async openLetter(env, s, actions) {

  /* =====================================================
     FADE OUT THE QUESTION
     ===================================================== */

  actions.classList.add("fade");

  env.classList.add("open");

  await wait(1000);

  /* =====================================================
     REMOVE THE OLD QUESTION
     ===================================================== */

  actions.style.display = "none";

  /* =====================================================
     LETTER PAPER
     ===================================================== */

  const paper = document.createElement("article");
  paper.className = "letter-paper-premium";

  const paperGlow = document.createElement("div");
  paperGlow.className = "letter-paper-glow";
  s.appendChild(paperGlow);

  const r = await safeAsset(
    C.assets.letterPaper,
    { kind: "img" }
  );

  if (r.ok) {
    paper.style.backgroundImage =
      `url("${C.assets.letterPaper}")`;
  }

  /* =====================================================
     PAPER HEADER
     ===================================================== */

  const paperHeader = document.createElement("div");
  paperHeader.className = "letter-paper-header";

  paperHeader.innerHTML = `
    <span></span>
    A FEW WORDS FOR YOU
    <span></span>
  `;

  paper.appendChild(paperHeader);

  /* =====================================================
     LETTER TEXT
     ===================================================== */

  const text = document.createElement("div");
  text.className = "letter-text-premium";

  paper.appendChild(text);

  /* =====================================================
     SIGNATURE
     ===================================================== */

  const signature = document.createElement("div");
  signature.className = "letter-signature";

  signature.textContent = "— with love";

  paper.appendChild(signature);

  s.appendChild(paper);

  /* =====================================================
     TYPEWRITER
     ===================================================== */

  typeText(
    text,
    C.letterText,
    {
      speed:18
    }
  );

  /* =====================================================
     NEXT BUTTON
     ===================================================== */

  const next = this.button(
    "NEXT →",
    "letter-paper-next"
  );

  s.appendChild(next);

  /* =====================================================
     SUBTLE PAPER MOVEMENT
     ===================================================== */

  this.on(s, "pointermove", (event) => {

    const rect =
      s.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
      rect.width - 0.5;

    const y =
      (event.clientY - rect.top) /
      rect.height - 0.5;

    paper.style.setProperty(
      "--paper-x",
      `${x * 4}px`
    );

    paper.style.setProperty(
      "--paper-y",
      `${y * 4}px`
    );

  });

  /* =====================================================
     NEXT → FINAL
     ===================================================== */

  this.on(next, "click", () => {
    this.go(SCENES.FINAL);
  });
}

     async final() {
    const s = this.shell("", "");
    s.classList.add("harshita-final-premium");

    const el = (tag, className) => {
      const e = document.createElement(tag);
      if (className) e.className = className;
      return e;
    };

    // --- Background layers ---
    const sky = el("div", "final-sky");
    const nebula = el("div", "final-nebula");
    const moon = el("div", "final-moon");
    const moonCore = el("div", "final-moon-core");
    moon.appendChild(moonCore);

    s.append(sky, nebula, moon);

    // --- Stars ---
    const starsWrap = el("div", "final-stars");
    for (let i = 0; i < 70; i++) {
      const star = el("span", "final-star");
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty("--star-size", `${(1 + Math.random() * 2).toFixed(1)}px`);
      star.style.setProperty("--star-duration", `${(2 + Math.random() * 3).toFixed(2)}s`);
      star.style.setProperty("--star-delay", `${(Math.random() * 5).toFixed(2)}s`);
      starsWrap.appendChild(star);
    }
    s.appendChild(starsWrap);

    // --- Gold dust ---
    const dustWrap = el("div", "final-dust");
    for (let i = 0; i < 22; i++) {
      const p = el("span", "final-dust-particle");
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${55 + Math.random() * 40}%`;
      p.style.setProperty("--dust-size", `${(2 + Math.random() * 2.5).toFixed(1)}px`);
      p.style.setProperty("--dust-duration", `${(4 + Math.random() * 4).toFixed(2)}s`);
      p.style.setProperty("--dust-delay", `${(Math.random() * 6).toFixed(2)}s`);
      dustWrap.appendChild(p);
    }
    s.appendChild(dustWrap);

    // --- Constellation ---
    const constellation = el("div", "final-constellation");
    const linesWrap = el("div", "final-constellation-lines");
    constellation.appendChild(linesWrap);

    const points = [
      { x: 18, y: 68 }, { x: 33, y: 32 }, { x: 50, y: 52 },
      { x: 66, y: 22 }, { x: 82, y: 58 }, { x: 52, y: 82 }, { x: 28, y: 14 },
    ];

    points.forEach((pt, i) => {
      const point = el("span", "final-constellation-point");
      point.style.left = `${pt.x}%`;
      point.style.top = `${pt.y}%`;
      point.style.setProperty("--point-delay", `${(1.6 + i * 0.15).toFixed(2)}s`);
      constellation.appendChild(point);
    });

    const lineEls = [];
    for (let i = 0; i < points.length - 1; i++) {
      const line = el("div", "final-constellation-line");
      line.style.setProperty("--line-delay", `${(1.8 + i * 0.15).toFixed(2)}s`);
      linesWrap.appendChild(line);
      lineEls.push(line);
    }

    const layoutConstellation = () => {
      const rect = constellation.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      if (!w || !h) return;
      for (let i = 0; i < lineEls.length; i++) {
        const a = points[i], b = points[i + 1];
        const ax = (a.x / 100) * w, ay = (a.y / 100) * h;
        const bx = (b.x / 100) * w, by = (b.y / 100) * h;
        const dx = bx - ax, dy = by - ay;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const line = lineEls[i];
        line.style.left = `${ax}px`;
        line.style.top = `${ay}px`;
        line.style.width = `${length}px`;
        line.style.setProperty("--line-angle", `${angle}deg`);
        line.style.transform = `rotate(${angle}deg)`;
      }
    };

    s.appendChild(constellation);
    requestAnimationFrame(layoutConstellation);
    this.on(window, "resize", layoutConstellation);

    // --- Content ---
    const content = el("div", "final-premium-content");

    const eyebrow = el("div", "final-premium-eyebrow");
    const eyebrowLabel = document.createElement("b");
    eyebrowLabel.style.fontWeight = "600";
    eyebrowLabel.textContent = "FOR YOU, HARSHITA";
    eyebrow.append(el("span"), eyebrowLabel, el("span"));
    content.appendChild(eyebrow);

    const name = document.createElement("h1");
    name.className = "final-premium-name";
    "HARSHITA".split("").forEach((ch, i) => {
      const letter = el("span", "final-name-letter");
      letter.style.setProperty("--letter-index", i);
      letter.textContent = ch;
      name.appendChild(letter);
    });
    content.appendChild(name);

    const divider = el("div", "final-premium-divider");
    const diamond = document.createElement("b");
    diamond.textContent = "✦";
    divider.append(el("span"), diamond, el("span"));
    content.appendChild(divider);

    const message = document.createElement("p");
    message.className = "final-premium-message";
    const messageText =
      "May this new year of your life bring you beautiful moments, peaceful days, endless smiles, and everything your heart quietly wishes for.";
    messageText.split(" ").forEach((word, i) => {
      const w = el("span", "final-message-word");
      w.style.setProperty("--word-index", i);
      w.textContent = word + " ";
      message.appendChild(w);
    });
    content.appendChild(message);

    const signature = el("div", "final-signature");
    const sigScript = document.createElement("span");
    sigScript.textContent = "With love,";
    const sigName = document.createElement("strong");
    sigName.textContent = "ANNA"; // e.g. "Your Brother"
    signature.append(sigScript, sigName);
    content.appendChild(signature);

    const end = this.button("Saaku malko", "final-premium-btn");
    content.appendChild(end);

    s.appendChild(content);

    const fxLayer = el("div", "fx-layer");
    s.appendChild(fxLayer);

    const fx = new CelebrationFX(fxLayer);
    fx.start({ duration: Infinity });

    let fxStopped = false;
    const stopFx = (immediate) => {
      if (fxStopped) return;
      fxStopped = true;
      fx.stop(immediate);
    };
    this.cleanup.push(() => stopFx(false));

    let cancelled = false;
    this.cleanup.push(() => { cancelled = true; });

    // --- Parallax (CSS transitions already defined on nebula/moon/constellation/content) ---
    let parallaxActive = true;
    const onPointerMove = (e) => {
      if (!parallaxActive) return;
      const rect = s.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      nebula.style.transform = `translate(${nx * 22}px, ${ny * 22}px)`;
      moon.style.transform = `translate(calc(-50% + ${nx * -14}px), calc(-50% + ${ny * -14}px))`;
      constellation.style.transform = `translate(calc(-50% + ${nx * 26}px), calc(-50% + ${ny * 18}px))`;
      content.style.transform = `translate(calc(-50% + ${nx * 8}px), calc(-50% + ${ny * 8}px))`;
    };
    const onPointerLeave = () => {
      nebula.style.transform = "";
      moon.style.transform = "translate(-50%,-50%)";
      constellation.style.transform = "translate(-50%,-50%)";
      content.style.transform = "translate(-50%,-50%)";
    };
    this.on(s, "pointermove", onPointerMove);
    this.on(s, "pointerleave", onPointerLeave);

    // --- Magnetic button ---
    const onBtnMove = (e) => {
      const r = end.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      end.style.transform = `translate(${mx * 0.18}px, ${my * 0.28}px)`;
    };
    const onBtnLeave = () => { end.style.transform = "translate(0,0)"; };
    this.on(end, "pointermove", onBtnMove);
    this.on(end, "pointerleave", onBtnLeave);

    // --- Ending sequence ---
    const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

        this.on(end, "click", async () => {
      if (end.disabled) return;
      end.disabled = true;
      parallaxActive = false;
      end.style.transform = "translate(0,0)";
      s.classList.add("final-premium-ending");

      const start = performance.now();
      const fadeDuration = 3800;

      // grab the currently playing music, whatever it's called in your setup
      const music = this.music || this.audio || window.bgMusic || null;
      const musicStartVolume = music ? music.volume : 0;

      const reduce = () => {
        if (cancelled) return;
        const raw = Math.min(1, (performance.now() - start) / fadeDuration);
        const eased = easeOutExpo(raw);
        fxLayer.style.opacity = String(1 - eased);

        // fade the song out over the same curve/duration as the confetti
        if (music) {
          music.volume = Math.max(0, musicStartVolume * (1 - eased));
        }

        if (raw < 1) requestAnimationFrame(reduce);
      };
      requestAnimationFrame(reduce);

      await wait(3900);
      if (cancelled) return;

      stopFx(false);

      // fully silence and stop the track once the fade finishes
      if (music) {
        music.volume = 0;
        music.pause();
      }

      s.classList.add("final-premium-dark");

      await wait(1800);
      if (cancelled) return;

      const fade = document.createElement("div");
      fade.className = "final-premium-blackout";
      this.root.appendChild(fade);

      await wait(3200);
      if (cancelled) return;

      this.root.classList.add("complete-black");
    });
  }
}