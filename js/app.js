(function () {
	'use strict';


	var rand = function (max, min) { min = min || 0; return Math.floor(Math.random() * (max - min + 1) + min); },
		colors = [ 'yellow', 'orange', 'white', 'chocolate', 'coral', 'cyan', 'maroon' ],
		col = function () { return colors[rand(colors.length - 1)]; },
		i = 0;

	window.world = window.World(30, 20);

	for (; i < 50; i++) window.Dot(window.world, { name: i, color: col() });

	$('body')
		.on('click', '.start', function () { window.world.start(); })
		.on('click', '.stop', function () { window.world.stop(); })
		.on('click', '.add', function () { window.Dot(window.world, { name: ++i, color: col() }); });

}());