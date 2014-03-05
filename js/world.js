(function () {
	'use strict';

	var
	_slice = [].slice,
	rand = function (max, min) { min = min || 0; return Math.floor(Math.random() * (max - min + 1) + min); },

	World = function (width, height, target) {
		if (!(this instanceof window.World)) return new window.World(width, height, target);

		this.grid = {};
		this.size = { width: width || 60, height: height || 40, dot: 1 };
		this.dots = {};			// { dotId: dot, ... }
		this.freq = 200;
		this.running = false;

		this.el = $('<div class="world"></div>')
			.css({ width: (this.size.width * this.size.dot) + 'em', height: (this.size.height * this.size.dot) + 'em' })
			.css('background-size', this.size.dot + 'em ' + this.size.dot + 'em')
			.prependTo(target || 'body');

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
		var self = this, id;
		for (id in this.dots) this.dots[id].tick(this);
		setTimeout(function () { self.tick.call(self); }, this.freq);
		return this;
	};

	/**
	 * Add a Dot to the world
	 * @param {object} dot  dot instance
	 */
	World.prototype.add = function (dot) {
		this.dots[dot.id] = dot;
		this.el.append(dot.el);
		dot.el[0].style.width = this.size.dot + 'em';
		dot.el[0].style.height = this.size.dot + 'em';
		this.el.trigger('born', dot);
		return this;
	};

	/**
	 * Remove a Dot from the world
	 * @param {object} dot  dot instance
	 */
	World.prototype.remove = function (dot) {
		dot.el.remove();
		delete this.dots[dot.id];
		this.el.trigger('die', dot);
		return this;
	};


	/**
	 * Find random available spot for a dot
	 * @return {object}   { x, y }
	 */
	World.prototype.findSpot = function () {
		var pos, id;
		do {
			pos = { x: rand(this.size.width - 1), y: rand(this.size.height - 1) };
			id = pos.x + '-' + pos.y;
		} while (this.grid[id]);

		return pos;
	};

	/**
	 * Get all available directions for a position
	 * @param  {object} pos	position { x: 0, y: 0 }
	 * @return {array}		array of new available positions a dot can go to
	 */
	World.prototype.getAvails = function (pos, dot) {
		var avails = [],
			x = pos.x,
			y = pos.y,
			grid = this.grid,
			maxW = this.size.width - 1,
			maxH = this.size.height - 1,
			push = function (x, y) { if (!grid[x + '-' + y]) avails.push({ x: x, y: y }); };

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
	World.prototype.move = function (oldPos, newPos, dot) {
		this.grid[oldPos.x + '-' + oldPos.y] = null;
		this.grid[newPos.x + '-' + newPos.y] = dot;
		return this;
	};



	/* EVENTS */

	World.prototype.trigger = function (names) { this.el.trigger(names, _slice.call(arguments, 1)); };
	World.prototype.off = function (names) { this.el.off(names); };
	World.prototype.on = function (names, callback) {
		this.el.on(names, function (e) {
			var args = _slice.call(arguments, 1);
			if (names.split(' ')[1]) args.unshift(e.type);
			callback.apply(this, args);
		});
	};


	window.World = World;
}());