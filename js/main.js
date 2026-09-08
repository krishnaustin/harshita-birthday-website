import {SceneManager, SCENES} from "./scenes.js";
import {birthdayConfig as C} from "./config.js";

const root = document.getElementById("scene-root");
const manager = new SceneManager(root);
manager.go(SCENES.QUESTION);

// Helpful dev-console configuration hint without exposing personal content.
console.info("Birthday experience loaded. Edit js/config.js to customize:", C);
