export const around = (fn, cb) => {
  return (...args) => {
    return cb(fn(cb(...args)));
  };
};

export const after = (fn, cb) => {
  return (...args) => {
    return cb(fn(...args));
  };
};

export const before = (fn, cb) => {
  return (...args) => {
    return fn(cb(...args));
  };
};

export const compose = (...fns) => {
  return (...args) => {
    let result = null;

    for (let i = 0; i < fns.length; i++) {
      result = fns[i](...(i ? [result] : args));
    }

    return result;
  };
};

export const debounce = (fn, wait = 0) => {
  let tick;

  return (...args) => {
    clearTimeout(tick);
    tick = setTimeout(() => {
      fn(...args);
    }, wait);
  };
};

export const throttle = (fn, wait = 0) => {
  let tick;

  return (...args) => {
    tick = !tick && setTimeout(() => {
      tick = clearTimeout(tick);
      fn(...args);
    }, wait);
  };
};
