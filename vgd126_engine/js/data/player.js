/**
 * @file data/player.js
 * @description Player sprite sheet & animation data.
 */

/* =====================================================================
   ✏️ STUDENT EDIT ZONE: PLAYER SPRITESHEET PATH
   - Put your PNG/JPG in /images and change the path below.
   - Each frame is currently 128x128 laid out horizontally.
   - Idle must be present and is required for the engine to work
   ===================================================================== */
var playerData = {
  info: {
    src: `images/kake_real_sprite_Sheet.png` // ← replace with your asset, e.g., 'images/hero.png'
  },
  states: {
    // idle
    idle: {
      fps: 15, cycle: true,
      frames: [
        { width: 64, height: 64, startX: 0,   startY: 0 },
        { width: 64, height: 64, startX: 64, startY: 0 },
        { width: 64, height: 64, startX: 128, startY: 0 },
        { width: 64, height: 64, startX: 192, startY: 0 },
        { width: 64, height: 64, startX: 256, startY: 0 },
        { width: 64, height: 64, startX: 320, startY: 0 },
        { width: 64, height: 64, startX: 384, startY: 0 },
        { width: 64, height: 64, startX: 448, startY: 0 },

        
      ]
    },
    // walk
    walk: {
      fps: 1, cycle: true,
      frames: [
        { width: 64, height: 64, startX: 0, startY: 64 },
        { width: 64, height: 64, startX: 64, startY: 64 },
        { width: 64, height: 64, startX: 128, startY: 64 },
        { width: 64, height: 64, startX: 192, startY: 64 },
        { width: 64, height: 64, startX: 256, startY: 64 },
        { width: 64, height: 64, startX: 320, startY: 64 },
        { width: 64, height: 64, startX: 384, startY: 64 },
        { width: 64, height: 64, startX: 448, startY: 64 },
        { width: 64, height: 64, startX: 0, startY: 128 },
        { width: 64, height: 64, startX: 64, startY: 128 },
        { width: 64, height: 64, startX: 128, startY: 128 },
        { width: 64, height: 64, startX: 192, startY:128 },
        { width: 64, height: 64, startX: 256, startY:128 },
        { width: 64, height: 64, startX: 320, startY:128 },
        { width: 64, height: 64, startX: 384, startY:128 },
        { width: 64, height: 64, startX: 448, startY:128 },
        { width: 64, height: 64, startX: 0, startY:192 },
        { width: 64, height: 64, startX: 64, startY:192 },
        { width: 64, height: 64, startX: 128, startY:192 },
        { width: 64, height: 64, startX: 192, startY:192 },
       
      ]
    },
    // jump
    jump: {
      fps: 1, cycle: false,
      frames: [ 
        
        
        { width: 64, height: 64, startX: 0, startY: 384 },
        { width: 64, height: 64, startX: 64, startY: 384 },
        { width: 64, height: 64, startX: 128, startY: 384 },
        { width: 64, height: 64, startX: 192, startY: 384 },
        { width: 64, height: 64, startX: 256, startY: 384 },
        { width: 64, height: 64, startX: 320, startY: 384 },
         
      ]
    },
    // crouch
    crouch: {
      fps: 15, cycle: true,
      frames: [
       
        { width: 64, height: 64, startX: 256, startY: 320 },
        
      ]
    },
    // attack
    attack: {
      fps: 5, cycle: false,
      frames: [
        { width: 64, height: 64, startX: 256, startY: 192 },
        { width: 64, height: 64, startX: 320, startY: 192 },
        { width: 64, height: 64, startX: 384, startY: 192 },
        { width: 64, height: 64, startX: 448, startY: 192 },
        { width: 64, height: 64, startX: 0, startY: 256 },
        { width: 64, height: 64, startX: 64, startY: 256 },
        { width: 64, height: 64, startX: 128, startY: 256 },
        { width: 64, height: 64, startX: 192, startY: 256 },
        { width: 64, height: 64, startX: 256, startY: 256 },
        { width: 64, height: 64, startX: 320, startY: 256 },
        { width: 64, height: 64, startX: 384, startY: 256 },
        { width: 64, height: 64, startX: 448, startY: 256 },
        { width: 64, height: 64, startX: 0, startY: 320 },
        { width: 64, height: 64, startX: 64, startY: 320 },
       
      ]
    },
    canShoot:{
      fps: 5, cycle: true,
      frames:[
        { width: 64, height: 64, startX:384, startY:384},
        
        
      ]

    }
  }
}