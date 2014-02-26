(function () {
	'use strict';

	var World = function (width, height, target) {
		if (!(this instanceof window.World)) return new window.World(width, height, target);

		this.grid = {};
		this.size = { width: width || 60, height: height || 40, dot: 1 };
		this.dots = [];
		this.freq = 200;
		this.running = false;

		this.el = $('<div class="world"></div>')
			.css({ width: (this.size.width * this.size.dot) + 'em', height: (this.size.height * this.size.dot) + 'em' })
			.css('background-size', this.size.dot + 'em ' + this.size.dot + 'em')
			.appendTo(target || 'body');

		return this;
	};

	World.prototype.stop = function () { this.running = false; return this; };
	World.prototype.start = function () {
		if (this.running) return this;
		this.running = true;
		return this.tick();
	};

	/**
	 * World iteration (every dot will move)
	 */
	World.prototype.tick = function () {
		if (!this.running) return;
		var self = this, i = 0, dot;
		for (; dot = this.dots[i++] ;) dot.tick(this);
		setTimeout(function () { self.tick.call(self); }, this.freq);
		return this;
	};

	/**
	 * Add Dot to the world
	 * @param {object} dot  dot instance
	 */
	World.prototype.add = function (dot) {
		this.dots.push(dot);
		this.el.append(dot.el);
		dot.el[0].style.width = this.size.dot + 'em';
		dot.el[0].style.height = this.size.dot + 'em';
		return this;
	};


	/**
	 * Get all available directions for a position
	 * @param  {object} pos	position { x: 0, y: 0 }
	 * @return {array}		array of new available positions a dot can go to
	 */
	World.prototype.getAvails = function (pos) {
		var avails = [],
			x = pos.x,
			y = pos.y,
			grid = this.grid,
			maxW = this.size.width - 1,
			maxH = this.size.height - 1,
			push = function (x, y) { if (grid[x + '-' + y] !== true) avails.push({ x: x, y: y }); };

		avails.push({ x: x, y: y });	// add self position
		if (y > 0) {
			push(x, y - 1);
			if (x > 0) push(x - 1, y - 1);
			if (x < maxW) push(x + 1, y - 1);
		}
		if (y < maxH) {
			push(x, y + 1);
			if (x > 0) push(x - 1, y + 1);
			if (x < maxW) push(x + 1, y + 1);
		}
		if (x > 0) push(x - 1, y);
		if (x < maxW) push(x + 1, y);

		return avails;
	};

	/**
	 * Release old and reserve new grid cell (move dot)
	 * @param {object} oldPos	position { x: 0, y: 0 }
	 * @param {object} newPos	position { x: 0, y: 0 }
	 */
	World.prototype.move = function (oldPos, newPos) {
		this.grid[oldPos.x + '-' + oldPos.y] = false;
		this.grid[newPos.x + '-' + newPos.y] = true;
		return this;
	};


	window.World = World;
}());