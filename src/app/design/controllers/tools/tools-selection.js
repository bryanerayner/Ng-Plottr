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

    var cloneTool = new Tool('clone',
		[
		new EventMap('clone',{
			'click:designNode':function(event, clickx, clicky)
				{
				this.selectedNode = event.nodeID;

				this.eventsObject.pushEventMap('clone-chooseTarget');
				}
		}),
		new EventMap('clone-chooseTarget',{
			'click:designNode':function(event, clickx, clicky)
			    {
			        this.targetNode = event.nodeID;
			    //Do stuff;
			        this.eventsObject.popEventMap();
			    }
		})
	]);

    return new SelectionTool();
});