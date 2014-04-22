//Selection tool

define(['angular', 'lodash', './tool', '../../services/classes/EventMap'], function (ng, _, Tool, EventMap) {
    'use strict';


    var SelectionTool;
    SelectionTool = Tool.extend({
        defaults: function(){
            return{
                name: 'selection',
                keyboardShortcut: 'keydown:v',
                glyphicon:'glyphicon glyphicon-flash',
            eventMaps: [
                new EventMap('selection', {
                    'toolSelected':function(){
                        this.mouseDownOnSelectedNode = false;
                    },

//                    'click:designNode': function (event, jQEvent, node) {
//                        this.modifySelectedNodes(node);
//                    },
                    'mousedown:designPanel':function(event, jQEvent){
                        this.currentContext.selectedNodes = [];
                        this.mouseDownOnSelectedNode = false;

                        event.stopPropagation();
                    },
                    'mousedown:designNode':function(event, jQEvent, node){
                        if (!this.mouseDownOnSelectedNode){
                            this.modifySelectedNodes(node);
                            this.mouseDownOnSelectedNode = true;
                            event.stopPropagation();
                            jQEvent.stopImmediatePropagation();
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
                        var newPageX = jQEvent.pageX;
                        var newPageY = jQEvent.pageY;

                        this.pageXDelta = newPageX - this.prevPageX;
                        this.pageYDelta = newPageY - this.prevPageY;

                        this.handleMouseMove();

                        this.prevPageX = newPageX;
                        this.prevPageY = newPageY;
                    },
                    'ctrl+]':function()
                    {
                        this.eachSelectedNode(function(node){
                           node.layout.zIndex++;
                        });
                    },
                    'ctrl+[':function()
                    {
                        this.eachSelectedNode(function(node){
                            node.layout.zIndex--;
                            if (node.zIndex < 0) {node.zIndex = 0;}
                        });
                    },
                    'left':function(){
                        this.nudgeSelectedNodes({left:-1});
                    },
                    'right':function(){
                        this.nudgeSelectedNodes({left:1});
                    },
                    'up':function(){
                        this.nudgeSelectedNodes({top:-1});
                    },
                    'down':function(){
                        this.nudgeSelectedNodes({top:1});
                    },
                    'shift+left':function(){
                        this.nudgeSelectedNodes({left:-10});
                    },
                    'shift+right':function(){
                        this.nudgeSelectedNodes({left:10});
                    },
                    'shift+up':function(){
                        this.nudgeSelectedNodes({top:-10});
                    },
                    'shift+down':function(){
                        this.nudgeSelectedNodes({top:10});
                    }
                })
            ]
        };
        },

        mouseDownOnSelectedNode:false,
        prevPageX:0,
        prevPageY:0,
        pageXDelta:0,
        pageYDelta:0,

        eachSelectedNode:function(callback){
            _.each(this.currentContext.selectedNodes, function(node){
                var cNode = _.where(this.currentContext.designNodes, {id:node});
                if (cNode.length){
                    callback(cNode[0]);
                }
            }, this);
        },

        nudgeSelectedNodes:function(offset){
            this.eachSelectedNode(function(node){
                node.layout.left += offset.left || 0;
                node.layout.top += offset.top || 0;
            });
        },

        handleMouseMove:function()
        {
            if (this.mouseDownOnSelectedNode)
            {
                _.each(this.currentContext.selectedNodes, function(selectedNode){
                    var designNodes = _.where(this.currentContext.designNodes, {id:selectedNode});
                    if (designNodes.length)
                    {
                        designNodes[0].layout.left += this.pageXDelta;
                        designNodes[0].layout.top += this.pageYDelta;
                    }
                }, this);
            }
        },

        modifySelectedNodes:function(node)
        {
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
                if (!_.contains(selectedNodes, nodeID)) {
                    selectedNodes = [nodeID];
                }
            }
            // If shift or ctrl is down, we make this an additive selection.
            this.currentContext.selectedNodes = selectedNodes;
        }

    });

    return SelectionTool;
});