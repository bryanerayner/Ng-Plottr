//Selection tool

define(['angular', 'lodash', './tool', '../../services/classes/EventMap'], function (ng, _, Tool, EventMap) {
    'use strict';



    var SelectionTool = Tool.extend({
        defaults:
        {
            name:'selection',
            keyboardShortcut:'keypress:v',
            eventMaps:[
                new EventMap('selection',{
                    'click:designNode':function(event, jQEvent, node)
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