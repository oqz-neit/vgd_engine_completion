/**
 * @file keys.js
 * @description Keyboard handling. Adds boolean flags per key (A/W/S/D/Space).
 * @example
 * if (keys['A']) {  move left  }
 */

/**
 * A simple key registry.
 * @typedef {Object} Keys
 * @property {boolean} pressed - True while any tracked key is down.
 * @property {boolean} [A] [W] [S] [D] [" "] - Per-key flags set by events.
 */

/** @type {Keys} */
var keys = { pressed: false };

// Toggle keys on keydown/keyup — uses ASCII codes (A=65, etc.)
document.addEventListener("keydown", (e) => {
  keys.pressed = true;
  keys[String.fromCharCode(e.keyCode)] = true;
});
document.addEventListener("keyup", (e) => {
  keys.pressed = false;
  keys[String.fromCharCode(e.keyCode)] = false;
});