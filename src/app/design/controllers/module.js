define(['angular', 'keystateService', './tools/index', '../services/index'], function (ng, keystateService, tools, DesignServices) {
    'use strict';
    return ng.module('app.design.controllers',
        [
            'app.design.controllers.tools'
        ]);
});