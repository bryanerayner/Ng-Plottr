define(['angular'], function(ng){
	'use strict';
	return ng.module('app.design',
		[
		'app.design.directives',
		'app.design.partials',
		'app.design.controllers',
		'app.design.services',
		'ui.router',
        'restangular'
		]);
});