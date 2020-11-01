import assert from 'assert';
import {
  after,
  around,
  before,
  compose,
  debounce,
  throttle,
} from '../src/index.mjs';

describe('thaw', () => {

  describe('around', () => {
    it('should call callback around a function', () => {
      const fnc = around((val) => val + 1, (val) => val + val);

      assert.strictEqual(fnc(1), 6);
    });
  });

  describe('after', () => {
    it('should call callback after a function', () => {
      const fnc = after((val) => val + 1, (val) => val + val);

      assert.strictEqual(fnc(1), 4);
    });
  });

  describe('before', () => {
    it('should call callback before a function', () => {
      const fnc = before((val) => val + 1, (val) => val + val);

      assert.strictEqual(fnc(1), 3);
    });
  });

  describe('compose', () => {
    it('should call functions in left-to-right (pipe) composition', () => {
      const fnc = compose((val) => val + 2, (val) => val + 3, (val) => val + 4);

      assert.strictEqual(fnc(1), 10);
    });
  });

  describe('debounce', () => {
    it('should debounce a function', (done) => {
      let bip = 0;
      const fnc = debounce(() => bip++, 100);

      setTimeout(fnc, 0);
      setTimeout(fnc, 100);
      setTimeout(fnc, 250); // will fire
      setTimeout(fnc, 300);
      setTimeout(fnc, 350); // will fire
      setTimeout(fnc, 400);
      setTimeout(() => (assert.strictEqual(bip, 2), done()), 1000);
    });
  });

  describe('throttle', () => {
    it('should throttle a function', (done) => {
      let pib = 0;
      const fnc = throttle(() => pib++, 100);

      setTimeout(fnc, 0); // will fire
      setTimeout(fnc, 100);
      setTimeout(fnc, 250); // will fire
      setTimeout(fnc, 300);
      setTimeout(fnc, 350); // will fire
      setTimeout(fnc, 400);
      setTimeout(() => (assert.strictEqual(pib, 3), done()), 1000);
    });
  });

});
