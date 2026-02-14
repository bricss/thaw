export const after = (fn, advice) => {
  return function (...args) {
    try {
      return fn.apply(this, args);
    } finally {
      advice.apply(this, args);
    }
  };
};

export const afterReturning = (fn, advice) => {
  return function (...args) {
    return advice.call(this, fn.apply(this, args), ...args);
  };
};

export const afterThrowing = (fn, advice) => {
  return function (...args) {
    try {
      return fn.apply(this, args);
    } catch (err) {
      advice.call(this, err, ...args);
      throw err;
    }
  };
};

export const around = (fn, advice) => {
  return function (...args) {
    const proceed = () => fn.apply(this, args);

    return advice.call(this, proceed, ...args);
  };
};

export const before = (fn, advice) => {
  return function (...args) {
    advice.apply(this, args);

    return fn.apply(this, args);
  };
};

export const debounce = (fn, wait = 0) => {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
};

export const pipe = (...fns) => {
  if (fns.length === 0) {
    return (...args) => args.length <= 1 ? args.at(0) : args;
  }

  return function (...args) {
    return fns.reduce((acc, fn, idx) => idx ? fn.call(this, acc) : fn.apply(this, acc), args);
  };
};

export const throttle = (fn, wait = 0) => {
  let timer;

  return function (...args) {
    timer ||= (fn.apply(this, args), setTimeout(() => {
      timer = null;
    }, wait));
  };
};
