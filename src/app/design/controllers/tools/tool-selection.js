//Selection tool

define(['angular', 'lodash', './tool', '../../services/classes/EventMap'], function (ng, _, Tool, EventMap) {
    'use strict';


    var SelectionTool;
    SelectionTool = Tool.extend({
        defaults: function(){
            return{
            name: 'selection',
            keyboardShortcut: 'keydown:v',
            eventMaps: [
                new EventMap('selection', {
                    'toolSelected':function(){
                        this.mouseDownOnSelectedNode = false;
                    },

                    'click:designNode': function (event, jQEvent, node) {
                        var nodeID = node.id;
                        var selectedNodes = this.currentContext.selectedNodes;
                        if (this.keyIsDown('shift') || this.keyIsDown('ctrl'))
                        {
                            if (_.contains(selectedNodes, nodeID)) {
                                selectedNodes = _.without(selectedNodes, nodeID);
                            }
                            else {
                                selectedNodes = _.union(selectedNodes, [nodeID]);
                            }
                        }else{
                            selectedNodes = [nodeID];
                        }
                        // If shift or ctrl is down, we make this an additive selection.

                        this.currentContext.selectedNodes = selectedNodes;
                    },
                    'mousedown:designNode':function(event, jQEvent, node){
                        var nodeID = node.id;
                        if (_.contains(this.currentContext.selectedNodes, nodeID))
                        {
                            this.mouseDownOnSelectedNode = true;
                        }else{
                            this.mouseDownOnSelectedNode = false;
                        }
                    },
                    'mouseup':function(){
                        this.mouseDownOnSelectedNode = false;
                    },
                    'keydown:esc': function (event) {
                        if (this.currentContext.selectedNodes.length) {
                            event.stopPropagation();
                        }
                        this.currentContext.selectedNodes = [];
                    },
                    'mousemove':function(event, jQEvent){
                        var newScreenX = jQEvent.screenX;
                        var newScreenY = jQEvent.screenY;

                        this.screenXDelta = newScreenX - this.prevScreenX;
                        this.screenYDelta = newScreenY - this.prevScreenY;

                        this.handleMouseMove();

                        this.prevScreenX = newScreenX;
                        this.prevScreenY = newScreenY;
                    }
                })
            ]
        };
        },

        mouseDownOnSelectedNode:false,
        prevScreenX:0,
        prevScreenY:0,
        screenXDelta:0,
        screenYDelta:0,

        handleMouseMove:function()
        {
            if (this.mouseDownOnSelectedNode)
            {
                _.each(this.currentContext.selectedNodes, function(selectedNode){
                    var designNodes = _.where(this.currentContext.designNodes, {id:selectedNode});
                    if (designNodes.length)
                    {
                        designNodes[0].layout.left += this.screenXDelta;
                        designNodes[0].layout.top += this.screenYDelta;
                    }
                }, this);
            }
            this.$scope.$apply();
        }

    });

    return SelectionTool;
});