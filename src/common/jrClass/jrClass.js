/* Simple JavaScript Inheritance
* By John Resig http://ejohn.org/
* MIT Licensed.
*/
// Inspired by base2 and Prototype
define(['lodash'], function (_){
    /* Simple JavaScript Inheritance for ES 5.1 ( includes polyfill for IE < 9 )
     * based on http://ejohn.org/blog/simple-javascript-inheritance/
     *  (inspired by base2 and Prototype)
     * MIT Licensed.
     */
        "use strict";

        if (!Object.create) {
            Object.create = (function () {
                function F() {
                }

                return function (o) {
                    if (arguments.length != 1) {
                        throw new Error("Object.create implementation only accepts one parameter.");
                    }
                    F.prototype = o;
                    return new F();
                };
            })();
        }

        var fnTest = /var xyz/.test(function () {
            var xyz;
        }) ? /\b_super\b/ : /.*/;

        // The base Class implementation (does nothing)
        function BaseClass() {
        }

        // Create a new Class that inherits from this class
        BaseClass.extend = function (props) {

            var _super = Object.create(this.prototype);

            // Instantiate a base class (but only create the instance,
            // don't run the init constructor)
            var proto = Object.create(_super);

            // Copy the properties over onto the new prototype
            _.each(props, function(prop, name){
                // Check if we're overwriting an existing function

                if (_.isFunction(props[name]) &&
                    _.isFunction(_super[name]) &&
                    fnTest.test(props[name])) {

                    proto[name] = (function (name, fn) {
                                return function () {
                                    var tmp = this._super;

                                    // Add a new ._super() method that is the same method
                                    // but on the super-class
                                    this._super = _super[name];

                                    // The method only need to be bound temporarily, so we
                                    // remove it when we're done executing
                                    var ret = fn.apply(this, arguments);
                                    this._super = tmp;

                                    return ret;
                                };
                            })(name, props[name]);
                        }else{
                    proto[name] = props[name];
                }

            });

            // The new constructor
            var newClass;
            if (_.isFunction(proto.init ))
            {
                // To completely break ties with the old prototype, we need to make a new function that calls
                // the underlying one.
                newClass = function(){
                    var args = Array.prototype.splice.call(arguments, 0);
                    proto.init.apply(this, args);
                };
            }
            else
            {
                newClass = function () {};
            }

            // Populate our constructed prototype object
            newClass.prototype = proto;

            // Enforce the constructor to be what we expect
            proto.constructor = newClass;

            // And make this class extendable
            newClass.extend = BaseClass.extend;

            return newClass;
        };

    return BaseClass;
});
