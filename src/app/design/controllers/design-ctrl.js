define(['angular', './module'], function (ng, module) {
    'use strict';

    /**
     * And of course we define a controller for our route.
     */
    module.controller( 'DesignCtrl', ['$scope', function ( $scope ) {
        $scope.designNodes = [
            {layout:{left:0,top:0,width:0,height:0,zIndex:0}},
            {layout:{left:0,top:50,width:100,height:10,zIndex:6}}
        ];
    }]);

});