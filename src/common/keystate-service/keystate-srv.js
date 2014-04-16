/**
 * Created by bryanerayner on 2014-04-08.
 */
define(['angular', 'mousetrap', 'lodash'], function (ng, mousetrap, _ ) {
    'use strict';

    var module = ng.module('keystateService',
        [

        ]);

    module.service("KeystateService", function(){

        var factory = {};

        var eventsList = ['keydown','keyup','keypress'];

        var KeystateListener = factory.KeystateListener = function(){

            this._pressedKeys = {};
            this._configure();
            this.$scope = null;
        };

        _.extend(KeystateListener.prototype, {
            registerScope:function($scope){
                this.$scope = $scope;
            },
            releaseScope:function($scope){
                delete this.$scope;
            },
            _configure:function(){
                var docEl = ng.element(document);
                _.each(eventsList, function(eventName){
                    var boundEventCallback = _.bind(this[eventName], this);
                    docEl.on(eventName, boundEventCallback);
                }, this);
            },
            keydown:function(event){
                
            },
            keyup:function(event){

            },
            keypress:function(event){

            }
        });

        var passthroughList = ['$emit', '$broadcast'];
        _.each(passthroughList, function(funcName){
            KeystateListener.prototype[funcName] = function()
            {
                var args = Array.prototype.slice.call(arguments, 0);
                if (this.$scope){
                    this.$scope[funcName].apply(this.$scope, args);
                }
            };
        });

        var keystateListener = new KeystateListener();



        var eventsBound = false;

        var keyListeners = [
            'backspace',
            'tab',
            'enter',
            'shift',
            'ctrl',
            'alt',
            'capslock',
            'esc',
            'space',
            'pageup',
            'pagedown',
            'end',
            'home',
            'left',
            'up',
            'right',
            'down',
            'ins',
            'del',
            'meta',
            '+',
            '-',
            '.',
            '/',
            ';',
            '=',
            ',',
            '`',
            '[',
            '\\',
            ']',
            '\''
        ];
        var alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0, ii = alphabet.length; i < ii; i++){
            keyListeners.push(alphabet.charAt(i));
        }
        for (i = 1, ii = 20; i < ii; i++){
            keyListeners.push('f' + i);
        }

        var pressedKeys = {};

        function pressedStateFactory(upDown, key){
            if (upDown == 'up')
            {
                return function(){
                    pressedKeys[key] = false;
                };
            }else if (upDown == 'down'){
                return function(){
                    pressedKeys[key] = true;
                };
            }
        }

        var _SPECIAL_ALIASES = {
            'option': 'alt',
            'command': 'meta',
            'return': 'enter',
            'escape': 'esc',
            'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
        };



        function releaseEvents(){
            if (eventsBound) {
                for (i = 0, ii = keyListeners.length; i < ii; i++) {
                    Mousetrap.unbind(keyListeners[i]);
                }

                var key;
                for (key in pressedKeys) {
                    pressedKeys[key] = false;
                }
                eventsBound = false;
            }
        }

        function bindEvents(){
            var i, ii;
            if (!eventsBound){
                for (i=0, ii= keyListeners.length; i < ii; i++){
                    Mousetrap.bind(keyListeners[i], pressedStateFactory('up', keyListeners[i]), 'keyup');
                    Mousetrap.bind(keyListeners[i], pressedStateFactory('down', keyListeners[i]), 'keydown');
                }
                eventsBound = true;
            }
        }

        function keyIsDown(key){

            if (_SPECIAL_ALIASES[key]) {
                key = _SPECIAL_ALIASES[key];
            }

            if (pressedKeys[key])
            {
                return true;
            }else{
                return false;
            }
        }

        function keyIsUp(key){
            return !keyIsDown(key);
        }

        _.extend(factory, {
            releaseEvents:releaseEvents,
            bindEvents:bindEvents,
            keyIsDown:keyIsDown,
            keyIsUp:keyIsUp,
            keystateListener:keystateListener
        });

        bindEvents();

        return factory;
    });

});