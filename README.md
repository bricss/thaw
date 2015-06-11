Aspect.js
=======

The narrow belt for AOP.

Usage:
~~~ javascript
var around = function(val) {
    return val + 1;
  }.around(function(val) {
    return val + val;
  });

var after = function(val) {
    return val + 1;
  }.after(function(val) {
    return val + val;
  });

var before = function(val) {
    return val + 1;
  }.before(function(val) {
    return val + val;
  });

var waterfall = around.waterfall(around, after, before);

console.assert.before(function() {
  return around(1) === 6;
}).call(console, console.log('`Around`'));

console.assert.before(function() {
  return after(1) === 4;
}).call(console, console.log('`After`'));

console.assert.before(function() {
  return before(1) === 3;
}).call(console, console.log('`Before`'));

console.assert.before(function() {
  return waterfall(1) === 109;
}).call(console, console.log('`Cascade`'));

var pib = 0;
var torque = function() {
  pib++;
}.throttle(100);
setTimeout(torque, 0);
// will fire ^
setTimeout(torque, 100);
setTimeout(torque, 250);
// will fire ^
setTimeout(torque, 300);
setTimeout(torque, 350);
// will fire ^
setTimeout(torque, 400);
setTimeout(function() {
  console.assert.before(function() {
    return pib === 3;
  }).call(console, console.log('`Throttle`'));
}, 1000);

var bip = 0;
var bounce = function() {
  bip++;
}.debounce(100);
setTimeout(bounce, 0);
setTimeout(bounce, 100);
setTimeout(bounce, 250);
// will fire ^
setTimeout(bounce, 300);
setTimeout(bounce, 350);
// will fire ^
setTimeout(bounce, 400);
setTimeout(function() {
  console.assert.before(function() {
    return bip === 2;
  }).call(console, console.log('`Debounce`'));
}, 1000);
~~~
