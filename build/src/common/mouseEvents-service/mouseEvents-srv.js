/**
 * Created by bryanerayner on 2014-04-08.
 */
define(['angular', 'lodash', 'jrClass'], function (ng, _ , Class) {
    'use strict';

    var module = ng.module('mouseEventsService',
        [

        ]);

    module.service("MouseEventsService", ['$rootScope', function($rootScope){

        var factory = {};

        var eventsList = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup'];


        var MouseEventsListener = function(){
            this.mouseButtonDown = false;
            this.$scope = null;
            this._configure();
        };

        _.extend(MouseEventsListener.prototype, {
            registerScope:function($scope){
                this.$scope = $scope;
            },
            releaseScope:function(){
                delete this.$scope;
            },

            _configure:function(){
                var bodyEl = ng.element(document.querySelector('body'));
                _.each(eventsList, function(eventName){
                    var boundEventCallback = _.bind(this[eventName], this);
                    bodyEl.on(eventName, boundEventCallback);
                }, this);
            },

            mouseButtonIsDown:function(){
              return this.mouseButtonDown;
            },

            mousedown:function(event){
                this.mouseButtonDown = true;
                this.baseMouseEventHandler('mousedown', event);
            },
            mouseup:function(event){
                this.mouseButtonDown = false;
                this.baseMouseEventHandler('mouseup', event);
            },
            baseMouseEventHandler:function(eventName, event)
            {
                this.$broadcast(eventName, event);
            }
        });

        _.each(eventsList, function(eventName){
            if (!MouseEventsListener.prototype[eventName]){
                MouseEventsListener.prototype[eventName] = function(event){
                    return this.baseMouseEventHandler(eventName, event);
                };
            }
        });

        var passthroughList = ['$emit', '$broadcast'];
        _.each(passthroughList, function(funcName){
            MouseEventsListener.prototype[funcName] = function()
            {
                var args = Array.prototype.slice.call(arguments, 0);
                if (this.$scope){
                    this.$scope[funcName].apply(this.$scope, args);
                }
            };
        });

        var mouseEventsListener = new MouseEventsListener();

        mouseEventsListener.registerScope($rootScope);


        _.extend(factory, {
            mouseButtonIsDown:function(){
                return mouseEventsListener.mouseButtonIsDown();
            },
            mouseEventsListener:mouseEventsListener
        });

        return factory;
    }]);

});