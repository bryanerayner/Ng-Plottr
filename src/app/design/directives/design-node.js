define(['angular', 'lodash'], function (ng, _) {
    'use strict';
    var module = ng.module('app.design.directives.designNode', []);

    var directiveName = 'designNode';
    /**
     * And of course we define a controller for our route.
     */
    module.directive( directiveName, function () {
        return {
            restrict:'E',
            controller:function($scope)
            {
//                var layout = $scope.layout = {};
//
//                layout.left = 0;
//                layout.top = 0;
//                layout.width = 0;
//                layout.height = 0;
//                layout.zIndex = 0;
//
//                var nestOrder = $scope.nestOrder = 0;

            },
            templateUrl: './src/app/design/directives/design-node.tpl.html',
            scope:{
                plot:'=plot',
                node:"=node",
                eventListener:'&eventListener',
                selectedNodes:'&selectedNodes'
            },
            link:function($scope, $elem, $attrs){



                if (!$scope.node || $scope.node.id)
                {
                    //Todo: make this tear down if the node doesn't have an id.
                }

                var eventClass = '.designNode_' + $scope.node.id + '_event';

                //Set layout defaults
                var layoutDefaults = {
                    left:0,
                    top:0,
                    width:0,
                    height:0,
                    zIndex:0,
                    nestOrder:0
                };
                if (!$scope.node) { $scope.node = {};}
                if (!$scope.node.layout ) {$scope.node.layout = {};}


                ng.forEach(layoutDefaults, function(val, key)
                {
                    if (!this[key]){
                        this[key] = val;
                    }
                }, $scope.node.layout);



                //Register event listeners on $elem

                var delegatedEvents = {
                    'click':'click',
                    'mousedown':'mousedown',
                    'mouseup':'mouseup',
                    'mouseenter':'mouseenter',
                    'mouseleave':'mouseleave'
                };



                if ($scope.eventListener)
                {

                    var sendEventFactory = function(evName){
                        return function(event){
                            $scope.$emit(evName+':'+directiveName, event, $scope.node);
                        };
                    };

                    var eventName;
                    for (eventName in delegatedEvents)
                    {
                        $elem.on(eventName, sendEventFactory(delegatedEvents[eventName]));
                    }

                    $scope.$on("$destroy", function() {
                        $elem.off();
                    });
                }




                // Todo: calculate width and height as percentages of parent width and height, not as pixel values.
                // Todo: Store width as pixel based, but have the end calculation for display go in pixels.
                var layoutUnits = {
                    left:"px",
                    top:"px",
                    width:"px",
                    height:"px",
                    zIndex:""
                };

                function updateLayout(){
                    var styleRules = {};
                    ng.forEach($scope.node.layout, function(val, key){
                        var stringVal = ''+val+layoutUnits[key];
                        styleRules[key] = stringVal;
                    });
                    if (parseInt(styleRules['zIndex']) < 0)
                    {
                        styleRules.zIndex = '0';
                    }
                    $elem.css(styleRules);
                }

                function isSelected(){
                    _.contains($scope.selectedNodes, $scope.node.id);
                }

                function updatePresentation(){
                    var styleRules = {
                        border:'1px solid #666',
                        backgroundColor:'#fafafa',
                        position:'absolute'
                    };
                    if (isSelected())
                    {
                        styleRules.backgroundColor='#b1fga3';
                    }
                    $elem.css(styleRules);
                }

                function updateStyle(){
                    updateLayout();
                    updatePresentation();
                }

                $scope.$watch('node.layout', updateStyle, true);

                function updateSelection(){
                    updatePresentation();
                }

                $scope.$watch('selectedNodes', updateSelection, true);

                //Finally execute the style updating functions at least once.
                updateStyle();
            }
        };
    });


    return module;

});