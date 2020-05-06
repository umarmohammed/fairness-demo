import { Injectable } from '@angular/core';
import { MetricsService } from './metrics.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScatterService {
  private scatterXSubject = new BehaviorSubject<string>(null);
  private scatterYSubject = new BehaviorSubject<string>(null);

  scatterX$ = this.scatterXSubject.asObservable();
  scatterY$ = this.scatterYSubject.asObservable();

  private scatterMap = {
    x: this.scatterXSubject,
    y: this.scatterYSubject,
  };

  setScatter(axis: string, value: string) {
    this.scatterMap[axis].next(value);
  }
}
