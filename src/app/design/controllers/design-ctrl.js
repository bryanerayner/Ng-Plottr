define(['angular', './module', 'lodash'], function (ng, module, _) {
    'use strict';

    /**
     * And of course we define a controller for our route.
     */
    module.controller( 'DesignCtrl', ['$scope', '$stateParams', 'DesignRestService', 'Restangular', function ( $scope , $stateParams, DesignRestService, Restangular) {

        var currentDesign = $stateParams.designId;



        $scope.data = {};
        $scope.io = {};
        $scope.currentContext = {
            width:0,
            height:0,
            designNodes:[],
            modeName:'',
            className:''
        };
        $scope.ui = {};

        $scope.ui.availableTools = ['edit'];

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

        var resetUI = $scope.ui.resetUI = function()
        {
            $scope.ui.selectedNodes = [];
            $scope.ui.selectedTool = 'edit';
        };

        var selectTool = $scope.ui.selectTool = function(tool)
        {
            if (_.contains($scope.ui.availableTools, tool)){
                $scope.ui.selectedTool = tool;
            }
        };


        var events = $scope.ui.events = {
            eventVent:function(evName, node, event){
                var toolEventList = $scope.ui.events.toolEvents[$scope.ui.selectedTool];

                if (toolEventList){
                    var eventNameList = toolEventList[evName];
                    _.each(eventNameList, function(eventName){
                        if (_.isFunction(eventNameList[eventName])){
                            eventNameList[eventName].call($scope, evName, node, event);
                        }
                    });

                }
            },

            toolEvents:{},

            registerUIEvent:function(tool, evName, callback){
                var events = $scope.ui.events;
                // See if an event hash is already there for that tool
                if (!events.toolEvents[tool])
                {
                    events.toolEvents[tool] = {};
                }

                // Make sure a callback list is there for that tool and event name
                var toolEvents = events.toolEvents[tool];

                if (!toolEvents[evName])
                {
                    toolEvents[evName] = [];
                }

                //Add the event to the callback list
                toolEvents[evName].push(callback);
            },
            removeUIEvent:function(tool, evName, callback){
                var events = $scope.ui.events;
                if (tool && events.toolEvents[tool]){
                    var toolEventsEvName =events.toolEvents[tool][evName];
                    if (evName && toolEventsEvName){
                        if (_.isFunction(callback)){
                            var deletionList= [];
                            for (var i = 0; i < toolEventsEvName.length; i++)
                            {
                                if (_.isEqual(callback, toolEventsEvName[i])){

                                }
                            }
                        }
                    }else
                    {
                        delete events.toolEvents[tool];
                    }
                }
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