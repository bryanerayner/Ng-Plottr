define(['angular', './module', 'lodash', 'jrClass', './tool', './tools-selection', 'mousetrap'], function (ng, module, _, Class, Tool, tools_selection, mousetrap) {

    module.factory("DesignTools", ['KeystateService', 'UIEvents', function(KeystateService, UIEvents){

        var keystateListener = KeystateService.keystateListener;

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
                            eventsHash[tool.keyboardShortcut] = tool.defaultEventMap;
                        }
                        // This registers the events object, and adds all the event maps to it.
                        tool.registerEventsObject(this.eventsObject);
                    });

                    var newEventsHash = {};

                    function selectToolCallback(toolname)
                    {
                        return function(){
                            this.eventsObject.pushEventMap(toolname);
                        };
                    }

                    _.each(eventsHash, function(defaultEventMap, key){
                        newEventsHash[key] = selectToolCallback(defaultEventMap);
                    });

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
                }
            }
        );


        var tools = [
            tools_selection
        ];


        var service = new DesignTools(tools, keystateListener);

        return service;

    }]);

});
