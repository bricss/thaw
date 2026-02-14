The narrow belt for AOP 🎀
---
This package provides **narrow-trench** methods for aspect-oriented programming (AOP).

## Abstract

* Consistent advice pattern semantics 📐
* Deterministic behavior (tested with mocked timers) ⚖️
* Preserves `this` context 🔒
* Small, predictable behavior 🎯
* Zero dependencies 🗽

## Prerequisites

* Node.js `>= 20.0.0`

## Installation

```bash
npm install thaw --save
```

### Usage

```javascript
import {
  after,
  afterReturning,
  afterThrowing,
  around,
  before,
  debounce,
  pipe,
  throttle,
} from 'thaw';

{
  const fn = after(
    (v) => v + 1,
    (...args) => console.log('after fn args', args), // [ 1 ]
  );

  console.log('after', fn(1)); // 2
}

{
  const fn = afterReturning(
    (a, b) => a + b,
    (result, ...args) => `${ result }-${ args }`,
  );

  console.log('afterReturning', fn(2, 3)); // 5-2,3
}

{
  const fn = afterThrowing(
    () => { throw new Error('boom'); },
    (err, ...args) => {
      console.error('afterThrowing', `${ err.message }-${ args }`); // Boom-2,3
    },
  );

  try {
    fn(2, 3);
  } catch (err) {
    console.error('afterThrowing', err.message); // Boom
  }
}

{
  const fn = around(
    (v) => v + 1,
    (proceed, ...args) => proceed() + args.at(0),
  );

  console.log('around', fn(1)); // 3
}

{
  const fn = before(
    (v) => v + 1,
    (...args) => console.log('before fn args', args), // [ 1 ]
  );

  console.log('before', fn(1)); // 2
}

{
  const fn = debounce((v) => {
    console.log('debounce', v); // 3; after -> 200ms
  }, 200);

  fn(1);
  fn(2);
  fn(3);
}

{
  const fn = pipe(
    (v) => v + 2,
    (v) => v + 3,
    (v) => v + 4,
  );

  console.log('pipe', fn(1)); // 10
}

{
  const fn = throttle((v) => {
    console.log('throttle', v); // 1; idle -> 200ms
  }, 200);

  fn(1);
  fn(2);
  fn(3);
}
```

---

For more details, please check tests in the repository.
