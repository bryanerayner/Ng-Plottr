//Selection tool

define(['angular', 'lodash', './tool', '../../services/classes/EventMap'], function (ng, _, Tool, EventMap) {
    'use strict';




    var generateDesignNode = function(id, left, top){
        return {
            id:id,
            name: "Welcome Hero",
            type: "h1",
            roles: [
                "hero",
                "header"
            ],
            layout: {
                left: left,
                top: top,
                width: 0,
                height: 0,
                zIndex: 0,
                nestOrder: 0
            },
            innerContent: {
                nodes: []
            },
            inlineStyles: {
            },
            referencedStyles: [],
            group: 0
        };
    };


    var CreationTool;

    CreationTool = Tool.extend({
            defaults: function () {
                return {
                    name: 'creation',
                    keyboardShortcut:'keydown:n',
                    eventMaps:[
                    new EventMap('creation', {
                        'toolSelected': function () {
                            this.createdNodeID = null;
                        },

                        'mousedown': function (event, jQEvent) {

                            var boundingClientRect = this.getDesignPanelBoundingClientRect();

                            // Normalize ScreenX & ScreenY to take into account the design panel.
                            var mousePos = this.normalizeMousePosition(jQEvent);

                            var newPageX = mousePos.pageX;
                            var newPageY = mousePos.pageY;

                            if (newPageX > boundingClientRect.width || newPageY > boundingClientRect.height){
                                return; // This is not in bounds of the current design scope. Return.
                            }
                            // Make a unique id.
                            var newID = 0;

                            var someFunc = function (node) {
                                return (newID == node.id);
                            };

                            while (_.some(this.currentContext.designNodes, someFunc)) {
                                newID++;
                            }

                            this.currentContext.designNodes.push(generateDesignNode(newID,
                                newPageX,
                                newPageY));
                            this.createdNodeID = newID;
                            this.handleMouseMove();
                            event.stopPropagation();
                        },
                        'mouseup': function () {
                            this.createdNodeID = null;
                        },
                        'keydown:esc': function (event) {
                            if (this.createdNodeID) {
                                this.currentContext.designNodes = _.filter(this.currentContext.designNodes, function (designNode) {
                                    return (designNode.id != this.createdNodeID);
                                });
                                this.createdNodeID = null;
                                this.$scope.$apply();
                            }
                        },
                        'mousemove': function (event, jQEvent) {

                            var mousePos = this.normalizeMousePosition(jQEvent);

                            var newPageX = mousePos.pageX;
                            var newPageY = mousePos.pageY;

                            this.pageX = newPageX;
                            this.pageY= newPageY;

                            this.pageXDelta = newPageX - this.prevPageX;
                            this.pageYDelta = newPageY - this.prevPageY;

                            this.handleMouseMove();

                            this.prevPageX = newPageX;
                            this.prevPageY = newPageY;
                        }
                    })
                ]
            };
        },

        prevPageX:0,
        prevPageY:0,
        pageXDelta:0,
        pageYDelta:0,
        pageX:0,
        pageY:0,

        handleMouseMove:function()
        {
            if (this.createdNodeID)
            {
                var designNodes = _.where(this.currentContext.designNodes, {id:this.createdNodeID});
                if (designNodes.length)
                {
                    designNodes[0].layout.width = this.pageX - designNodes[0].layout.left;
                    designNodes[0].layout.height = this.pageY - designNodes[0].layout.top;
                }
            }
            this.$scope.$apply();
        },

        getDesignPanelBoundingClientRect:function(){
            return this.$scope.currentContext.getDesignPanel().getBoundingClientRect();
        },

        normalizeMousePosition:function(jQEvent){
            var mousePos = {};
            var boundingClientRect = this.getDesignPanelBoundingClientRect();
            if (boundingClientRect)
            {
                mousePos.pageX = jQEvent.pageX - boundingClientRect.left;
                mousePos.pageY= jQEvent.pageY - boundingClientRect.top;
            }
            return mousePos;
        }

    });

    return CreationTool;
});