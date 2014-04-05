define(['angular', './module', 'lodash'], function (ng, module, _) {
    'use strict';

    /**
     * And of course we define a controller for our route.
     */
    module.controller( 'DesignCtrl', ['$scope', '$stateParams', 'DesignRestService', function ( $scope , $stateParams, DesignRestService) {

        $scope.data = {};
        $scope.io = {};

        var loadPlotMode = $scope.io.loadPlotMode = function(plotModeId)
        {
            var designModel = $scope.data.designModel;
            var plotMode = _.where(designModel.plotModes, {id:plotModeId});

            var selectedPlotMode;
            if (plotMode.length){
                selectedPlotMode = plotMode[0];
            }else
            {
                return;
            }

            var plotDesignId = selectedPlotMode.plotDesign;


            //For now, just load the designNodes
            var selectedPlotDesign = _.where(designModel.plotDesigns, {id:plotDesignId});
            if (selectedPlotDesign.length)
            {
                $scope.designNodes = _.cloneDeep(selectedPlotDesign[0].designNodes);
            }
        };


        var currentDesign = $stateParams.designId;

        //Actually grab the data for the current design.
        DesignRestService.one(currentDesign, function(one){
            $scope.data.designModel = Restangular.copy(one);
            initiate();
        }, function(){
            console.log('error loading the current design model');
        });

        // Called the first time the view is loaded.
        var initiate = function ()
        {
            var defaultDesignId;
            var designModel = $scope.data.designModel;
            if (designModel){
                defaultDesignId = designModel.defaults.plotMode;
                loadPlotMode(defaultDesignId);
            }
        };




    }]);

});