define(['lodash', './EventMap'], function(_, EventMap){
var EventsObject = function () {
    this.$scope = null;
    this.eventMaps = {};
    this.handledEvents = [];
    this.eventMapStack = [];
    this.eventRemovers = {};
    this.eventMapStackLength = 0;
    this.boundHandleEvent = _.bind(this.handleEvent, this);
};

_.extend(EventsObject.prototype, {

    /**
     * registerScope
     * @description Register a $scope to use for event listening
     * @param $scope The scope to use for event listening
     */
    registerScope: function($scope)
    {
        this.$scope = $scope;
        if (this.eventMaps)
        {
            _.each(this.eventMaps, function(eventMap){
                this.addHandledEvents(_.keys(eventMap.getEvents()));
            }, this);
        }
    },

    /**
     * releaseScope
     * @description Release the scope and all events bound to it.
     */
    releaseScope: function () {
        this.removeHandledEvents(this.handledEvents);
        delete this.$scope;
    },

    /**
     * handleEvent
     * @description Callback which is registered on $scope. Delegates any event to the current EventMap for handling.
     */
    handleEvent:function(event){
        var args;
        var name;

        args = Array.prototype.slice.call(arguments, 1);
        name = event.name;


        var executionContext = {
            stopPropagation:false
        };

        // Have to clone the event here.... We need to keep the original stuff before we mutate it.
        var newEvent = _.clone(event);

        var origStopProp = event.stopPropagation;


        newEvent.stopPropagation = function(){
            origStopProp();
            executionContext.stopPropagation = true;
        };

        var newArgs = [newEvent].concat(args);





        for (var i = this.eventMapStackLength; i > 0; i --)
        {
            if (executionContext.stopPropagation){
                break;
            }
            var currentEventMap = this.eventMaps[this.eventMapStack[i-1]];
            if (currentEventMap.handles(name)) {
                currentEventMap.handleEvent.apply(currentEventMap, newArgs );
            }
        }
    },

    /**
     * addEventMap
     * @description Add an event map to the object. Begin listening to its events on $scope.
     */
    addEventMap: function (eventMap) {


        if (!eventMap instanceof EventMap) {
            throw "Error: Expected eventMap to be an instance of EventMap";
        }

        var eventMapName = eventMap.name;
        if (this.eventMaps[eventMapName])
        {
            this.eventMaps[eventMapName].destroy();
        }

        this.eventMaps[eventMapName] = eventMap;

        this.addHandledEvents(_.keys(eventMap.getEvents()));

        eventMap.registerEventsObject(this);
        // Add the events that are handled by the eventMap to the list of handled events.
    },

    /**
     * Remove an event map, from the stack as well from the event.
     * @param eventMap
     */
    removeEventMap:function(eventMap){
        var eventMapName = eventMap.name;
        if (this.eventMaps[eventMapName])
        {
            this.removeFromEventMapStack(eventMapName);
            this.eventMaps[eventMapName].destroy();
            delete this.eventMaps[eventMapName];
        }
    },
    /**
     * addHandledEvents
     * @description Adds new events to the $scope. If events are already added to the $scope, they are not added a second time.
     * @param newEvents string|string[] The event(s) to add to the scope.
     */
    addHandledEvents:function(newEvents){
        if (!this.$scope) {return;}


        var newEventsList = [];
        newEventsList = newEventsList.concat(newEvents);

        // We don't want to double listen - Remove any events that are already handled.
        newEventsList = _.difference(newEventsList, this.handledEvents);


        _.each(newEventsList , function(eventName){
            // Double check our bases - remove the event listener if it's already there.
            this._applyEventRemover(eventName);
            // Bind the event, and store the event removal function that $on returns
            this.eventRemovers[eventName] = this.$scope.$on(eventName, this.boundHandleEvent);
        }, this);
    },

    /**
     * removeHandledEvents
     * @description Removes events from the $scope.
     * @param removedEvents string|string[] The event(s) to remove from the scope.
     */
    removeHandledEvents:function(removedEvents){
        if (!this.$scope) {return;}

        var newEventsList = [];
        newEventsList = newEventsList.concat(removedEvents);

        _.each(newEventsList, function(eventName){
            // Get rid of the event that's bound at this event name.
            this._applyEventRemover(eventName);
        }, this);

        this.handledEvents = _.difference(this.handledEvents, newEventsList);
    },

    _applyEventRemover:function(eventName)
    {
        if (_.isFunction(this.eventRemovers[eventName]))
        {
            this.eventRemovers[eventName]();
        }
    },

    /**
     * pushEventMap
     * @description Push an event map on to the stack to be used for the first pass of all keyboard and mouse input.
     * @param newEventMap string The event map to load.
     */
    pushEventMap: function (newEventMap) {
        if (_.isString(newEventMap) && this.eventMaps[newEventMap]) {
            this.eventMapStack.push(newEventMap);
            this.eventMapStackLength = this.eventMapStack.length;
        }
    },

    /**
     * popEventMap
     * @description Pop the top event map off the stack, allowing the next event map to work.
     * @return {[type]}
     */
    popEventMap:function(){
        this.eventMapStack.pop();
    },

    /**
     * Remove a name from the eventMapStack
     * @param name
     */
    removeFromEventMapStack:function(names){
        var namesToRemove = [].concat(names);
        _.each(namesToRemove, function(name){
            var removed = _.remove(this.eventMapStack, function(item){return (item == name) ? true : false;});
        });
        this.eventMapStackLength = this.eventMapStack.length;
    }
});

return EventsObject;

});