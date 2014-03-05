(function () {
	'use strict';


	var
	// colors = [ 'yellow', 'orange', 'white', 'chocolate', 'coral', 'cyan', 'maroon' ],
	colors = [ 'yellow', 'orange', 'white' ],
	stats = {
		total: 0,
		alive: 0,
		density: 0,
		youngest: 999,
		oldest: 0
	},
	wsize = { w: 10, h: 5, dots: 5 },
	_statsVals = null,

	rand = function (max, min) { min = min || 0; return Math.floor(Math.random() * (max - min + 1) + min); },
	col = function () { return colors[rand(colors.length - 1)]; },

	_updateStats = function (ev, dot) {
		if (ev === 'born') {
			stats.total++;
			stats.alive++;
		}
		else if (ev === 'die') {
			stats.alive--;
			stats.youngest = Math.min(stats.youngest, dot.age);
			stats.oldest = Math.max(stats.oldest, dot.age);
		}
		stats.density = window.world.density + '%';

		for (var s in stats) _statsVals.filter('.val-' + s).html(stats[s]);
	},

	_init = function () {
		window.world = window.World(wsize.w, wsize.h);
		window.world.on('born die', _updateStats);

		_statsVals = $('.stats .val');

		for (var i = 0; i < wsize.dots; i++) window.Dot(window.world, { name: i, color: col() });

		$('body')
			.on('click', '.start', function () { window.world.start(); })
			.on('click', '.stop', function () { window.world.stop(); })
			.on('click', '.add', function () { window.Dot(window.world, { name: ++i, color: col() }); });
	};

	_init();
}());