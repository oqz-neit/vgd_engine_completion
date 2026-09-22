# Instructor Notes — Canvas Engine Overview

This engine matches VGD/GDS prototyping goals (readable code, simple state machine, Canvas 2D). It isolates "art swap" areas so students can iterate visually without touching the core loop.

## Files at a Glance
- **Entry & Loop:** `index.html`, `js/game.js`
- **State Machine:** `js/classes/StateManager.js`
- **Core Classes:** `GameObject`, `Grid`, `Group`, `SoundManager`
- **UI:** `keys.js`, `mouse.js`
- **Data:** `player.js`, `cave.js`
- **States:** `menu.js`, `level1.js`

## How It Works
- `game.js` sets a 60 FPS timer and dispatches `gameStates[currentState]()`.
- `level1.js` creates a scrolling `level` (world offset), parallax layers, a `Grid` for tiles, and a `GameObject` for the player.
- Students mostly change image paths and, if needed, geometry numbers in `player.js` and `cave.js`.


## Troubleshooting
- **CORS / local loading:** Use Live Server (VS Code) or a simple `http-server`.
- **Scale blur:** Encourage integral scale factors for pixel art.
