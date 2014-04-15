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
            modeName:'',
            className:''
        });


        $scope.currentContext = new CurrentContext();



        $scope.ui = {};
        $scope.ui.tools = DesignTools;

        DesignTools.registerScope($scope);
        DesignTools.registerCurrentContext($scope.currentContext);


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


        var ui_events = $scope.ui.events = {
            triggerUIEvent:function(evName,  event, node){
                var toolEvents = $scope.ui.events.toolEvents;
                var toolEventList = [];
                var eventNameList;

                var eventAttemptLists = [];
                eventAttemptLists.push(toolEvents[$scope.ui.selectedTool]);
                eventAttemptLists.push(toolEvents['*']);

                for (var i = 0, ii = eventAttemptLists.length; i < ii; i++){
                    if (!eventAttemptLists[i]){
                        continue;
                    }
                    eventNameList = eventAttemptLists[i][evName];
                    if (_.isArray(eventNameList) && eventNameList.length > 0)
                    {
                        break;
                    }
                }

                if (eventNameList){
                    _.each(eventNameList, function(eventCallback){
                        if (_.isFunction(eventCallback)){
                            eventCallback.call($scope, evName, event, node);
                            }
                        });
                }
                $scope.$apply();
            },

            toolEvents:{},

            registerUIEvent:function(tool, evName, callback){
                var evNames = evName.split(/[\s]+/gi);
                if (evNames.length > 1){
                    var scope = $scope;
                    _.each(evNames, function(iter){
                        scope.ui.events.registerUIEvent(tool, iter, callback);
                    });
                    return;
                }

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
            // Remove a UIEvent from the event listeners
            removeUIEvent:function(tool, evName, callback){
                var events = $scope.ui.events;

                // Flags for what is deleted
                var deleteTool = true;
                var deleteEvName = true;


                if (tool && events.toolEvents[tool]){
                    if (evName && events.toolEvents[tool][evName]){
                        deleteTool = false;
                        var toolEventsEvName = events.toolEvents[tool][evName];
                        if (toolEventsEvName) {
                            if (_.isFunction(callback)) {
                                deleteEvName = false;

                                $scope.ui.events.toolEvents[tool][evName] = _.filter(toolEventsEvName, function(eventCallback){
                                    return (_.isEqual(callback, eventCallback)) ? false : true;
                                });
                            }
                        }
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



        // Add the universal events (selection, etc)

        var ui_selection = $scope.ui.selection = {
            events:{
                selectNode:function(evName, event, node){

                    var action = '';
                    if (KeystateService.keyIsDown('mod') || KeystateService.keyIsDown('shift'))
                    {
                        action = 'toggleSelection';
                    }
                    else
                    {
                        action = 'forceSelection';
                    }


                    $scope.ui.selection[action](node);
                }
            },
            selectedNodes:[],

            addSelection:function(node){
                ui_selection.selectedNodes.push(node.id);
                ui_selection.selectedNodes = _.unique(ui_selection.selectedNodes);
            },

            toggleSelection:function(node)
            {
                var nodeID = node.id;
                if (_.isNumber(nodeID)) {
                    if (_.contains(ui_selection.selectedNodes, nodeID)) {
                        ui_selection.selectedNodes = _.without(ui_selection.selectedNodes, nodeID);
                    }else{
                        ui_selection.selectedNodes.push(nodeID);
                    }
                }

            },

            forceSelection:function(nodes){
                var newSelectedNodes;
                newSelectedNodes = _.isArray(nodes) ? nodes : [nodes];

                $scope.ui.selection.selectedNodes = _.pluck(newSelectedNodes, 'id');
            }
        };

        var ui_edit = $scope.ui.edit = {
            events:{
                startMove:function(evName, event, node){
                    if (_.contains($scope.ui.selection.selectedNodes, node.id)){
                        $scope.ui.edit._states.startPosition = {
                            left:event.pageX,
                            top:event.pageY
                        };
                        $scope.ui.edit._states.moving = true;
                    }
                },
                stopMove:function(evName, event, node){
                    $scope.ui.edit._states.moving = false;
                }
            },
            _states:{
                moving:false,
                startPosition:{}
            },
            move:function(event) {
                if (!$scope.ui.edit._states.moving) {
                    return;
                }
                var startPosition = $scope.ui.edit._states.startPosition;
                var delta = {
                    left: startPosition.left || 0,
                    top: startPosition.top || 0
                };
                delta.left = event.pageX - delta.left;
                delta.top = event.pageY - delta.top;

                $scope.ui.edit.moveSelectedNodes(delta);

                $scope.ui.edit._states.startPosition = {
                    left:event.pageX,
                    top:event.pageY
                };
            },
            registerMoveListener:function(){
                $document.on('mousemove', $scope.ui.edit.move);
            },
            unregisterMoveListener:function(){
                $document.unbind('mousemove', $scope.ui.edit.move);
            },
            moveSelectedNodes:function(delta){
                var selectedNodeIDs = $scope.ui.selection.selectedNodes;

                var dLeft = delta.left || 0;
                var dTop = delta.top || 0;

                _.each($scope.currentContext.designNodes, function(node){
                    if (_.contains(selectedNodeIDs, node.id)){
                        node.layout.left += dLeft;
                        node.layout.top += dTop;
                    }
                });
                $scope.$apply();
            },

            _setup:function(){
                $scope.ui.edit.registerMoveListener();
            },
            _teardown:function(){
                $scope.ui.edit.unregisterMoveListener();
            }
        };



        ui_events.registerUIEvent('*','click mousedown', ui_selection.events.selectNode);

        ui_events.registerUIEvent('edit','mousedown', ui_edit.events.startMove);
        ui_events.registerUIEvent('edit','mouseup mouseout', ui_edit.events.stopMove);

        selectTool('edit');

        $scope.ui.edit._setup();

    }]);

});