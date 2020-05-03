import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  debounceTime,
  takeUntil,
  repeat,
  switchMap,
  endWith,
} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ThresholdService {
  private thresholdSubject = new BehaviorSubject<number>(0.5);
  threshold$ = this.thresholdSubject.asObservable().pipe(debounceTime(100));

  mousedownSubject = new Subject<boolean>();
  mouseupSubject = new Subject<boolean>();
  mousemoveSubject = new Subject<boolean>();

  thresholding$ = this.mousedownSubject.pipe(
    switchMap(() => this.mousemoveSubject),
    takeUntil(this.mouseupSubject),
    endWith(false),
    repeat()
  );

  updateThreshold(value: number) {
    this.thresholdSubject.next(value);
  }

  thresholdMousedown() {
    this.mousedownSubject.next(true);
  }

  windowMouseup() {
    this.mouseupSubject.next(true);
  }

  windowMousemove() {
    this.mousemoveSubject.next(true);
  }
}
