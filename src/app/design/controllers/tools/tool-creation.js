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
                        'mousedown': function (jQEvent) {

                            var boundingClientRect = $scope.currentContext.currentContextDesignPanel.getBoundingClientRect();


                            var newScreenX = boundingClientRect.top;
                            var newScreenY = boundingClientRect.left;

                            // Make a unique id.
                            var newID = 0;

                            var someFunc = function (node) {
                                return (newID == node.id);
                            };

                            while (_.some(this.currentContext.designNodes, someFunc)) {
                                newID++;
                            }

                            this.currentContext.designNodes.push(generateDesignNode(newID, newScreenX, newScreenY));
                            this.createdNodeID = newID;
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

        prevScreenX:0,
        prevScreenY:0,
        screenXDelta:0,
        screenYDelta:0,

        handleMouseMove:function()
        {
            if (this.createdNodeID)
            {
                var designNodes = _.where(this.currentContext.designNodes, {id:this.createdNodeID});
                if (designNodes.length)
                {
                    designNodes[0].layout.width += this.screenXDelta;
                    designNodes[0].layout.height += this.screenYDelta;
                }
            }
            this.$scope.$apply();
        }

    });

    return CreationTool;
});