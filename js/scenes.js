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
  const s = this.shell("A tiny mystery", "Yaar du birthday?");

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

      // WRONG ANSWERS
      if (option !== "Nindu") {
        b.classList.add("wrong");
        return;
      }

      // ==========================
      // CORRECT ANSWER - NINDU
      // ==========================

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
  const s = this.shell("", "PLEASE OPEN THESE CURTAINS");

  s.classList.add("curtain-stage");

  // LEFT CURTAIN
  const left = document.createElement("div");
  left.className = "curtain curtain-left";

  // RIGHT CURTAIN
  const right = document.createElement("div");
  right.className = "curtain curtain-right";

  // Curtain images
  left.style.backgroundImage =
    `url("${C.assets.curtainLeft}")`;

  right.style.backgroundImage =
    `url("${C.assets.curtainRight}")`;

  this.root.append(left);
  this.root.append(right);

  // OPEN BUTTON
  const b = this.button(
    "OPEN THE CURTAINS",
    "curtain-btn"
  );

  this.add(b);

  this.on(b, "click", async () => {

    b.disabled = true;

    // Open curtains
    left.classList.add("open");
    right.classList.add("open");

    // Wait for curtain animation
    await wait(1800);

    // Go to bulb scene
    await this.go(SCENES.BULB);
  });
}

  async bulb() {
    const s=this.shell("The stage went quiet", "WHY IT'S DARK?");
    const p=document.createElement("p"); p.className="subtle"; p.textContent="TURN ON LIGHT"; s.appendChild(p);
    const bulb=document.createElement("button"); bulb.className="bulb-btn"; bulb.setAttribute("aria-label","Turn on light"); bulb.type="button";
    const r=await safeAsset(C.assets.bulb,{kind:"img"});
    if(r.ok) bulb.style.backgroundImage=`url("${C.assets.bulb}")`;
    else bulb.appendChild(resourceFallback("BULB IMAGE GOES HERE"));
    s.appendChild(bulb);
    this.on(bulb,"click",()=>this.go(SCENES.MUSIC));
  }

  async musicScene() {
    const s=this.shell("Almost there", "WHY IT'S SO SILENT?");
    const p=document.createElement("p"); p.className="subtle"; p.textContent="PLAY MUSIC"; s.appendChild(p);
    const b=this.button("♫","music-btn"); b.setAttribute("aria-label","Play Happy Birthday music"); s.appendChild(b);
    this.on(b,"click",()=>this.go(SCENES.AGE));
  }

  async age() {
    startMusic(C.assets.happyBirthday);
    const s=this.shell("A little number magic", "");
    const stage=document.createElement("div"); stage.className="age-stage"; s.appendChild(stage);
    const old=document.createElement("div"); old.className="old-age"; old.textContent=C.oldAge;
    const next=document.createElement("div"); next.className="new-age"; next.textContent=C.newAge;
    stage.append(old,next);
    await wait(500);
    const vres=await safeAsset(C.assets.ageBurnVideo,{kind:"video"});
    if(vres.ok){
      const v=document.createElement("video"); v.className="age-video"; v.src=C.assets.ageBurnVideo; v.muted=true; v.playsInline=true; v.autoplay=true; stage.appendChild(v);
      v.play().catch(()=>{});
      await wait(3200);
    } else {
      old.classList.add("burn");
      await wait(1700);
      next.classList.add("reveal");
      await wait(1200);
    }
    await this.go(SCENES.CELEBRATION);
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
