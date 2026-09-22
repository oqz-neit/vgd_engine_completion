/**
 * @file GameObject.js
 * @description Renderable & collidable object with sprite support and basic physics.
 * Most things on screen are instances of this.
 *
 * ✏️ STUDENT TIP:
 * - Change `img.src` (via makeSprite or drawStaticImage) to swap art.
 * - Use `world` to attach objects to a moving level (parallax & collisions).
 */

/**
 * @typedef {Object} SpriteStateFrame
 * @property {number} width
 * @property {number} height
 * @property {number} startX
 * @property {number} startY
 */

/**
 * @typedef {Object} SpriteState
 * @property {number} fps
 * @property {boolean} cycle
 * @property {SpriteStateFrame[]} frames
 * @property {number} [width] - Optional on-screen override width.
 * @property {number} [height] - Optional on-screen override height.
 */

/**
 * @typedef {Object} SpriteData
 * @property {{src:string}} info
 * @property {Record<string, SpriteState>} states
 */

/**
 * @typedef {Object} GameObjectInit
 * @property {number} [x] @property {number} [y]
 * @property {number} [width] @property {number} [height]
 * @property {string|CanvasPattern} [color]
 * @property {{x:number,y:number}} [world] - Offset for world-space attachments.
 * @property {number} [vx] @property {number} [vy]
 * @property {number} [force]
 * @property {SpriteData} [spriteData]
 * @property {string} [currentState]
 */

/**
 * Create a new GameObject.
 * @param {GameObjectInit} [obj]
 * @constructor
 */
