define(['angular','restangular'], function (ng, restangular) {
    'use strict';
    return ng.module('app.design.services',
        [
            'restangular',
            'keystateService'
        ]);
});