(function () {
	'use strict';

	var
	rand = function (max, min) { min = min || 0; return Math.floor(Math.random() * (max - min + 1) + min); },

	/**
	 * DOT Class
	 */
	Dot = function (world, name) {
		if (!(this instanceof window.Dot)) return new window.Dot(world, name);
		if (!world) return;

		this.name = name || '';
		this.el = $('<div class="dot dot-' + name + '" title="' + name + '"></div>');
		world.add(this);
		this.world = world;
		this.pos = { x: rand(world.size.width - 1), y: rand(world.size.height - 1) };

		return this.move();
	};

	Dot.prototype.tick = function () { return this.move(); };

	Dot.prototype.move = function () {
		var dotSize = this.world.size.dot,
			avails = this.world.getAvails(this.pos),
			pos = avails[rand(avails.length - 1)],		// randomize new position
			el = this.el[0];

		this.world.move(this.pos, pos);					// release old and reserve new cell
		this.pos = pos;

		window.fastdom.write(function () {
			el.style.webkitTransform = 'translate(' + (pos.x * dotSize) + 'em,' + (pos.y * dotSize) + 'em)';
			el.style.transform = 'translate(' + (pos.x * dotSize) + 'em,' + (pos.y * dotSize) + 'em)';
		});

		// this.el[0].style.left = (pos.x * dotSize) + 'em';
		// this.el[0].style.top = (pos.y * dotSize) + 'em';
		return this;
	};

	window.Dot = Dot;
}());