(function () {
	'use strict';

	var

	rand = function (max, min) { min = min || 0; return Math.floor(Math.random() * (max - min + 1) + min); },

	guid = function (pattern) { //jshint eqeqeq: false, bitwise: false
		return (pattern || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r&0x3 | 0x8);
			return v.toString(16);
		});
	},


	/**
	 * DOT Class
	 */
	Dot = function (world, params) {
		if (!(this instanceof window.Dot)) return new window.Dot(world, params);
		if (!world) return;
		params = params || {};
		this.id = guid();
		this.age = -1;
		this.name = params.name || '';
		this.color = params.color || '';
		this.world = world;
		return this.born();
	};

	Dot.prototype.tick = function () {
		if (this.shouldDie()) return this.die();
		return this.move();
	};

	Dot.prototype.born = function () {
		var cls = [ 'dot', 'dot' + this.name ];
		if (this.color) cls.push('dot-' + this.color);

		this.el = $('<div id="' + this.id + '" class="' + cls.join(' ') + '" title="' + this.age + '"></div>');
		this.pos = this.world.findSpot();
		this.world.add(this);
		this.el.on('click', $.proxy(this.die, this));
		return this.move();
	};

	Dot.prototype.die = function () { this.world.remove(this); };
	Dot.prototype.shouldDie = function () {
		var prob = Math.pow(2, (this.age - 20) / 24);
		if (prob > 99) prob = 99;
		return rand(100) < prob;
	};

	Dot.prototype.move = function () {
		var dotSize = this.world.size.dot,
			avails = this.world.getAvails(this.pos, this),
			pos = avails[rand(avails.length - 1)],		// randomize new position
			el = this.el[0],
			self = this;

		this.world.move(this.pos, pos, this);			// release old and reserve new cell
		this.pos = pos;
		this.age++;

		window.fastdom.write(function () {
			el.style.webkitTransform = 'translate(' + (pos.x * dotSize) + 'em,' + (pos.y * dotSize) + 'em)';
			el.style.transform = 'translate(' + (pos.x * dotSize) + 'em,' + (pos.y * dotSize) + 'em)';
			el.title = self.age;
		});

		return this;
	};

	window.Dot = Dot;
}());