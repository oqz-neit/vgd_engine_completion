# VGD126 HTML5 Canvas Game — Student Guide

Welcome! Your goal is to **replace the graphics** (and optionally tweak animation data) without breaking the engine.

## Quick Start
1. Open `index.html` with VS Code and use the Live Server extension, or any static server.
2. The game launches in your browser at `http://localhost:...`.

## Where to Swap Art (Search for: "✏️ STUDENT EDIT ZONE")
- **Player spritesheet**: `js/data/player.js` → `playerData.info.src`
- **Tileset (cave)**: `js/data/cave.js` → `caveData.info.src`, `caveBackData.info.src`, `caveHitData.info.src`
- **Backgrounds**: `js/gamestates/level1.js` → `sky.img.src`, `rbg.img.src`, `bg.img.src`, `ground.img.src`
- **Menu splash**: `js/gamestates/menu.js` → `menuBackground.img.src`

## Sprite Sheets
- Player frames are `128x128` laid out horizontally. Update frame sizes/positions if your sheet differs.
- Cave tiles are `64x64`. Keep the layout arrays intact unless you want to change level geometry.

## Tips for Crisp Art
- Use sizes that divide cleanly (e.g., 64, 128). Non-integer scales can blur pixel art.
- For repeating layers, use **seamless** images (no visible edges).

## Common Issues
- **Blank screen**: wrong image path. Check DevTools → Console for 404.
- **Weird collisions**: If you changed sizes, update `hitBoxWidth/Height` or state sizes.
- **Nothing moves**: You probably edited a `⛔ DO NOT EDIT` section in `game.js` or class files.

Happy modding!