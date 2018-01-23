const test = require('tape');
const pipe = require('./index');

test('it calls first-order functions in sequence LTR', (t) => {
  t.plan(1);
  const res = pipe(
    2, // 2
    x => x * 10, // 20
    x => x - 3, // 17
    x => x + 5 // 22
  );
  t.equals(res, 22);
});

test('it calls higher-order callbacks in sequence LTR', (t) => {
  t.plan(2);
  const res = pipe(
    cb => cb(2), // 2
    prev => cb => prev(x => cb(x * 10)), // 20
    prev => cb => prev(x => cb(x - 3)), // 17
    prev => cb => prev(x => cb(x + 5)) // 22
  );
  t.equals(typeof res, 'function');
  res(x => {
    t.equals(x, 22);
    t.end();
  });
});