function GameObject(obj) {
  // --- Defaults ---
  this.x = canvas.width / 2;
  this.y = canvas.height / 2;
  this.start = { x: this.x, y: this.y };
  this.width = 100;
  this.height = 100;
  this.color = "#ff0000";
  this.force = 1;
  this.ax = 1; this.ay = 1;
  this.vx = 0; this.vy = 0;

  /** World offset; attach to {x,y} (e.g., level) to move together. */
  this.world = { x: 0, y: 0 };

  /** @type {HTMLImageElement} */
  this.img = new Image();
  this.data;
  this.dir = 1;

  // Hitbox (setters/getters allow decoupling from visible size)
  var ready = false;
  Object.defineProperty(this, `hitBoxWidth`, {
    get: function () { return this._hitBoxWidth },
    set: function (_value) { this._hitBoxWidth = _value }
  });
  Object.defineProperty(this, `hitBoxHeight`, {
    get: function () { return this._hitBoxHeight },
    set: function (_value) { this._hitBoxHeight = _value }
  });

  this.setHitBox = function (obj) {
    this.hitBoxWidth = obj.width;
    this.hitBoxHeight = obj.height;
    return this;
  }

  this.img.addEventListener(`load`, function () { ready = true });

  this.colColor = ``;
  this.fin = true;

  // Sprite animation state
  /** @type {number} */
  this.angle = 0;
  /** @type {string} */
  this.currentState = `idle`
  /** @type {number} */
  this.currentFrame = 0;
  /** @type {SpriteData} */
  this.spriteData;
  this.counter;

  // Allow object-literal override of defaults
  if (obj !== undefined) {
    for (value in obj) {
      if (this[value] !== undefined) this[value] = obj[value];
    }
  }

  this._hitBoxWidth = this.width;
  this._hitBoxHeight = this.height;

  // Movement & jump helpers
  this.canJump = false;
  this.jumpHeight = -35;

  // Precompute local collision points; getters expose world-space
  this.collisionPoints = {
    top: { x: 0, y: -this.hitBoxHeight / 2 },
    right: { x: this.hitBoxWidth / 2, y: 0 },
    bottom: { x: 0, y: this.hitBoxHeight / 2 },
    left: { x: -this.hitBoxWidth / 2, y: 0 }
  };

  for (let i in this.collisionPoints) {
    Object.defineProperty(this, i, {
      get: function () {
        return {
          x: this.x + this.collisionPoints[i].x,
          y: this.y + this.collisionPoints[i].y,
          world: this.world
        }
      },
      set: function (_value) { this.collisionPoints[i] = _value }
    })
  }

  /**
   * Bind sprite sheet/meta to this object.
   * @param {SpriteData} data
   * @returns {this}
   */
  this.makeSprite = function (data) {
    this.spriteData = data;
    this.img.src = this.spriteData.info.src;
    this.counter = this.spriteData.states[this.currentState].fps;
    return this;
  };

  /**
   * Change animation state.
   * @param {string} _newState
   * @returns {this}
   */
  this.changeState = function (_newState) {
    if (this.currentState != _newState && this.fin) {
      this.currentState = _newState;
      this.currentFrame = 0;
      if (this.spriteData.states[this.currentState].cycle == false) {
        this.fin = false;
      }
    }
    return this;
  }

  /**
   * Advance animation; runs optional callback when a non-cycling clip finishes.
   * @param {Function} [_func=()=>{}]
   * @returns {this}
   */
  this.play = function (_func = function () { return }) {
    if (this.counter < 0) {
      this.currentFrame++;
      if (this.currentFrame > this.spriteData.states[this.currentState].frames.length - 1) {
        this.currentFrame = (this.spriteData.states[this.currentState].cycle) ? 0 :
          this.spriteData.states[this.currentState].frames.length - 1;
      }
      this.counter = this.spriteData.states[this.currentState].fps;
    }
    if (this.currentFrame == this.spriteData.states[this.currentState].frames.length - 1
      && this.spriteData.states[this.currentState].cycle == false) {
      this.fin = true;
      _func();
    }
    this.counter--;
    return this;
  }

  /**
   * Draw a full-image (non-sliced) sprite at this object's position.
   * @param {{x?:number,y?:number,w?:number,h?:number}} [_args]
   * @returns {this}
   */
  this.drawStaticImage = function (_args = {}) {
    let _data = {};
    _data.x = -this.width / 2;   // reg x
    _data.y = -this.height / 2;  // reg y
    _data.w = this.width;        // image width
    _data.h = this.height;       // image height
    for (let i in _args) { if (_args[i] !== undefined) { _data[i] = _args[i] } }
    if (ready) {
      context.save()
      context.translate(this.x + this.world.x, this.y + this.world.y);
      context.scale(this.dir, 1);
      context.rotate(this.angle * Math.PI / 180);
      context.drawImage(this.img, _data.x, _data.y, _data.w, _data.h)
      context.restore();
    }
    return this;
  }

  /**
   * Draw current animation frame from a sprite sheet.
   * @returns {this}
   */
  this.drawSprite = function () {
    if (ready) {
      context.save()
      context.translate(this.x + this.world.x, this.y + this.world.y);
      context.scale(this.dir, 1);
      context.rotate(this.angle * Math.PI / 180);
      let drawWidth = this.width, drawHeight = this.height;
      if (this.spriteData.states[this.currentState].width) {
        drawWidth = this.spriteData.states[this.currentState].width
      }
      if (this.spriteData.states[this.currentState].height) {
        drawHeight = this.spriteData.states[this.currentState].height
      }
      context.drawImage(
        this.img,
        this.spriteData.states[this.currentState].frames[this.currentFrame].startX,
        this.spriteData.states[this.currentState].frames[this.currentFrame].startY,
        this.spriteData.states[this.currentState].frames[this.currentFrame].width,
        this.spriteData.states[this.currentState].frames[this.currentFrame].height,
        -this.width / 2,
        -this.height / 2,
        drawWidth,
        drawHeight
      )
      context.restore();
    }
    return this;
  }

  this.drawRect = function(_args={})
	{

		let _data ={}
		_data.x =-this.width/2;//reg x
		_data.y =-this.height/2;//reg y
		_data.w = this.width//image width
		_data.h = this.height//image height

		for(let i in _args)
		{
			if(_args[i] !== undefined)
			{
			_data[i]=_args[i]

			}
		}

		context.save();
			context.fillStyle = this.color;
			context.translate(this.x + this.world.x, this.y + this.world.y);
			context.rotate(this.angle * Math.PI/180);
			context.translate(_data.x, _data.y)
			context.fillRect(0, 0, _data.w, _data.h);
		context.restore();
		
	}	
	
	this.drawCircle = function()
	{
		context.save();
			context.fillStyle = this.color;
			context.beginPath();
			context.translate(this.x + this.world.x, this.y + this.world.y);
			context.arc(0, 0, this.radius(), 0, 360 *Math.PI/180, true);
			context.closePath();
			context.fill();
		context.restore();
		
	}	
	
	//draws a triangle
	this.drawTriangle = function()
	{
		context.fillStyle = this.color;
		context.translate(this.x + this.world.x, this.y + this.world.y);
		context.rotate(this.angle * Math.PI/180);
			context.beginPath();
				context.moveTo(0+ this.width/2, 0);
				context.lineTo(0 - this.width/2, 0 - this.height/2);
				context.lineTo(0 - this.width/2, 0 + this.height/2);
				context.closePath();
			context.fill();
		context.restore();
		
	}	

  /** Draw a solid mask (used for color-based collision debug). */
  this.drawMask = function (_color) {
    context.save();
    context.fillStyle = _color;
    context.translate(this.x + this.world.x, this.y + this.world.y);
    context.fillRect((-this.width / 2), (-this.height / 2), this.width, this.height);
    context.restore();
    return this;
  }

  /** Flexible renderer: call any of this object's draw methods. */
  this.render = function (_func = `drawRect`, _args = undefined) {
    this[_func](_args);
    return this;
  }

  /** Apply velocity to position. */
  this.move = function () {
    this.x += this.vx;
    this.y += this.vy;
  }

  // --- Overlap helpers (AABB) ---

  /**
   * Axis-aligned overlap vs. another GameObject (AABB) or point-like {x,y,world}.
   * @param {GameObject|{x:number,y:number,world:{x:number,y:number}}} obj
   * @returns {boolean}
   */
  this.overlap = function (obj) {
    if (obj.constructor.name === `GameObject`) {
      if (this.left.x + this.world.x <= obj.right.x + obj.world.x &&
        this.right.x + this.world.x >= obj.left.x + obj.world.x &&
        this.top.y + this.world.y <= obj.bottom.y + obj.world.y &&
        this.bottom.y + this.world.y >= obj.top.y + obj.world.y) {
        return true
      }
    } else {
      if (obj.x + obj.world.x >= this.left.x + this.world.x &&
        obj.x + obj.world.x <= this.right.x + this.world.x &&
        obj.y + obj.world.y >= this.top.y + this.world.y &&
        obj.y + obj.world.y <= this.bottom.y + this.world.y) {
        return true;
      }
    }
    return false;
  }

  /** Get/Set circular radius used by drawCircle (defaults to half width). */
  this.radius = function (newRadius) {
    if (newRadius == undefined) { return this.width / 2; }
    else { return newRadius; }
  }

  /** Visualize collision points (debug). */
  this.drawDebug = function () {
    var size = 5;
    context.save();
    context.fillStyle = "black";
    context.fillRect(this.left.x + this.world.x - size/2, this.left.y + this.world.y - size/2, size, size);
    context.fillRect(this.right.x + this.world.x - size/2, this.right.y + this.world.y - size/2, size, size);
    context.fillRect(this.top.x + this.world.x - size/2, this.top.y + this.world.y - size/2, size, size);
    context.fillRect(this.bottom.x + this.world.x - size/2, this.bottom.y + this.world.y - size/2, size, size);
    context.fillRect(this.x + this.world.x - size/2, this.y + this.world.y - size/2, size, size);
    context.restore();
  }
}