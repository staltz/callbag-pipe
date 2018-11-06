/**
 * callbag-pipe
 * ------------
 *
 * Utility function for plugging callbags together in chain. This utility
 * actually doesn't rely on Callbag specifics, and is really similar to
 * Ramda's `pipe` or lodash's `flow`.
 * 
 * Implementation of `callbag-pipe` using `R.pipe` could look like this:
 *
 * const pipe = (source, ...cbs) => R.pipe(...cbs)(source)
 * 
 * This exists to play nicely with the ecosystem,
 * and to facilitate the import of the function.
 *
 * `npm install callbag-pipe`
 *
 * Example:
 *
 * Create a source with `pipe`, then pass it to a `forEach`:
 *
 *     const interval = require('callbag-interval');
 *     const forEach = require('callbag-for-each');
 *     const combine = require('callbag-combine');
 *     const pipe = require('callbag-pipe');
 *     const take = require('callbag-take');
 *     const map = require('callbag-map');
 *
 *     const source = pipe(
 *       combine(interval(100), interval(350)),
 *       map(([x, y]) => `X${x},Y${y}`),
 *       take(10)
 *     );
 *
 *     forEach(x => console.log(x))(source); // X2,Y0
 *                                           // X3,Y0
 *                                           // X4,Y0
 *                                           // X5,Y0
 *                                           // X6,Y0
 *                                           // X6,Y1
 *                                           // X7,Y1
 *                                           // X8,Y1
 *                                           // X9,Y1
 *                                           // X9,Y2
 *
 *
 * Or use `pipe` to go all the way from source to sink:
 *
 *     const interval = require('callbag-interval');
 *     const forEach = require('callbag-for-each');
 *     const combine = require('callbag-combine');
 *     const pipe = require('callbag-pipe');
 *     const take = require('callbag-take');
 *     const map = require('callbag-map');
 *
 *     pipe(
 *       combine(interval(100), interval(350)),
 *       map(([x, y]) => `X${x},Y${y}`),
 *       take(10),
 *       forEach(x => console.log(x))
 *     );
 *     // X2,Y0
 *     // X3,Y0
 *     // X4,Y0
 *     // X5,Y0
 *     // X6,Y0
 *     // X6,Y1
 *     // X7,Y1
 *     // X8,Y1
 *     // X9,Y1
 *     // X9,Y2
 *
 *
 * Nesting
 * -------
 *
 * To use pipe inside another pipe, you need to give the inner pipe an
 * argument, e.g. `s => pipe(s, ...`:
 *
 *     const interval = require('callbag-interval');
 *     const forEach = require('callbag-for-each');
 *     const combine = require('callbag-combine');
 *     const pipe = require('callbag-pipe');
 *     const take = require('callbag-take');
 *     const map = require('callbag-map');
 *
 *     pipe(
 *       combine(interval(100), interval(350)),
 *       s => pipe(s,
 *         map(([x, y]) => `X${x},Y${y}`),
 *         take(10)
 *       ),
 *       forEach(x => console.log(x))
 *     );
 *
 *
 * This means you can use pipe to create a new operator:
 *
 *     const mapThenTake = (f, amount) =>
 *       s => pipe(s, map(f), take(amount));
 *
 *     pipe(
 *       combine(interval(100), interval(350)),
 *       mapThenTake(([x, y]) => `X${x},Y${y}`, 10),
 *       forEach(x => console.log(x))
 *     );
 *
 */

function pipe(...cbs) {
  let res = cbs[0];
  for (let i = 1, n = cbs.length; i < n; i++) res = cbs[i](res);
  return res;
}

module.exports = pipe;
