import {scan, fromEvent, map, of, switchMap, switchAll, interval, tap } from 'rxjs';
import { log } from './utils/utils';
const switched = of(1, 2, 3).pipe(switchMap(x => of(x, x ** 2, x ** 3)));
switched.subscribe(x => log(x.toString(10)));
const mylog = log("rxjs => ");
// switchmap
//const clicks = fromEvent(document, 'click');
//const result = clicks.pipe(switchMap(() => interval(1000)));
//result.subscribe(x => mylog(x));

// switchAll
const clicks = fromEvent(document, 'click').pipe(tap(() => mylog("click!")));
const source = clicks.pipe(map(() => interval(1000)));
source
		.pipe(switchAll())
		.subscribe(x => mylog(x.toString(10)))

// scan
const numbers$ = of(1, 2, 3);

numbers$
  .pipe(
    // Get the sum of the numbers coming in.
    scan((total, n) => total + n),
    // Get the average by dividing the sum by the total number
    // received so far (which is 1 more than the zero-based index).
    map((sum, index) => sum / (index + 1))
  )
		.subscribe(x => mylog(x.toString(10)));
