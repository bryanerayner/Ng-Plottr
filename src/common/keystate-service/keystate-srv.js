/**
 * Created by bryanerayner on 2014-04-08.
 */
define(['angular', 'mousetrap'], function (ng, mousetrap) {
    'use strict';

    var module = ng.module('keystateService',
        [

        ]);

    module.factory("KeystateService", function(){

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

        var factory = {
            releaseEvents:releaseEvents,
            bindEvents:bindEvents,
            keyIsDown:keyIsDown,
            keyIsUp:keyIsUp
        };

        bindEvents();

        return factory;
    });

});