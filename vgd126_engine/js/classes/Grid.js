/**
 * @file Grid.js
 * @description Tiles a sprite sheet across a 2D layout grid. Each cell becomes a GameObject.
 *
 * Layout comes from data.info.layout (2D array). False entries are skipped.
 * The numeric value in a cell selects a sprite state (index into `states`).
 */

/**
 * @typedef {Object} GridInit
 * @property {{x:number,y:number}} [world] - Attach to a scrolling level.
 * @property {number} [x] @property {number} [y]
 * @property {number} [tileWidth] @property {number} [tileHeight]
 */

/**
 * @param {SpriteData & {info:{layout:any[][]}}} _data
 * @param {GridInit} [obj]
 * @constructor
 */
function Grid(_data, obj) {
  this.data = _data;
  /** @type {GameObject[]} */
  this.grid = [];
  this.x = 0; this.y = 0;
  /** @type {{x:number,y:number}} */
  this.world = 0;

  // Default tiles to span the canvas if not provided
  this.tileWidth = canvas.width / this.data.info.layout[0].length;
  this.tileHeight = canvas.height / this.data.info.layout.length;

  if (obj !== undefined) {
    for (value in obj) { if (this[value] !== undefined) this[value] = obj[value]; }
  }

  // Build objects from layout
  var g = 0;
  var x = this.x + this.tileWidth / 2;
  var y = this.y + this.tileHeight / 2;

  for (var r = 0; r < this.data.info.layout.length; r++) {
    for (var c = 0; c < this.data.info.layout[r].length; c++) {
      if (this.data.info.layout[r][c] !== false) {
        this.grid[g] = new GameObject({
          width: this.tileWidth,
          height: this.tileHeight,
          world: this.world,
          spriteData: this.data,
          currentState: this.data.info.layout[r][c]
        }).makeSprite(this.data);

        this.grid[g].img.src = this.data.info.src;
        this.grid[g].x = x;
        this.grid[g].y = y;
        g++;
      }
      x += this.tileWidth;
    }
    y += this.tileHeight;
    x = this.x + this.tileWidth / 2;
  }

  /** Draw all grid cells as sprites. */
  this.render = function () {
    for (index in this.grid) { this.grid[index].drawSprite(); }
    return this;
  }

  /** Advance animations for all grid cells. */
  this.play = function () {
    for (index in this.grid) { this.grid[index].play(); }
    return this;
  }
}