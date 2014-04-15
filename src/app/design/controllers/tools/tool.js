define(['jrClass', 'lodash'], function (Class, _) {

    var Tool = Class.extend({

        defaults:{
            name:null,
            keyboardShortcut:null,
            eventMaps:[],
            defaultEventMap:null
        },

        init: function (name, eventMaps, keyboardShortcut, defaultEventMap) {
            this.name = name || this.defaults.name;
            this.eventMaps = eventMaps || this.defaults.eventMaps;
            this.keyboardShortcut = keyboardShortcut || this.defaults.keyboardShortcut;
            this.defaultEventMap = defaultEventMap || this.defaults.defaultEventMap || this.eventMaps[0].name;
            this.currentContext = null;

            _.each(eventMaps, function(eventMap){
                eventMap.setContext(this);
            }, this);
        },

        registerCurrentContext: function (context) {
            this.currentContext = context;
        },

        releaseCurrentContext: function (context) {
            delete this.currentContext;
        },

        registerEventsObject: function (eventsObject) {
            this.eventsObject = eventsObject;
        },

        releaseEventsObject: function () {
            delete this.eventsObject;
        }

    });




    return Tool;
});