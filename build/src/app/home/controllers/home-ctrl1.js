define(['angular', './module'], function (ng, module) {
    'use strict';

    /**
     * And of course we define a controller for our route.
     */
    module.controller( 'HomeCtrl1', function HomeController( $scope, HomeService1 ) {
        console.log("HomeCtrl1 init....");
        // Injected by AngularJS
        HomeService1.doSomething();
    });

});