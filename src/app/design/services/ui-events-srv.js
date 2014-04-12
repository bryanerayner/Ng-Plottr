define(['angular', './module', 'lodash'], function (ng, module, _) {
    'use strict';

    /**
     * UIEvents
     * @name app.design.services:UIEvents
     *
     * @description
     *
     * A service for listening to UI Events across the application. Provides EventMap (for organizing event state) as well
     * as EventObject (a wrapper around a $scope).
     */
    module.factory( 'UIEvents', [function () {


        var service = {};

        var spaceRegex = /[\s]+/gi;


        var EventMap = service.EventMap = function(name, events)
        {
            this.name = name;
            // Set up the events hash
            this._eventsHash = {};
            this._setUpEventsHash(events);

            this._eventsObject = null;
        };

        _.extend(EventMap.prototype, {


            destroy:function(){
                this.releaseEventsObject();
                this._tearDownEventsHash();
            },

            handleEvent:function(){

            },

            /**
             * Returns whether or not the event map handles the certain event name.
             * @param name
             * @returns {boolean}
             */
            handles:function(name){
              return !!this._eventsHash[name];
            },

            getEvents:function(){
                return this._eventsHash;
            },

            registerEventsObject:function(eventsObject){
                this._eventsObject = eventsObject;
            },

            releaseEventsObject:function(){
                delete this._eventsObject;
            },

            /**
             * @method _setUpEventsHash
             * @description Set up _eventsHash. Separate space separated strings to call the same callback.
             * @param events Object A hash of the events to register callback functions on.
             */
            _setUpEventsHash:function(events)
            {
                var t = this;

                _.each(events, function(callback, eventName){
                    var names = eventName.split(spaceRegex);
                    _.each(names, function(name){
                        t._eventsHash[name] = callback;
                    });
                });
            },

            _tearDownEventsHash:function(){
                var t = this;
                _.each(_.keys(t._eventsHash), function(key){
                    delete t._eventsHash[key];
                });
                t._eventsHash = {};
            }
        });


        var EventsObject = service.EventsObject = function () {
            this.$scope = null;
            this.eventMaps = {};
            this.handledEvents = [];
            this.eventMapStack = [];
            this.eventRemovers = {};
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

                var origStopProp = event.stopPropagation;



                var executionContext = {
                    stopPropagation:false
                };

                var newArgs = [event].concat(args);

                event.stopPropagation = function(){
                    origStopProp();
                    executionContext.stopPropagation = true;
                };

                for (var i = this.eventMapStackLength; i >= 0; i --)
                {
                    if (executionContext.stopPropagation){
                        break;
                    }
                    var currentEventMap = this.eventMaps[this.eventMapsStack[i]];
                    if (currentEventMap.handles(name)) {
                        currentEventMap.handleEvent.apply(targetEventMap, args);
                    }
                }
            },

            getCorrectEventMap:function(name){

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
             * addHandledEvents
             * @description Adds new events to the $scope. If events are already added to the $scope, they are not added a second time.
             * @param newEvents string|string[] The event(s) to add to the scope.
             */
            addHandledEvents:function(newEvents){
                if (!this.$scope) {return;}


                var newEventsList = [];
                newEventsList = newEventsList.concat(newEvents);

                // We don't want to double listen - Remove any events that are already handled.
                var newEventsList = _.difference(newEventsList, this.handledEvents);


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
             * setEventMap
             * @description Set the event map to be used for all keyboard and mouse click input.
             * @param newEventMap string The event map to load.
             */
            setEventMap: function (newEventMap) {
                if (_.isString(newEventMap) && this.eventMaps[newEventMap]) {
                    this.eventMapStack.push(newEventMap);
                    this.eventMapStackLength = this.eventMapStack.length;
                }
            },

            // Return a reference to the service
            self: function () {
                return EventsObject;
            }
        });



        return service;
    }]);

});/**
 * Created by bryanerayner on 2014-04-10.
 */
