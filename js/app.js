(function () {
	'use strict';

	window.world = window.World(60, 40);

	window.Dot(window.world, 'A');
	window.Dot(window.world, 'A');
	window.Dot(window.world, 'A');

	for (var i = 0; i < 500; i++) window.Dot(window.world, i);

	$('body')
		.on('click', '.start', function () { window.world.start(); })
		.on('click', '.stop', function () { window.world.stop(); });

}());