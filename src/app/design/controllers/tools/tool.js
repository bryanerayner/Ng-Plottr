define(['jrClass', 'lodash'], function (Class, _) {

    var Tool;
    Tool = Class.extend({

        defaults: function(){
            return {
                name: null,
                    keyboardShortcut: null,
                eventMaps: [],
                defaultEventMap: null
            };
        },

        init: function (name, eventMaps, keyboardShortcut, defaultEventMap) {
            if (_.isFunction(this.defaults))
            {
                this.defaults = this.defaults();
            }
            this.name = name || this.defaults.name;
            this.eventMaps = eventMaps || this.defaults.eventMaps;
            this.keyboardShortcut = keyboardShortcut || this.defaults.keyboardShortcut;
            this.defaultEventMap = defaultEventMap || this.defaults.defaultEventMap || this.eventMaps[0].name;
            this.currentContext = null;
            this.$scope = null;
            this.isSelected = false;
            this.keyboardService = null;

            _.each(this.eventMaps, function (eventMap) {
                eventMap.setContext(this);
            }, this);
        },

        // These are both overridden by anything using the tool.
        keyIsDown:function(key){
            return false;
        },

        keyIsUp:function(key){
            return false;
        },

        registerCurrentContext: function (context) {
            this.currentContext = context;
        },

        releaseCurrentContext: function (context) {
            delete this.currentContext;
        },

        registerEventsObject: function (eventsObject) {
            this.eventsObject = eventsObject;
            _.each(this.eventMaps, function (eventMap) {
                this.eventsObject.addEventMap(eventMap);
            }, this);

        },

        releaseEventsObject: function () {
            _.each(this.eventMaps, function (eventMap) {
                this.eventsObject.removeEventMap(eventMap);
            }, this);
            delete this.eventsObject;

        },

        registerScope: function (newScope) {
            this.$scope = newScope;
        },
        releaseScope: function () {
            delete this.$scope;
        },

        ownsEventMap: function (eventMapName) {
            var matchingMaps = _.filter(this.eventMaps, function (eventMap) {
                return eventMap.name === eventMapName;
            });
            return (matchingMaps.length > 0);
        }

    });




    return Tool;
});