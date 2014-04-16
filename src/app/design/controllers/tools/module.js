define(['angular', 'keystateService', '../../services/index'], function (ng, keystateService) {
    'use strict';
    return ng.module('app.design.controllers.tools',
        [
            'keystateService',
            'app.design.services'
        ]);
});