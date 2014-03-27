define(['angular'], function (ng) {
    'use strict';
    return ng.module('app.home',
        [
         'app.home.partials',
         'app.home.controllers',
         'app.home.services',
         'ui.router',
         'plusOne'
        ]);
});