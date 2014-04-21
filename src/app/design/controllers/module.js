define(['angular', './tools/index', '../services/index'], function (ng, tools, DesignServices) {
    'use strict';
    return ng.module('app.design.controllers',
        [
            'app.design.controllers.tools'
        ]);
});