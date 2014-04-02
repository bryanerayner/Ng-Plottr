define(['angular'], function (ng) {
    'use strict';
    return ng.module('app.design.directives',
        [
		'app.design.directives.designNode',
        'app.design.directives.partials'
        ]);
});