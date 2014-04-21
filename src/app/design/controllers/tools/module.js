define(['angular', 'keystateService', 'mouseEventsService', '../../services/index'], function (ng, keystateService, mouseEventsService) {
    'use strict';
    return ng.module('app.design.controllers.tools',
        [
            'keystateService',
            'mouseEventsService',
            'app.design.services'
        ]);
});