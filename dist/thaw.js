'use strict';

/*!
 * Thaw.js - The narrow belt for AOP.
 * Encoded by Yehor Sergeenko <yehor.sergeenko@gmail.com>
 * Version 1.1
 *
 * Distributed under the ISC license.
 * Examples and documentation at: https://github.com/bricss/thaw
 */
(function (root, factory) {
  if (root.define && root.define.constructor === Function && root.define.amd) {
    define(['exports'], factory);
  } else if (root.module && root.module.constructor === Object && root.module.exports) {
    factory(root.module.exports);
  } else {
    factory(root);
  }
})(self, function (exports) {
  exports.thaw = Object.defineProperties(Object.create(null), {
    around: {
      enumerable: true,
      value: function value(fn, callback) {
        /**
         * Run the function and pass arguments through callback before and after function invocation.
         * Example: function.around(callback) will run callback immediately around function() execution.
         */
        return function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return callback.call(fn, fn.call(fn, callback.apply(fn, args)));
        };
      }
    },
    after: {
      enumerable: true,
      value: function value(fn, callback) {
        /**
         * Run the function and pass arguments through callback after function invocation.
         * Example: function.after(callback) will run callback immediately after function() execution.
         */
        return function () {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return callback.call(fn, fn.apply(fn, args));
        };
      }
    },
    before: {
      enumerable: true,
      value: function value(fn, callback) {
        /**
         * Run the function and pass arguments through callback before function invocation.
         * Example: function.before(callback) will run callback immediately before function() execution.
         */
        return function () {
          for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return fn.call(fn, callback.apply(fn, args));
        };
      }
    },
    waterfall: {
      enumerable: true,
      value: function value(fn, callback) {
        for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
          args[_key4 - 2] = arguments[_key4];
        }

        /**
         * Run the function's waterfall and pass arguments through all callback's after major function invocation.
         * Example: function.waterfall(fn1, fn2, .., fnN) will run callback's immediately after function() execution.
         */
        var seq = [fn, callback].concat(args);
        return function () {
          for (var _len5 = arguments.length, tail = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            tail[_key5] = arguments[_key5];
          }

          args = null;
          for (var i = 0; i < seq.length; i++) {
            args = !args ? seq[i].apply(fn, tail) : seq[i].call(fn, args);
          }
          return args;
        };
      }
    },
    debounce: {
      enumerable: true,
      value: function value(fn, ms, tick) {
        /**
         * Instead of calling the function immediately, wait at least `delay` ms before calling it.
         * Example: function.debounce(100) will only call the function after pause of 100 ms.
         */
        return function () {
          for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            args[_key6] = arguments[_key6];
          }

          clearTimeout(tick);
          tick = setTimeout(function () {
            fn.apply(fn, args);
          }, ms || 0);
        };
      }
    },
    throttle: {
      enumerable: true,
      value: function value(fn, ms, tick) {
        /**
         * Run the function as soon as it's called, but prevent further calls during `delay` ms
         * Example: function.throttle(100) will only run function() once every 100 ms.
         */
        return function () {
          for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            args[_key7] = arguments[_key7];
          }

          tick = !tick && setTimeout(function () {
            tick = clearTimeout(tick);
            fn.apply(fn, args);
          }, ms || 0);
        };
      }
    }
  });
});