/**
 * @file Group.js
 * @description A lightweight collection of GameObjects for batch updates and collisions.
 */

function Group() {
  /** @type {string} Color used when drawing masks for pixel-collision. */
  this.color = `rgb(255,0,255)`;
  /** @type {GameObject[]} */
  this.items = [];

  /** Advance animation for all group items. */
  this.play = function () {
    for (index in this.items) { this.items[index].play(); }
    return this;
  }

  /**
   * Render all group items by calling the given draw method (e.g., "drawSprite").
   * @param {"drawRect"|"drawSprite"|"drawStaticImage"} _func
   * @param {any} [_args]
   */
  this.render = function (_func = `drawRect`, _args = undefined) {
    for (index in this.items) { this.items[index][_func](_args); }
    return this;
  }

  /** Add one or many items (or arrays of items). */
  this.add = function (_arr) {
    for (index in _arr) {
      if (_arr[index].length) {
        for (obj in _arr[index]) { this.items.push(_arr[index][obj]) }
      } else { this.items.push(_arr[index]) }
    }
  }

  /** Remove one or many items (or arrays of items). */
  this.remove = function (_arr) {
    for (index in _arr) {
      if (_arr[index].length) {
        for (obj in _arr[index]) {
          let thing = this.items.indexOf(_arr[index][obj])
          this.items.splice(thing, 1)
        }
      } else {
        let thing = this.items.indexOf(_arr[index])
        this.items.splice(thing, 1)
      }
    }
  }

  /** Draw solid masks for pixel-based collision debug. */
  this.drawMasks = function () {
    for (index in this.items) { this.items[index].drawMask(this.color) }
    return this;
  }

  /**
   * Simple collision checks against an object.
   * @param {GameObject|{x:number,y:number,world:{x:number,y:number}}} _object
   * @param {"color"|""} [_type=""] - If "color", uses mask sampling via getImageData.
   * @returns {boolean}
   */
  this.collide = function (_object, _type = ``) {
    switch (_type) {
      case `color`:
        this.drawMasks();
        let pix = context.getImageData(_object.x, _object.y, 1, 1)
        if (this.color === `rgb(${pix.data[0]},${pix.data[1]},${pix.data[2]})`) {
          return true;
        }
        break;
      default:
        for (index in this.items) {
          while (this.items[index].overlap(_object)) {
            return true;
          }
        }
        break;
    }
    return false;
  }
}