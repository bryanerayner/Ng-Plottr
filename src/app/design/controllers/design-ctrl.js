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
            init:function(){
                this.width=0;
                this.height=0;
                this.designNodes=[];
                this.groups=[];
                this.modeName='';
                this.className='';
                this.selectedNodes=[];
                this.selectedTool=null;
            },

            getDesignPanel:function(){
                return document.getElementById('currentContextDesignPanel');
            }
        });


        $scope.currentContext = new CurrentContext();



        $scope.ui = {};
        $scope.ui.tools = DesignTools;

        $scope.ui.selection = {};

        $scope.ui.selection.addToSelection = function(nodeID){
            $scope.currentContext.selectedNodes.push(nodeID);
            $scope.currentContext.selectedNodes = _.uniq($scope.currentContext.selectedNodes);
            $scope.$apply();
        };

        $scope.ui.selection.toggleSelection = function(nodeID){
            if ($scope.ui.selection.nodeIsSelected (nodeID)){
                $scope.currentContext.selectedNodes = _.without($scope.currentContext.selectedNodes, nodeID);
            }else{
                $scope.ui.selection.addToSelection(nodeID);
            }
        };

        $scope.ui.selection.nodeIsSelected = function(nodeID) {
            return _.contains($scope.currentContext.selectedNodes, nodeID);
        };


        DesignTools.registerScope($scope);
        DesignTools.registerCurrentContext($scope.currentContext);

        $scope.ui.events = {
            mousedown:function($event, targetType){
                $scope.$emit('mousedown:'+targetType);
            }
        };



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