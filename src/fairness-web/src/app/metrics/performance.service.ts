import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PerformanceService {
  private performanceTypeSubject = new BehaviorSubject<string>('single');
  performanceType$ = this.performanceTypeSubject.asObservable();

  setPerformanceType(value: string) {
    this.performanceTypeSubject.next(value);
  }
}
