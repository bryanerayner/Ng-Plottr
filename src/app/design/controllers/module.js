define(['angular', 'keystateService', './tools/index.js'], function (ng, keystateService) {
    'use strict';
    return ng.module('app.design.controllers',
        [
            'app.design.controllers.tools'
        ]);
});