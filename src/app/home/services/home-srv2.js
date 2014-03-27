define(['angular', './module'], function (ng, module) {
    'use strict';

    module.factory( 'HomeService2', function () {
        var service = {};

        service.doSomething = function(){
            console.log("doing something2");
        };

        return service;
    });

});