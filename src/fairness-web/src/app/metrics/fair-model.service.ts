import { Injectable } from '@angular/core';
import { FixService } from '../core/fix.service';
import {
  switchMap,
  tap,
  shareReplay,
  withLatestFrom,
  map,
} from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { FeaturesService } from '../core/features.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FairModelMetrics, fairnessMetricForDisplay, Metrics } from './metrics';
import { performanceToChartSeries, MetricsService } from './metrics.service';
import { PerformanceService } from './performance.service';

@Injectable({ providedIn: 'root' })
export class FairModelService {
  private url = `${environment.baseUrl}api/fix`;

  fairModelMetrics$ = this.fixService.fixAction$.pipe(
    withLatestFrom(this.featureService.featuresToUpload$),
    tap(([action]) => (action === 'fix' ? this.fixService.fixing() : 0)),
    switchMap(([action, features]) =>
      action === 'fix'
        ? this.http.post<FairModelMetrics>(this.url, features).pipe(
            map((metrics) => ({
              ...metrics,
              fairness: metrics.fairness.map(fairnessMetricForDisplay),
            })),
            tap(() => this.fixService.fixed())
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

  fairModelComparePerformance$ = combineLatest([
    this.fairModelPerformance$,
    this.metricService.metricsForThreshold$,
  ]).pipe(
    map(([fairPerformance, origMetrics]: [any, Metrics]) =>
      fairPerformance.values.map((f: { name: string; value: number }) => ({
        name: f.name,
        series: [
          {
            name: 'orig',
            value: origMetrics.performance[f.name].find((m) => m.name === 'all')
              .value,
          },
          { name: 'fair', value: f.value },
        ],
      }))
    )
  );

  fairModelFairness$ = this.fairModelMetrics$.pipe(
    map((fairModel) => fairModel && fairModel.fairness)
  );

  fairDfplot$ = this.fairModelMetrics$.pipe(
    map((metrics) => metrics && metrics.dfPlot)
  );

  constructor(
    private fixService: FixService,
    private featureService: FeaturesService,
    private http: HttpClient,
    private performanceService: PerformanceService,
    private metricService: MetricsService
  ) {}
}
