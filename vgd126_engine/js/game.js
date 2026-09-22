/**
 * @file game.js
 * @description Creates the canvas context, starts the animation timer,
 * and dispatches to the current game state via StateManager.
 */

var canvas = document.getElementById(`canvas`);
var context = canvas.getContext(`2d`);

var interval = 1000 / 60;

context.imageSmoothingEnabled = false;



/* =====================================================================
   ⛔ DO NOT EDIT: CORE TIMER + LOOP
   WHY: Changing timing can break movement and physics expectations.
   ===================================================================== */
var timer = setInterval(animate, interval);

/* =====================================================================
   ✏️ STUDENT EDIT ZONE: INITIAL STATE (optional)
   You can start directly in "level1" while iterating on art.
   ===================================================================== */
gameStates.changeState(`menu`);


//-------------------------Animation Loop--------------------------------
/**
 * Main animation loop — clears the frame and runs the current state.
 */
function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  /* -------------------------------------------------------------------
     ⛔ DO NOT EDIT: STATE DISPATCH
     The state functions are attached as properties on `gameStates`.
     ------------------------------------------------------------------- */
  gameStates[gameStates.currentState]();
}