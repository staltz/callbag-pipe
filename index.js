function pipe(...cbs) {
  let cb,
    res = false,
    i = 0,
    n = cbs.length;
  for (; i < n; i++) {
    cb = cbs[i];
    if (res) res = cb(res);
    else res = cb;
  }
  return res;
}

module.exports = pipe;
