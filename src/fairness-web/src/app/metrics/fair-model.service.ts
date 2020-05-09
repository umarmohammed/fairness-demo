import { Injectable } from '@angular/core';
import { MetricsService } from './metrics.service';
import { FixService } from '../core/fix.service';
import { switchMap, delay, tap, shareReplay } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FairModelService {
  fairModel$ = this.fixService.fixAction$.pipe(
    switchMap((action) => (action === 'fix' ? of(true) : of(false))),
    delay(1000),
    shareReplay(),
    tap(console.log)
  );

  constructor(private fixService: FixService) {}
}
