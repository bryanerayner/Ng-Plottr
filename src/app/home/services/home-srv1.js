define(['angular', './module'], function (ng, module) {
    'use strict';

    module.factory( 'HomeService1', function () {
        var service = {};

        service.doSomething = function(){
            console.log("doing something");
        };

        return service;
    });

});