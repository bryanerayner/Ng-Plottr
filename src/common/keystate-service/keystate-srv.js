/**
 * Created by bryanerayner on 2014-04-08.
 */
define(['angular', 'mousetrap', 'lodash'], function (ng, mousetrap, _ ) {
    'use strict';

    var module = ng.module('keystateService',
        [

        ]);

    module.service("KeystateService", ['$rootScope', function($rootScope){

        var factory = {};

        var eventsList = ['keydown','keyup','keypress'];


        var KEY_CODES = {
            8:'backspace',
            9:'tab',
            13:'enter',
            16:'shift',
            17:'ctrl',
            18:'alt',
            19:'pause/break',
            20:'caps',
            27:'esc',
            33:'pgUp',
            34:'pgDown',
            35:'end',
            36:'home',
            37:'left',
            38:'up',
            39:'right',
            40:'down',
            45:'insert',
            46:'delete',
            91:'super_left',
            92:'super_right',
            93:'select',
            96:'num0',
            97:'num1',
            98:'num2',
            99:'num3',
            100:'num4',
            101:'num5',
            102:'num6',
            103:'num7',
            104:'num8',
            105:'num9',
            106:'multiply',
            107:'add',
            109:'subtract',
            110:'.',
            111:'/',
            112:'f1',
            113:'f2',
            114:'f3',
            115:'f4',
            116:'f5',
            117:'f6',
            118:'f7',
            119:'f8',
            120:'f9',
            121:'f10',
            122:'f11',
            123:'f12',

            144:'numLock',
            145:'scrollLock',
            186:';',
            187:'=',
            188:',',
            189:'-',
            190:'.',
            191:'/',
            219:'[',
            220:'\\',
            221:']',
            222:'\''
        };

        var INVERSE_KEY_CODES = {};

        var environment = 'pc';
        if (navigator.userAgent.indexOf('Mac OS X') != -1) {
            environment = 'mac';
        }


        var EXT_MAPPING = {
            'super_left':'super',
            'super_right':'super'
        };

        var INVERSE_EXT_MAPPING = {
            'super':['super_left', 'super_right']
        };

        // Set up the environemtn for mac.
        if (environment == 'mac')
        {
            _.extend(EXT_MAPPING, {
                'super_left':'ctrl',
                'super_right':'select',
                'select':'ctrl',
                'ctrl':'super'
            });
            _.extend(INVERSE_EXT_MAPPING, {
                'ctrl':['super_left', 'select'],
                'super':['ctrl'],
                'select':['super_right']
            });
        }

        var SIGNIFICANT_KEYS = [
            'super',
            'ctrl',
            'select',
            'shift',
            'alt'
        ];

        var updateKeyCodes = function(keyCode){
            KEY_CODES[keyCode] = String.fromCharCode(keyCode).toLowerCase();
            INVERSE_KEY_CODES = _.invert(KEY_CODES);
            return KEY_CODES[keyCode];
        };


        var arraySwap = function(array, index1, index2)
        {
            var temp = _.clone(array[index1]);
            array[index1] = _.clone(array[index2]);
            array[index2] = temp;
            return array;
        };

        var KeystateListener = function(){
            this._pressedKeys = {};
            this._previousKeys = {};
            this.$scope = null;
            this._configure();
        };

        _.extend(KeystateListener.prototype, {
            registerScope:function($scope){
                this.$scope = $scope;
            },
            releaseScope:function($scope){
                delete this.$scope;
            },

            keyIsDown:function(key){
                if (_.isNumber(key)){
                    return this._pressedKeys[key];
                }else if (_.isString(key)){
                    if (INVERSE_EXT_MAPPING[key])
                    {
                        return _.some(INVERSE_EXT_MAPPING[key], function(keyName){
                            return !!this._pressedKeys[INVERSE_KEY_CODES[keyName]];
                        }, this);
                    }
                    return !!this._pressedKeys[INVERSE_KEY_CODES[key]];
                }
                return false;
            },

            keyIsUp:function(key){
                if (_.isNumber(key) || _.isString(key))
                {
                    return !this.keyIsDown(key);
                }
                return false;
            },


            /**
             * Return the key name associated with a key code. If keyCode is a string, sanitizes the keycode.
             * @param keyCode
             */
            keyName:function(keyCode)
            {
                // Start filling up KEY_CODES with pressed char codes.
                var ret = KEY_CODES[keyCode] || (ret = updateKeyCodes(keyCode));

                if (!EXT_MAPPING[ret]) {
                    return ret;
                }

                // If there is an extension mapping for this key, apply it.
                ret = EXT_MAPPING[ret];


                return ret;
            },

            _configure:function(){
                var docEl = ng.element(document);
                _.each(eventsList, function(eventName){
                    var boundEventCallback = _.bind(this[eventName], this);
                    docEl.on(eventName, boundEventCallback);
                }, this);
            },

            _permuteKeyPresses: _.memoize(function(list){
               var answer = [];

               var permute = function(list, n, i){

                   var j;

                   // We are at the end of the array, store the permutation.
                   if (i == n){
                       answer.push(list.join('+'));
                   }else{
                       for (j=i; j < n; j++)
                       {
                           // Swap i and j in the array
                           arraySwap(list, i, j);
                           permute(list, n, i+1);

                           // Swap i and j back to where they were
                           arraySwap(list, i, j);
                       }
                   }
               };


               permute(list, list.length, 0);

               return _.compact(answer);
            }, function(list){return list.join("+");}),

            handleKeyEvent:function(event){
                if (!KEY_CODES[event.keyCode])
                {
                    updateKeyCodes(event.keyCode);
                }

                // Check all the pressed keys to detect changes.
                var changes = _.compact(_.map(this._pressedKeys, function(value, key){
                    if (this._previousKeys[key] != this._pressedKeys[key])
                    {
                        return parseInt(key);
                    }
                }, this));

                // Calculate and fire an event for each keychange.
                _.each(changes, function(key){
                    this.fireEvents(key, event);
                }, this);

                // Store the changes in the previous keys
                _.each(changes, function(key){
                    this._previousKeys[key] = this._pressedKeys[key];
                }, this);
            },

            fireEvents:function(key, event)
            {
                var events = [];
                var eventType = '';
                if (!this._previousKeys[key] && this._pressedKeys[key]){
                    eventType = 'keydown';
                }
                else if (this._previousKeys[key] && !this._pressedKeys[key]){
                    eventType = 'keyup';
                }
                else if (!this._previousKeys[key] && this._pressedKeys[key]){
                    eventType = 'keypress';
                }

                var keyName = this.keyName(key);

                // Push some events to fire
                events.push(eventType);
                events.push(eventType+':'+keyName);

                // If this is a press, fire 'v', 'ctrl+v', ctrl+shift+v' style events
                if(eventType != 'keyup') {
                    events.push(keyName);

                    var SigKeysDown = [];
                    _.each(SIGNIFICANT_KEYS, function(sigKeyName){
                        if (this.keyIsDown(sigKeyName))
                        {
                            SigKeysDown.push(sigKeyName);
                        }
                    }, this);

                    // Get a permutation of all the ways the significant key presses have been
                    // eg. 'ctrl+alt' and 'alt+ctrl'
                    var permutations = this._permuteKeyPresses(SigKeysDown);

                    _.each(permutations, function(permutation){
                        events.push(permutation+'+'+keyName);
                    });
                }

                _.each(events,function(eventName){
                    this.$broadcast(eventName, event);
                }, this);
            },

            keydown:function(event){
                this._pressedKeys[event.keyCode] = true;
                this.handleKeyEvent(event);
            },
            keyup:function(event){
                this._pressedKeys[event.keyCode] = false;
                this.handleKeyEvent(event);
            },
            keypress:function(event){
                this._pressedKeys[event.keyCode] = true;
                this.handleKeyEvent(event);
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

        keystateListener.registerScope($rootScope);



        _.extend(factory, {
            keyIsDown:function(key){
                return keystateListener.keyIsDown(key);
            },
            keyIsUp:function(key){
                return keystateListener.keyIsUp(key);
            },
            keystateListener:keystateListener
        });

        return factory;
    }]);

});