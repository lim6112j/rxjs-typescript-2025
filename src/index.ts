import {Observable, Subject, scan, fromEvent, map, of, switchMap, switchAll, interval, tap, scheduled, asyncScheduler, observeOn, AsyncSubject, animationFrameScheduler } from 'rxjs';
import { log } from './utils/utils';
const mylog = log("rxjs");
// observable
const observable = new Observable((subscriber) => {
  setTimeout(() => {
	  subscriber.next(1);
		subscriber.next(2);
		subscriber.next(3);
    subscriber.next(4);
    subscriber.complete();
  }, 1000);
});
mylog('just before subscribe');
observable.subscribe({
  next(x) {
    mylog('got value ' + x);
  },
  error(err) {
    mylog('something wrong occurred: ' + err);
  },
  complete() {
    mylog('done');
  },
});
mylog('just after subscribe');
// observer
const observer = {
		next: (x: any) => console.log('Observer got a next value: ' + x),
		error: (err:any) => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};
observable.subscribe(observer);
// simple callback automatically transformed observer object with next
observable.subscribe(x => mylog("simple function callback"));

// scheduler
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

// observeOn


const someDiv = document.createElement('div');
someDiv.style.cssText = 'width: 200px;background: #09c';
document.body.appendChild(someDiv);
const intervals = interval(100);      // Intervals are scheduled
                                     // with async scheduler by default...
intervals.pipe(
  observeOn(animationFrameScheduler) // ...but we will observe on animationFrame
)                                    // scheduler to ensure smooth animation.
.subscribe(val => {
  someDiv.style.height = val + 'px';
});
