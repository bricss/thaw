import assert from 'node:assert/strict';
import { mock } from 'node:test';
import {
  after,
  afterReturning,
  afterThrowing,
  around,
  before,
  debounce,
  pipe,
  throttle,
} from '../src/index.js';

describe('thaw', () => {

  describe('after', () => {

    it('should call advice after a function', () => {
      let called = false;
      const fn = after(
        (v) => v + 1,
        (v) => { called = v === 1; },
      );

      assert.equal(fn(1), 2);
      assert.equal(called, true);
    });

    it('should execute in correct order', () => {
      const calls = [];

      const fn = after(
        (v) => {
          calls.push('fn');

          return v + 1;
        },
        () => {
          calls.push('cb');
        },
      );

      fn(1);

      assert.deepEqual(calls, [
        'fn',
        'cb',
      ]);
    });

    it('should forward multiple arguments', () => {
      const args = [];
      const fn = after(
        (a, b) => a + b,
        (a, b) => args.push(a, b),
      );

      assert.equal(fn(2, 3), 5);
      assert.deepEqual(args, [
        2,
        3,
      ]);
    });

    it('should preserve this context', () => {
      const calls = [];
      const obj = {
        method: after(
          function (v) {
            calls.push(this.tag);

            return v + this.value;
          },
          function () { calls.push(this.tag); },
        ),
        tag: 'self',
        value: 2,
      };

      assert.equal(obj.method(1), 3);
      assert.deepEqual(calls, [
        'self',
        'self',
      ]);
    });

  });

  describe('afterReturning', () => {

    it('should pass result and arguments to advice', () => {
      const fn = afterReturning(
        (a, b) => a + b,
        (result, a, b) => `${ result }-${ a }-${ b }`,
      );

      assert.equal(fn(2, 3), '5-2-3');
    });

    it('should not call advice if function throws', () => {
      let called = false;

      const fn = afterReturning(
        () => { throw new Error('boom'); },
        () => { called = true; },
      );

      assert.throws(() => fn(), /boom/);
      assert.equal(called, false);
    });

    it('should preserve this context', () => {
      const obj = {
        method: afterReturning(
          function (v) { return v + this.value; },
          function (result) { return result * this.value; },
        ),
        value: 2,
      };

      assert.equal(obj.method(1), 6);
    });

  });

  describe('afterThrowing', () => {

    it('should call advice when function throws', () => {
      const errors = [];
      const fn = afterThrowing(
        () => { throw new Error('boom'); },
        (err) => errors.push(err.message),
      );

      assert.throws(() => fn(), /boom/);
      assert.deepEqual(errors, ['boom']);
    });

    it('should not call advice when no error', () => {
      let called = false;
      const fn = afterThrowing(
        (v) => v + 1,
        () => { called = true; },
      );

      assert.equal(fn(1), 2);
      assert.equal(called, false);
    });

    it('should rethrow error if advice throws', () => {
      const fn = afterThrowing(
        () => { throw new Error('boom'); },
        () => { throw new Error('kaboom'); },
      );

      assert.throws(() => fn(), /kaboom/);
    });

    it('should preserve this context', () => {
      let captured = null;
      const obj = {
        method: afterThrowing(
          function () { throw new Error(this.tag); },
          function (err) { captured = `${ this.tag }-${ err.message }`; },
        ),
        tag: 'self',
      };

      assert.throws(() => obj.method(), /self/);
      assert.equal(captured, 'self-self');
    });

  });

  describe('around', () => {

    it('should call advice around a function', () => {
      const fn = around(
        (v) => v + 1,
        (proceed, v) => proceed() + v,
      );

      assert.equal(fn(1), 3);
    });

    it('should allow to skip function callback in advice', () => {
      const fn = around(
        () => 10,
        () => 5,
      );

      assert.equal(fn(), 5);
    });

    it('should forward multiple arguments', () => {
      const fn = around(
        (a, b) => a + b,
        (proceed, a, b) => (proceed() * 2) + a + b,
      );

      assert.equal(fn(2, 3), 15);
    });

    it('should preserve execution order', () => {
      const calls = [];

      const fn = around(
        (v) => {
          calls.push('fn');

          return v + 1;
        },
        (proceed) => {
          calls.push('cb');

          const result = proceed();

          calls.push('cb');

          return result;
        },
      );

      fn(1);

      assert.deepEqual(calls, [
        'cb',
        'fn',
        'cb',
      ]);
    });

    it('should preserve this context', () => {
      const obj = {
        method: around(
          function (v) { return v + this.value; },
          function (proceed, v) { return proceed() * v * this.value; },
        ),
        value: 2,
      };

      assert.equal(obj.method(1), 6);
    });

  });

  describe('before', () => {

    it('should call advice before function', () => {
      let called = false;
      const fn = before(
        (v) => v + 1,
        (v) => { called = v === 1; },
      );

      assert.equal(fn(1), 2);
      assert.equal(called, true);
    });

    it('should execute in correct order', () => {
      const calls = [];

      const fn = before(
        (v) => {
          calls.push('fn');

          return v + 1;
        },
        () => {
          calls.push('cb');
        },
      );

      fn(1);

      assert.deepEqual(calls, [
        'cb',
        'fn',
      ]);
    });

    it('should preserve this context', () => {
      const obj = {
        method: before(
          function (v) { return v + this.value; },
          function () { this.value += 1; },
        ),
        value: 3,
      };

      assert.equal(obj.method(1), 5);
    });

  });

  describe('debounce', () => {

    beforeEach(() => {
      mock.timers.enable({ apis: ['setTimeout'] });
    });

    afterEach(() => {
      mock.timers.reset();
    });

    it('should call function only once after delay', () => {
      let count = 0;
      const fn = debounce(() => count++, 100);

      fn();
      fn();
      fn();
      mock.timers.tick(99);
      assert.equal(count, 0);
      mock.timers.tick(1);
      assert.equal(count, 1);
    });

    it('should pass latest arguments', () => {
      let result;
      const fn = debounce((v) => (result = v), 100);

      fn(1);
      fn(2);
      fn(3);
      mock.timers.tick(100);
      assert.equal(result, 3);
    });

    it('should preserve this context', () => {
      const obj = {
        method: debounce(function () {
          this.value += 'bar';
        }, 100),
        value: 'foo',
      };

      obj.method();
      mock.timers.tick(100);
      assert.equal(obj.value, 'foobar');
    });

    it('should reset timer on rapid calls', () => {
      let count = 0;
      const fn = debounce(() => count++, 100);

      fn();
      mock.timers.tick(50);
      fn();
      mock.timers.tick(50);
      assert.equal(count, 0);
      mock.timers.tick(50);
      assert.equal(count, 1);
    });

    it('should work with zero delay', () => {
      let count = 0;
      const fn = debounce(() => count++, 0);

      fn();
      mock.timers.tick(0);
      assert.equal(count, 1);
    });

  });

  describe('pipe', () => {

    it('should pipe left-to-right', () => {
      const fn = pipe(
        (v) => v + 2,
        (v) => v + 3,
        (v) => v + 4,
      );

      assert.equal(fn(1), 10);
    });

    it('should forward multiple arguments to first function', () => {
      const fn = pipe(
        (a, b) => a + b,
        (v) => v * 2,
      );

      assert.equal(fn(2, 3), 10);
    });

    it('should pass result of previous into next', () => {
      const calls = [];

      const fn = pipe(
        (v) => {
          calls.push('a');

          return `${ v }a`;
        },
        (v) => {
          calls.push('b');

          return `${ v }b`;
        },
        (v) => {
          calls.push('c');

          return `${ v }c`;
        },
      );

      const result = fn('');

      assert.equal(result, 'abc');
      assert.deepEqual(calls, [
        'a',
        'b',
        'c',
      ]);
    });

    it('should handle single function', () => {
      const fn = pipe((v) => v + 1);

      assert.equal(fn(5), 6);
    });

    it('should handle no functions', () => {
      const fn = pipe();

      assert.deepEqual(fn(5), 5);
      assert.deepEqual(fn(5, 5), [
        5,
        5,
      ]);
    });

    it('should preserve this context', () => {
      const obj = {
        method: pipe(
          function (v) { return v + this.value; },
          function (v) { return v * this.value; },
        ),
        value: 2,
      };

      assert.equal(obj.method(3), 10);
    });

  });

  describe('throttle', () => {

    beforeEach(() => {
      mock.timers.enable({ apis: ['setTimeout'] });
    });

    afterEach(() => {
      mock.timers.reset();
    });

    it('should execute immediately and throttle subsequent calls', () => {
      let count = 0;
      const fn = throttle(() => count++, 100);

      fn();
      fn();
      fn();
      assert.equal(count, 1);
      mock.timers.tick(100);
      fn();
      assert.equal(count, 2);
    });

    it('should execute immediately when wait is zero', () => {
      let count = 0;
      const fn = throttle(() => count++, 0);

      fn();
      mock.timers.tick(0);
      fn();
      assert.equal(count, 2);
    });

    it('should pass arguments correctly', () => {
      let result;
      const fn = throttle((v) => (result = v), 100);

      fn(1);
      fn(2);
      assert.equal(result, 1);
      mock.timers.tick(100);
      fn(3);
      assert.equal(result, 3);
    });

    it('should preserve this context', () => {
      const obj = {
        method: throttle(function () {
          this.value += 'bar';
        }, 100),
        value: 'foo',
      };

      obj.method();
      assert.equal(obj.value, 'foobar');
    });

  });

});
