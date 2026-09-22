/**
 * @file level1.js
 * @description Main gameplay state: parallax backgrounds, cave tiles, player control.
 */

// --- World constants ---
var gravity = 1;
var friction = { x: .85, y: .97 };

// Stage bounds (used for e.g., bullet gravity check)
var stage = new GameObject({ width: canvas.width, height: canvas.height });

// Scrollable world offset container
var level = new GameObject({ x: 0, y: 0 });

// Avatar (player) using playerData sheet
var wiz = new GameObject({ width: 128, height: 128, spriteData: playerData }).makeSprite(playerData);
wiz.force = 1;

// Ground & platform
var ground = new GameObject({ width: canvas.width * 10, x: canvas.width * 10 / 2 - 200, height: 64, y: canvas.height - 32, color: "green", world: level });
//simple platform
var plat = new GameObject({ width: 256, height: 64, y: canvas.height - 200, color: "green", world: level });
var leftBorder = new GameObject({ width: 50, height: canvas.height, world: level, x: 0 });


/* =====================================================================
   ✏️ STUDENT EDIT ZONE: GROUND TEXTURE
   - Swap "images/ground.png" with your tile/gravel/etc.
   - Tileable images look best here (seamless repeat).
   ===================================================================== */
ground.img.src = `images/ground.png`;
plat.img.src = `images/platform.png`;

// Foreground/Background cave tile grids (+ hit grid for collisions)
var cave = new Grid(caveData, { world: level, x: 1024, tileHeight: 64, tileWidth: 64 });
var caveBack = new Grid(caveBackData, { world: level, x: 1024, tileHeight: 64, tileWidth: 64 });
var caveHit = new Grid(caveHitData, { world: level, x: 1024, tileHeight: 64, tileWidth: 64 });

// Groups
var g1 = new Group();                 // collision group
g1.color = `rgb(251,0,254)`;
g1.add([ground, leftBorder, caveHit.grid]);

var rects = new Group();              // rect render group
rects.add([ground, plat]);

var sprites = new Group();            // sprite render group (behind player)
sprites.add([caveBack.grid]);

var front = new Group();              // sprite render group (in front of player)
front.add([cave.grid]);

var levelItems = new Group();
levelItems.add([caveBack.grid, ground, plat, cave.grid]);

// --- Parallax backgrounds ---
var sky = new GameObject({ width: canvas.width, height: canvas.height });
/* =====================================================================
   ✏️ STUDENT EDIT ZONE: SKY BACKDROP
   Swap the image used for the sky pattern (large, subtle textures work well).
   ===================================================================== */
sky.img.src = `images/night_sky_background.png`;

var rbg = new GameObject({ x: level.x, y: level.y, width: 1024, height: 512 });
/* =====================================================================
   ✏️ STUDENT EDIT ZONE: REPEATING BACKGROUND LAYER
   Recommended: tileable hill/forest layer that repeats horizontally.
   ===================================================================== */
rbg.img.src = `images/town_repeating_background.png`;

var bg = new GameObject({ x: level.x, y: level.y, width: canvas.width * 4, height: canvas.height });
/* =====================================================================
   ✏️ STUDENT EDIT ZONE: MIDGROUND / DISTANT BACKDROP
   Large scenic layer (non-repeating), e.g., mountains or cityscape.
   ===================================================================== */
bg.img.src = `images/background_test.png`;

// --- Projectiles (pooled) ---
var bullets = [];
var canShoot = true;
var shotTimer = 0;
var shotDelay = 20;
var currentBullet = 0;

for (let i = 0; i < 100; i++) {
  bullets[i] = new GameObject({ width: 128, height: 128 }).makeSprite(playerData);
  bullets[i].y = -10000;
  bullets[i].changeState(`canShoot`);
}

