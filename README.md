Aspect.js
=======

The narrow belt for AOP.

Usage:
~~~ javascript
var result = (function(val) {
    return val + 1;
  }.around(function(val) {
    return val + val;
  }))(1);
console.log('`Around` Test:', (result === 6 ? '[PASSED]' : '[FAILED]'), result);

var result = (function(val) {
    return val + 1;
  }.after(function(val) {
    return val + val;
  }))(1);
console.log('`After` Test:', (result === 4 ? '[PASSED]' : '[FAILED]'), result);

var result = (function(val) {
    return val + 1;
  }.before(function(val) {
    return val + val;
  }))(1);
console.log('`Before` Test:', (result === 3 ? '[PASSED]' : '[FAILED]'), result);

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
  console.log('`Throttle` Test:', (pib === 3 ? '[PASSED]' : '[FAILED]'), pib);
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
  console.log('`Debounce` Test:', (bip === 2 ? '[PASSED]' : '[FAILED]'), bip);
}, 1000);
~~~
