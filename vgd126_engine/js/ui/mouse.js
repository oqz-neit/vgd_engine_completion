/**
 * @file mouse.js
 * @description Mouse tracking relative to the canvas, plus mouse down state.
 */

/**
 * @typedef {Object} Mouse
 * @property {number} x - Canvas-space X.
 * @property {number} y - Canvas-space Y.
 * @property {{x:number,y:number}} world - World offset for collision.
 * @property {boolean} pressed - True while left button held.
 */

/** @type {Mouse} */
var mouse = { x: 0, y: 0, world: { x: 0, y: 0 }, pressed: false };

// Track canvas-relative mouse position
canvas.addEventListener(`mousemove`, (e) => {
  var rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

// Press/Release
canvas.addEventListener(`mousedown`, () => (mouse.pressed = true));
canvas.addEventListener(`mouseup`, () => (mouse.pressed = false));