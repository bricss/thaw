/*!
 * Thaw.js - The narrow belt for AOP.
 * Encoded by Yehor Sergeenko <yehor.sergeenko@gmail.com>
 * Version 1.1
 *
 * Distributed under the ISC license.
 * Examples and documentation at: https://github.com/bricss/thaw
 */
((root, factory) => {
  if (root.define && root.define.constructor === Function && root.define.amd) {
    define(['exports'], factory);
  } else if (root.module && root.module.constructor === Object && root.module.exports) {
    factory(root.module.exports);
  } else {
    factory(root);
  }
})(self, (exports) => {
  exports.thaw = Object.defineProperties(Object.create(null), {
    around: {
      enumerable: true,
      value: (fn, callback) => {
        /**
         * Run the function and pass arguments through callback before and after function invocation.
         * Example: function.around(callback) will run callback immediately around function() execution.
         */
        return (...args) => {
          return callback.call(fn, fn.call(fn, callback.apply(fn, args)));
        };
      }
    },
    after: {
      enumerable: true,
      value: (fn, callback) => {
        /**
         * Run the function and pass arguments through callback after function invocation.
         * Example: function.after(callback) will run callback immediately after function() execution.
         */
        return (...args) => {
          return callback.call(fn, fn.apply(fn, args));
        };
      }
    },
    before: {
      enumerable: true,
      value: (fn, callback) => {
        /**
         * Run the function and pass arguments through callback before function invocation.
         * Example: function.before(callback) will run callback immediately before function() execution.
         */
        return (...args) => {
          return fn.call(fn, callback.apply(fn, args));
        };
      }
    },
    compose: {
      enumerable: true,
      value: (fn, callback, ...args) => {
        /**
         * Run the function's compose and pass arguments through all callback's after major function invocation.
         * Example: function.compose(fn1, fn2, .., fnN) will run callback's immediately after function() execution.
         */
        const seq = [fn, callback].concat(args);
        return (...tail) => {
          args = null;
          for (let i = 0; i < seq.length; i++) {
            args = args ? seq[i].call(fn, args) : seq[i].apply(fn, tail);
          }
          return args;
        };
      }
    },
    debounce: {
      enumerable: true,
      value: (fn, ms, tick) => {
        /**
         * Instead of calling the function immediately, wait at least `delay` ms before calling it.
         * Example: function.debounce(100) will only call the function after pause of 100 ms.
         */
        return (...args) => {
          clearTimeout(tick);
          tick = setTimeout(() => {
            fn.apply(fn, args);
          }, ms || 0);
        };
      }
    },
    throttle: {
      enumerable: true,
      value: (fn, ms, tick) => {
        /**
         * Run the function as soon as it's called, but prevent further calls during `delay` ms
         * Example: function.throttle(100) will only run function() once every 100 ms.
         */
        return (...args) => {
          tick = !tick && setTimeout(() => {
              tick = clearTimeout(tick);
              fn.apply(fn, args);
            }, ms || 0);
        };
      }
    }
  });
});
