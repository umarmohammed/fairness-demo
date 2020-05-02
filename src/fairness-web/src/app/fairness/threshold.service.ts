import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ThresholdService {
  private thresholdSubject = new BehaviorSubject<number>(0.5);
  threshold$ = this.thresholdSubject.asObservable().pipe(debounceTime(200));

  updateThreshold(value: number) {
    this.thresholdSubject.next(value);
  }
}
