import {Subject, scan, fromEvent, map, of, switchMap, switchAll, interval, tap, scheduled, asyncScheduler, observeOn } from 'rxjs';
import { log } from './utils/utils';
const mylog = log("rxjs");
const numbers$ = scheduled([1, 2, 3], asyncScheduler); // if not async, text won't show on broswer but console.
const switched = numbers$.pipe(switchMap(x => of(x, x ** 2, x ** 3)));
switched.subscribe(x => mylog(x.toString(10)));

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

numbers$
		.pipe(
				// Get the sum of the numbers coming in.
				scan((total, n) => total + n),
				// Get the average by dividing the sum by the total number
				// received so far (which is 1 more than the zero-based index).
				map((sum, index) => sum / (index + 1))
		)
		.subscribe(x => mylog(x.toString(10)));


const subject = new Subject<number>();

subject.subscribe({
		next: (v) => mylog(`observerA: ${v}`),
});
subject.subscribe({
		next: (v) => mylog(`observerB: ${v}`),
});
clicks
		.pipe(
				tap(() => subject.next(1)),
				tap(() => subject.next(2)),
		)
		.subscribe(_ => console.log("clicked"))
