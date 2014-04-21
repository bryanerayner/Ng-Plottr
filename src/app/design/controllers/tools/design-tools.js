var needs = ['angular', './module', 'lodash', 'jrClass', './tool'];

needs = needs.concat([
    './tool-creation',
    './tool-selection'
]);

define(needs, function (ng, module, _, Class, Tool) {

    // Figure out all loaded tools:

    var toolArgs = Array.prototype.slice.call(arguments, 5);



    module.factory("DesignTools", ['KeystateService', 'MouseEventsService', 'UIEvents', function(KeystateService, MouseEventsService, UIEvents){

        var keystateListener = KeystateService.keystateListener;

        var mouseEventsListener = MouseEventsService.mouseEventsListener;

        var DesignTools = Class.extend(
            {
                init:function(tools, keystateListener){

                    this.currentContext = null;
                    this.$scope = null;
                    this.eventsObject = new UIEvents.EventsObject();

                    this.baseEventMap = null;
                    this.initTools(tools);

                    this.keystateListener= keystateListener;
                },

                /**
                 * Initialize the tools, and set up a base event map to register at the bottom of the stack.
                 * @param tools {Tool[]} An array of tools to set up.
                 */
                initTools:function(tools){
                    this.tools = tools;

                    var eventsHash = {};

                    this.eachTools(function(tool){
                        if (tool.keyboardShortcut)
                        {
                            eventsHash[tool.keyboardShortcut] = tool.name;
                        }
                        // This registers the events object, and adds all the event maps to it.
                        tool.registerEventsObject(this.eventsObject);
                        tool.keyIsDown = KeystateService.keyIsDown;
                        tool.keyIsUp = KeystateService.keyIsUp;
                    });

                    var newEventsHash = {};

                    function selectToolCallback(toolname)
                    {
                        return function(){
                            this.selectTool(toolname);
                        };
                    }

                    _.each(eventsHash, function(toolname, key){
                        newEventsHash[key] = selectToolCallback(toolname);
                    });

                    newEventsHash['keydown:esc'] = this.selectLastTool;

                    this.baseEventMap = new UIEvents.EventMap('designTools-base', newEventsHash, this);

                    // Add the event map
                    this.eventsObject.addEventMap(this.baseEventMap);
                    // Push it on.
                    this.eventsObject.pushEventMap('designTools-base');
                },

                eachTools:function(callback){
                    _.each(this.tools, callback, this);
                },

                applyOnTools:function(funcName)
                {
                    var args = Array.prototype.slice.call(arguments, 1);
                    _.each(this.tools, function(tool){
                       tool[funcName].apply(tool, args);
                    });
                },

                registerScope:function(newScope)
                {
                    this.$scope = newScope;
                    this.keystateListener.registerScope(newScope);
                    this.eventsObject.registerScope(newScope);
                    this.applyOnTools('registerScope', newScope);
                },

                releaseScope:function(){
                    delete this.$scope;
                    this.eventsObject.releaseScope();
                    this.keystateListener.releaseScope();
                    this.applyOnTools('releaseScope');
                },

                registerCurrentContext:function(currentContext){
                    this.currentContext = currentContext;
                    this.applyOnTools('registerCurrentContext', currentContext);
                },

                releaseCurrentContext:function(){
                    delete this.currentContext;
                    this.applyOnTools('releaseCurrentContext');
                },

                selectTool:function(toolname){
                    var tools = _.filter(this.tools, function(tool){
                        if (tool.name == toolname) {return true;}
                    });
                    if (tools.length) {
                        this.deselectTools();

                        var selectedTool = tools[0];

                        this.eventsObject.pushEventMap(selectedTool.defaultEventMap);

                        this.currentContext.selectedTool = selectedTool.name;

                        this.calculateSelectedTool();

                        this.$scope.$apply();

                        this.$scope.$emit('toolSelected', toolname);
                        this.$scope.$emit('toolSelected'+':'+toolname);
                    }
                },

                calculateSelectedTool:function(){
                    var currentSelectedEventMap = this.eventsObject.currentEventMap();
                    _.each(this.tools, function (tool) {
                        tool.isSelected = tool.ownsEventMap(currentSelectedEventMap);
                    }, this);

                    return _.filter(this.tools, function(tool){
                        return tool.isSelected;
                    })[0] || null;
                },

                selectLastTool:function()
                {
                    // The current event map contains the current tool
                    var selectedTool = this.calculateSelectedTool();

                    if (selectedTool){
                        while (selectedTool.isSelected)
                        {
                            this.eventsObject.popEventMap();
                            this.calculateSelectedTool();
                        }

                        var newSelectedTool = this.calculateSelectedTool();
                        if (newSelectedTool){
                            this.currentContext.selectedTool = newSelectedTool.name;
                        }else{
                            this.currentContext.selectedTool = null;
                        }
                        this.$scope.$apply();
                    }
                },

                deselectTools:function(){
                    while(this.calculateSelectedTool())
                    {
                        this.eventsObject.popEventMap();
                    }
                }
            }
        );


        var tools = [];

        var c = 0;
        while(_.isFunction(toolArgs[c]))
        {
            tools.push(new toolArgs[c]());
            c++;
        }

        var service = new DesignTools(tools, keystateListener);

        return service;
    }]);

});
