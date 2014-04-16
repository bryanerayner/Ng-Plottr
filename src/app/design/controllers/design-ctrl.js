define(['angular', './module', 'lodash', 'jrClass'], function (ng, module, _, Class) {
    'use strict';

    /**
     * And of course we define a controller for our route.
     */
    module.controller( 'DesignCtrl', ['$scope', '$stateParams', 'DesignRestService', 'Restangular', '$document', 'DesignTools', function ( $scope , $stateParams, DesignRestService, Restangular, $document, DesignTools) {

        var currentDesign = $stateParams.designId;



        $scope.data = {};
        $scope.io = {};
        var CurrentContext = Class.extend({
            width:0,
            height:0,
            designNodes:[],
            groups:[],
            modeName:'',
            className:'',
            selectedNodes:[],
            selectedTool:null
        });


        $scope.currentContext = new CurrentContext();



        $scope.ui = {};
        $scope.ui.tools = DesignTools;

        DesignTools.registerScope($scope);
        DesignTools.registerCurrentContext($scope.currentContext);




        var resetUI = $scope.ui.resetUI = function(){

        };



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
                var selections = ['modeName', 'className', 'width', 'height', 'designNodes'];
                _.each(selections, function(selection){
                    $scope.currentContext[selection] = _.cloneDeep(selectedPlotDesign[0][selection]);
                });
                $scope.currentContext.plotMode = selectedPlotMode.id;

            }

            $scope.ui.resetUI();
        };


        // Called the first time the view is loaded.
        var loadDefaultPlotMode = $scope.io.loadDefaultPlotMode = function ()
        {
            var defaultDesignId;
            var designModel = $scope.data.designModel;
            if (designModel) {
                defaultDesignId = designModel.defaults.plotMode;
                loadPlotMode(defaultDesignId);
            }
        };

        //Actually grab the data for the current design.
        DesignRestService.one(currentDesign, function(one){
            $scope.data.designModel = Restangular.copy(one);
            loadDefaultPlotMode();
        }, function(){
            console.log('error loading the current design model');
        });




    }]);

});