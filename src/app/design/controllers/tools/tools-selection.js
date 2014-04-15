//Selection tool

define(['angular', 'lodash', './tool'], function (ng, _, Tool) {
    'use strict';



    var SelectionTool = Tool.extend({
        defaults:
        {
            name:'selection',
            keyboardShortcut:'v',
            eventMaps:[
                new EventMap('selection',{
                    'click:designNode':function(event, node)
                    {
                        var nodeID = node.id;
                        this.currentContext.selectedNodes = _.union(this.currentContext.selectedNodes, [nodeID]);
                        this.$scope.$apply();
                    }
                })
                ]
        }

    });

    return new SelectionTool();
});