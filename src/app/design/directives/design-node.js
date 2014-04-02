define(['angular'], function (ng) {
    'use strict';
    var module = ng.module('app.design.directives.designNode', []);
    
    /**
     * And of course we define a controller for our route.
     */
    module.directive( 'designNode', function () {
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
                layout:"=layout"
            },
            link:function($scope, $elem, $attrs){
                var layoutDefaults = {
                    left:0,
                    top:0,
                    width:50,
                    height:50,
                    zIndex:0,
                    nestOrder:0
                };

                ng.forEach(layoutDefaults, function(val, key)
                {
                    if (!this[key]){
                        this[key] = val;
                    }
                }, $scope.layout);

                var unitDefaults = {
                    left:"px",
                    top:"px",
                    width:"%",
                    height:"%",
                    zIndex:""
                };

                function updateStyle(){
                    var styleRules = {
                        border:'1px solid #666',
                        backgroundColor:'#fafafa',
                        position:'absolute'
                    };
                    ng.forEach($scope.layout, function(val, key){
                        var stringVal = ''+val+unitDefaults[key];
                        styleRules[key] = stringVal;
                    });
                    $elem.css(styleRules);
                }

                $scope.$watch('layout', updateStyle, true);

                //Finally execute the style updating functions at least once.
                updateStyle();
            }
        };
    });


    return module;

});