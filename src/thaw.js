/*!
 * Thaw.js - The narrow belt for AOP.
 * Encoded by Yehor Sergeenko <yehor.sergeenko@gmail.com>
 * Version 1.0
 *
 * Distributed under the ISC license.
 * Examples and documentation at: https://github.com/bricss/thaw
 */
(function(root, factory) {
  'use strict';
  if ( typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if ( typeof module === 'object' && typeof module.exports === 'object') {
    factory(module.exports);
  } else {
    factory(root);
  }
})(this, function(exports) {
  'use strict';
  var thaw = Object.defineProperties(Object.create(null), {
    around : {
      enumerable : true,
      value : function(fn, callback) {
        /**
         * Run the function and pass arguments through callback before and after function invocation.
         * Example: function.around(callback) will run callback immediately around function() execution.
         */
        return function() {
          return callback.call(fn, fn.call(fn, callback.apply(fn, arguments)));
        };
      }
    },
    after : {
      enumerable : true,
      value : function(fn, callback) {
        /**
         * Run the function and pass arguments through callback after function invocation.
         * Example: function.after(callback) will run callback immediately after function() execution.
         */
        return function() {
          return callback.call(fn, fn.apply(fn, arguments));
        };
      }
    },
    before : {
      enumerable : true,
      value : function(fn, callback) {
        /**
         * Run the function and pass arguments through callback before function invocation.
         * Example: function.before(callback) will run callback immediately before function() execution.
         */
        return function() {
          return fn.call(fn, callback.apply(fn, arguments));
        };
      }
    },
    waterfall : {
      enumerable : true,
      value : function(fn, callback) {
        /**
         * Run the function's waterfall and pass arguments through all callback's after major function invocation.
         * Example: function.waterfall(fn1, fn2, .., fnN) will run callback's immediately after function() execution.
         */
        var args;
        var seq = [fn].concat([].slice.call(arguments));
        return function() {
          for (var i = 0; i < seq.length; i++) {
            args = !args ? seq[i].apply(fn, arguments) : seq[i].call(fn, args);
          }
          return args;
        };
      }
    },
    debounce : {
      enumerable : true,
      value : function(fn, ms, tick) {
        /**
         * Instead of calling the function immediately, wait at least `delay` ms before calling it.
         * Example: function.debounce(100) will only call the function after pause of 100 ms.
         */
        return function() {
          window.clearTimeout(tick);
          tick = window.setTimeout(function() {
            fn.apply(fn, arguments);
          }, ms || 0);
        };
      }
    },
    throttle : {
      enumerable : true,
      value : function(fn, ms, tick) {
        /**
         * Run the function as soon as it's called, but prevent further calls during `delay` ms
         * Example: function.throttle(100) will only run function() once every 100 ms.
         */
        return function() {
          tick = !tick && window.setTimeout(function() {
            tick = window.clearTimeout(tick);
            fn.apply(fn, arguments);
          }, ms || 0);
        };
      }
    }
  });
  exports.thaw = thaw;
});
