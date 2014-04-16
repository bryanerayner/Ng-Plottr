/**
 * Created by bryanerayner on 2014-04-15.
 */
define(['jrClass', 'lodash'], function(Class, _){
    'use strict';

    var spaceRegex = /[\s]+/gi;


    var EventMap =  Class.extend({
        init:function(name, events, ctx)
        {
            this.name = name;
            // Set up the events hash
            this._eventsHash = {};
            this._setUpEventsHash(events);

            this._eventsObject = null;

            if (ctx){
                this.ctx = ctx;
            }
        },

        addToHash:function(eventHash){

        },
        removeFromHash:function(eventHash){

        },

        setContext:function(ctx){
            this.ctx = ctx;
        },


        destroy:function(){
            this.releaseEventsObject();
            this._tearDownEventsHash();
        },

        handleEvent:function(event){
            var name = event.name;
            var args = Array.prototype.slice.call(arguments, 0);
            var ctx = this.ctx || window;
            if (_.isFunction(this._eventsHash[name])){
                this._eventsHash[name].apply(ctx, args);
            }
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

    return EventMap;
});