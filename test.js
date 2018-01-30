const test = require('tape');
const fromIter = require('callbag-from-iter');
const map = require('callbag-map');
const filter = require('callbag-filter');
const iterate = require('callbag-iterate');
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

test('it calls first-order functions in a nested pipe', (t) => {
  t.plan(1);
  const res = pipe(
    2, // 2
    s => pipe(s,
      x => x * 10, // 20
      x => x - 3 // 17
    ),
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

test('it can be nested', (t) => {
  t.plan(2);
  const res = pipe(
    cb => cb(2), // 2
    s => pipe(s,
      prev => cb => prev(x => cb(x * 10)), // 20
      prev => cb => prev(x => cb(x - 3)) // 17
    ),
    prev => cb => prev(x => cb(x + 5)) // 22
  );
  t.equals(typeof res, 'function');
  res(x => {
    t.equals(x, 22);
    t.end();
  });
});

test('it works with common callbag utilities', (t) => {
  t.plan(2);
  const expected = [1, 3];
  pipe(
    fromIter([10, 20, 30, 40]),
    map(x => x / 10),
    filter(x => x % 2),
    iterate(x => {
      t.equals(x, expected.shift());
      if (expected.length === 0) {
        t.end();
      }
    })
  );
});

test('it can be nested with callbag utilities', (t) => {
  t.plan(2);
  const expected = [1, 3];
  pipe(
    fromIter([10, 20, 30, 40]),
    s => pipe(s,
      map(x => x / 10),
      filter(x => x % 2)
    ),
    iterate(x => {
      t.equals(x, expected.shift());
      if (expected.length === 0) {
        t.end();
      }
    })
  );
});
