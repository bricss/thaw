/*!
 * Aspect.js - The narrow belt for AOP.
 * Encoded by Yehor Sergeenko <yehor.sergeenko@gmail.com>
 * Version 1.0
 *
 * Distributed under the ISC license.
 * Examples and documentation at: https://github.com/bricss/aspect
 */
(function() {
  'use strict';
  /**
   * Run the function and pass arguments through callback before and after function invocation.
   * Example: function.around(callback) will run callback immediately around function() execution.
   */
  Function.prototype.around = function(callback) {
    var fn = this;
    return function() {
      return callback.call(this, fn.call(this, callback.apply(this, arguments)));
    };
  };

  /**
   * Run the function and pass arguments through callback after function invocation.
   * Example: function.after(callback) will run callback immediately after function() execution.
   */
  Function.prototype.after = function(callback) {
    var fn = this;
    return function() {
      return callback.call(this, fn.apply(this, arguments));
    };
  };

  /**
   * Run the function and pass arguments through callback before function invocation.
   * Example: function.before(callback) will run callback immediately before function() execution.
   */
  Function.prototype.before = function(callback) {
    var fn = this;
    return function() {
      return fn.call(this, callback.apply(this, arguments));
    };
  };

  /**
   * Run the function's cascade and pass arguments through all callback's after major function invocation.
   * Example: function.cascade(fn1, fn2, .., fnN) will run callback's immediately after function() execution.
   */
  Function.prototype.cascade = function() {
    var args, seq = [this].concat([].slice.call(arguments));
    return function() {
      for (var i = 0; i < seq.length; i++) {
        args = !args ? seq[i].apply(this, arguments) : seq[i].call(this, args);
      }
      return args;
    };
  };

  /**
   * Instead of calling the function immediately, wait at least `delay` ms before calling it.
   * Example: function.debounce(100) will only call the function after pause of 100 ms.
   */
  Function.prototype.debounce = function(threshold) {
    var fn = this, timeout;
    return function() {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(function() {
        fn.apply(this, arguments);
      }.bind(this), threshold || 0);
    };
  };

  /**
   * Run the function as soon as it's called, but prevent further calls during `delay` ms
   * Example: function.throttle(100) will only run function() once every 100 ms.
   */
  Function.prototype.throttle = function(threshold) {
    var fn = this, timeout;
    return function() {
      timeout = (!timeout) && window.setTimeout(function() {
        timeout = window.clearTimeout(timeout);
        fn.apply(this, arguments);
      }.bind(this), threshold || 0);
    };
  };
})();
