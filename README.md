The narrow belt for AOP 🎀
----
This package provides narrow methods for aspect-oriented programming (AOP).

## Prerequisites
* Node.js `>= 14.x`

## Installation
```shell
npm install thaw --save
```

### Usage
```javascript
import * as thaw from 'thaw';

const around = thaw.around((val) => val + 1, (val) => val + val);
const after = thaw.after((val) => val + 1, (val) => val + val);
const before = thaw.before((val) => val + 1, (val) => val + val);
const compose = thaw.compose(around, after, before);

console.assert(around(1) === 6, 'around');
console.assert(after(1) === 4, 'after');
console.assert(before(1) === 3, 'before');
console.assert(compose(1) === 29, 'compose');

let bip = 0;
const debounce = thaw.debounce(() => bip++, 100);

setTimeout(debounce, 0);
setTimeout(debounce, 100);
setTimeout(debounce, 250); // will fire
setTimeout(debounce, 300);
setTimeout(debounce, 350); // will fire
setTimeout(debounce, 400);
setTimeout(() => console.assert(bip === 2, 'debounce'), 1000);

let pib = 0;
const throttle = thaw.throttle(() => pib++, 100);

setTimeout(throttle, 0); // will fire
setTimeout(throttle, 100);
setTimeout(throttle, 250); // will fire
setTimeout(throttle, 300);
setTimeout(throttle, 350); // will fire
setTimeout(throttle, 400);
setTimeout(() => console.assert(pib === 3, 'throttle'), 1000);
```
