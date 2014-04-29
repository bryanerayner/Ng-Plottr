define(['angular', './module'], function (ng, module) {
    'use strict';

    /**
     * And of course we define a controller for our route.
     */
    module.controller( 'HomeCtrl2', function HomeController2( $scope ) {
        console.log("HomeCtrl2 init....");
    });

});