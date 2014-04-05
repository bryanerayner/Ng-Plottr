define(['angular', './module', 'restangular'], function (ng, module, restangular) {
    'use strict';

    module.factory( 'DesignRestService', ['Restangular', function (Restangular) {
        var service = {};

        service.basePlots = Restangular.all('plots');

        service.one = function(param, callbackPass, callbackFail){
            var noop = function(){};
            var pass = callbackPass || noop;
            var fail = callbackFail || noop;
            Restangular.one('plots', param).then(function(result){pass(result);}, function(result){fail(result);});
        };

        return service;
    }]);

});