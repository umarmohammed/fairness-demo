import { Injectable } from '@angular/core';
import { FixService } from '../core/fix.service';
import {
  switchMap,
  tap,
  shareReplay,
  withLatestFrom,
  map,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { FeaturesService } from '../core/features.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FairModelMetrics, fairnessMetricForDisplay } from './metrics';
import { performanceToChartSeries } from './metrics.service';
import { PerformanceService } from './performance.service';

@Injectable({ providedIn: 'root' })
export class FairModelService {
  private url = `${environment.baseUrl}api/fix`;

  fairModelMetrics$ = this.fixService.fixAction$.pipe(
    withLatestFrom(this.featureService.featuresToUpload$),
    switchMap(([action, features]) =>
      action === 'fix'
        ? this.http.post<FairModelMetrics>(this.url, features).pipe(
            map((metrics) => ({
              ...metrics,
              fairness: metrics.fairness.map(fairnessMetricForDisplay),
            }))
          )
        : of<FairModelMetrics>(null)
    ),
    shareReplay()
  );

  fairModelPerformance$ = this.fairModelMetrics$.pipe(
    switchMap((metrics) =>
      this.performanceService.performanceType$.pipe(
        map((type) => ({
          values:
            metrics && performanceToChartSeries(metrics.performance, type),
          type,
        }))
      )
    )
  );

  fairModelFairness$ = this.fairModelMetrics$.pipe(
    map((fairModel) => fairModel && fairModel.fairness),
    tap(console.log)
  );

  constructor(
    private fixService: FixService,
    private featureService: FeaturesService,
    private http: HttpClient,
    private performanceService: PerformanceService
  ) {}
}
