export const birthdayConfig = {
  // ==========================================
  // BASIC BIRTHDAY INFORMATION
  // ==========================================

  sisterName: "Harshita",

  oldAge: "25",
  newAge: "26",


  // ==========================================
  // BIRTHDAY QUESTION
  // ==========================================

  answerOptions: [
    "Santu",
    "Krish",
    "Yardu illa",
    "Nindu"
  ],

  // Nindu is the correct answer
  correctAnswer: "Nindu",


  // ==========================================
  // PERSONAL MESSAGES
  // ==========================================

  calmMessage: `
[CALM PAGE MESSAGE]

Replace this text with your personal message
for Harshita.
`,


  letterText: `
[PERSONAL LETTER]

Replace this text with your complete
personal letter for Harshita.
`,


  // ==========================================
  // CELEBRATION SETTINGS
  // ==========================================

  celebrationDurationMs: 60_000,

  noClickLimit: 5,


  // ==========================================
  // ALL WEBSITE RESOURCES
  // ==========================================

  assets: {

    // SCENE 1
    wrongAnswerAudio:
      "assets/audio/wrong-answer.mp3",

    catVideo:
      "assets/videos/cat-correct-answer.mp4",

    cake:
      "assets/images/cake.png",

    correctBlast:
      "assets/effects/correct-answer-blast.png",


    // SCENE 2 — CURTAINS
    curtainLeft:
      "assets/images/curtain-left.png",

    curtainRight:
      "assets/images/curtain-right.png",


    // SCENE 3 — BULB / LIGHTS
    bulb:
      "assets/images/bulb.png",

    hangingLights:
      "assets/images/hanging-lights.png",


    // SCENE 4 — MUSIC
    musicIcon:
      "assets/icons/music.png",

    happyBirthday:
      "assets/audio/happy-birthday.mp3",


    // SCENE 5 — AGE
    ageBurnVideo:
      "assets/effects/age-burning-25-to-26.mp4",


    // SCENE 6 — CELEBRATION
    balloonRed:
      "assets/images/balloon-red.png",

    balloonBlue:
      "assets/images/balloon-blue.png",

    balloonYellow:
      "assets/images/balloon-yellow.png",

    balloonPink:
      "assets/images/balloon-pink.png",

    fireworks:
      "assets/effects/fireworks.png",

    paperBlaster:
      "assets/effects/paper-blaster.png",

    celebrationReplay:
      "assets/icons/celebration-replay.png",


    // SCENE 7 — PHOTO
    sisterPhoto:
      "assets/images/sister-photo-01.jpg",


    // SCENE 8 — LETTER
    envelope:
      "assets/images/envelope-closed.png",

    letterPaper:
      "assets/images/letter-paper.png"
  }
};