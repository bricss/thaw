Thaw.js
=======

The narrow belt for AOP.

Usage:
~~~ javascript
var around = thaw.around(function(val) {
    return val + 1;
  }, function(val) {
    return val + val;
  });

var after = thaw.after(function(val) {
    return val + 1;
  }, function(val) {
    return val + val;
  });

var before = thaw.before(function(val) {
    return val + 1;
  }, function(val) {
    return val + val;
  });

var waterfall = thaw.waterfall(around, after, before);

console.assert(around(1) === 6, 'around');
console.assert(after(1) === 4, 'after');
console.assert(before(1) === 3, 'before');
console.assert(waterfall(1) === 109, 'waterwall');

var pib = 0;
var torque = thaw.throttle(function() {
  pib++;
}, 100);
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
  console.assert(pib === 3, 'throttle');
}, 1000);

var bip = 0;
var bounce = thaw.debounce(function() {
  bip++;
}, 100);
setTimeout(bounce, 0);
setTimeout(bounce, 100);
setTimeout(bounce, 250);
// will fire ^
setTimeout(bounce, 300);
setTimeout(bounce, 350);
// will fire ^
setTimeout(bounce, 400);
setTimeout(function() {
  console.assert(bip === 2, 'debounce');
}, 1000);
~~~