gameStates[`level1`] = function () {

  // --- Animation state from input ---
  if (!keys[`W`] && !keys[`S`] && !keys[`D`] && !keys[`A`] && !keys[` `] && canShoot && wiz.canJump) {
    wiz.changeState(`idle`)
  }

  if (keys[`S`]) { wiz.top = { x: 0, y: 0 }; wiz.changeState(`crouch`) }
  else { wiz.top = { x: 0, y: -wiz.hitBoxHeight / 2 }; }

  if (keys[`D`]) {
    wiz.dir = 1;
    if (wiz.currentState != `crouch`) { if (wiz.canJump) wiz.changeState(`walk`); wiz.vx += wiz.force; }
  }
  if (keys[`A`]) {
    wiz.dir = -1;
    if (wiz.currentState != `crouch`) { if (wiz.canJump) wiz.changeState(`walk`); wiz.vx += -wiz.force; }
  }
  if (keys[`W`] && wiz.canJump) {
    wiz.canJump = false; wiz.vy = wiz.jumpHeight; wiz.changeState(`jump`);
     sounds.play(`frogjump`,1)
  }

  // Shooting cadence
  shotTimer--;
  canShoot = shotTimer <= 0;
  if (keys[` `]) {
    if (canShoot) {
      wiz.changeState(`attack`);
      sounds.play(`fireball`,0);
      shotTimer = shotDelay;
      bullets[currentBullet].vx = 5 * wiz.dir;
      bullets[currentBullet].world = level;
      bullets[currentBullet].x = wiz.x - level.x + (wiz.dir * 96);
      bullets[currentBullet].y = wiz.y + 20;
      bullets[currentBullet].dir = wiz.dir;
      currentBullet++;
      if (currentBullet >= bullets.length) { currentBullet = 0 }
    }
  } else { shotTimer = 0; }

  // --- Physics integration ---
  wiz.vy += gravity;
  wiz.vx *= friction.x;
  wiz.vy *= friction.y;
  wiz.x += Math.round(wiz.vx);
  wiz.y += Math.round(wiz.vy);

  let offset = { x: Math.round(wiz.vx), y: Math.round(wiz.vy) };

  // Simple platform collision (floor)
  while (plat.overlap(wiz.bottom) && wiz.vy >= 0) {
    wiz.vy = 0; wiz.canJump = true; wiz.y--; offset.y--;
  }

  // Collision vs. group solids
  while (g1.collide(wiz.bottom) && wiz.vy >= 0) { wiz.canJump = true; wiz.vy = 0; wiz.y--; offset.y--; }
  while (g1.collide(wiz.top) && wiz.vy <= 0)   { wiz.vy = 0; wiz.y++; offset.y++; }
  while (g1.collide(wiz.left) && wiz.vx <= 0)  { wiz.vx = 0; wiz.x++; offset.x++; }
  while (g1.collide(wiz.right) && wiz.vx >= 0) { wiz.vx = 0; wiz.x--; offset.x--; }

  // Camera scroll (parallax)
  if (wiz.x < canvas.width * .33 || wiz.x > canvas.width * .66) {
    wiz.x -= offset.x;
    level.x -= offset.x;     // world follows
    rbg.x -= offset.x * .5;  // far background (slower)
    bg.x  -= offset.x * .75; // mid background
  }

  // Repeat the repeating background
  if (rbg.x < -rbg.width || rbg.x > rbg.width) { rbg.x = 0; }

  // --- Render order ---
  // Patterns
  var groundPattern = context.createPattern(ground.img, `repeat`);
  var platPattern = context.createPattern(plat.img, `repeat`);
   ground.color = groundPattern; 
   plat.color = platPattern;

  var skyPattern = context.createPattern(sky.img, `repeat`);
  sky.color = skyPattern;

  // Far sky
  sky.render();

  // Repeating background (draw twice on each side)
  rbg.drawStaticImage({ x: 0, y: 0 });
  rbg.drawStaticImage({ x: -rbg.width, y: 0 });
  rbg.drawStaticImage({ x: rbg.width, y: 0 });

  // Midground
  bg.drawStaticImage({ x: 0, y: 0 });

  // Rect solids
  rects.render(`drawRect`);

  // Back cave layer
  sprites.play().render(`drawSprite`);

  // Player
  wiz.play(function () { return }).drawSprite();

  // Projectiles
  for (let i = 0; i < bullets.length; i++) {
    if (bullets[i].overlap(stage)) bullets[i].vy += 1;
    bullets[i].move();
    bullets[i].play(function () { return }).drawSprite();
    while (g1.collide(bullets[i].bottom) && bullets[i].vy >= 0) { bullets[i].vy = 0; bullets[i].y--; }
  }

  // Foreground cave layer
  front.play().render(`drawSprite`);
};