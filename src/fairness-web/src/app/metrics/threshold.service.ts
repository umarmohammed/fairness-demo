import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, pipe } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ThresholdService {
  private thresholdSubject = new BehaviorSubject<number>(0.5);
  threshold$ = this.thresholdSubject.pipe(debounceTime(50));

  private rangeSubject = new BehaviorSubject<[number, number]>(null);

  slider$ = combineLatest([this.threshold$, this.rangeSubject]).pipe(
    filter(([threshold, range]) => !!threshold && !!range),
    map(([threshold, range]) => ({ threshold, range }))
  );

  updateThreshold(value: number) {
    this.thresholdSubject.next(value);
  }

  setRange(range: [number, number]) {
    this.rangeSubject.next(range);
  }
}
