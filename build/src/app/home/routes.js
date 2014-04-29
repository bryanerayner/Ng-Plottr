define(['angular', './module', './controllers/index'], function (ng, module, controllers) {
    'use strict';

    /**
     * And of course we define a controller for our route.
     */
    module.config(function config( $stateProvider ) {
        $stateProvider.state( 'home', {
            url: '/home',
            views: {
                "main": {
                    controller: 'HomeCtrl1',
                    templateUrl: './src/app/home/partials/home.tpl.html'
                }
            },
            data:{ pageTitle: 'Home' }
        });
    });

});