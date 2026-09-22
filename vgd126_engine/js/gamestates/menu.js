/**
 * @file menu.js
 * @description Title screen and "Start" button.
 */

var startButton = new GameObject();
startButton.width = 200;
startButton.hitBoxWidth = 800;

startButton.img.src = `images/Transmutate_button.png`;


var menuBackground = new GameObject();

/* =====================================================================
   ✏️ STUDENT EDIT ZONE: MENU BACKGROUND IMAGE
   Replace with your own JPG/PNG; keep aspect ratio close to canvas.
   ===================================================================== */
menuBackground.img.src = "images/main_menu_sprite.png";
menuBackground.width = canvas.width;
menuBackground.height = canvas.height;

gameStates[`menu`] = function () {
  // Hover & click
  if (startButton.overlap(mouse)) {
    if (mouse.pressed) { gameStates.changeState(`level1`); }
    startButton.img.src = `images/COMPLETE.png`
  } else {
    startButton.img.src = `images/Transmutate_button.png`;
  }

  menuBackground.drawStaticImage();
  startButton.drawStaticImage();

  sounds.play(`menumusic`, .5, loop = true);
};