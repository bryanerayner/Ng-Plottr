define(['angular', './module', 'restangular'], function (ng, module, restangular) {
    'use strict';

    module.factory( 'DesignRestService', ['Restangular', function (Restangular) {
        var service = {};

        service.basePlots = Restangular.all('plots');

        service.one = function(param, callbackPass, callbackFail){
            var noop;
            noop = function (arg) {
                return arg;
            };
            var pass = callbackPass || noop;
            var fail = callbackFail || noop;
            Restangular.one('plots', param).get().then(
                function(response){return pass(response);},
                function(response){return fail(response);}
            );
        };

        return service;
    }]);

});