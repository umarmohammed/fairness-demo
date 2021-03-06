import { Injectable } from '@angular/core';
import { FeaturesService } from '../core/features.service';
import {
  switchMap,
  map,
  tap,
  catchError,
  shareReplay,
  filter,
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  Metrics,
  fairnessMetricsForDisplay,
  PerformanceMetric,
  validMetric,
} from './metrics';
import { ThresholdService } from './threshold.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, of, Subject, combineLatest } from 'rxjs';
import { ScatterService } from './scatter.service';
import { PerformanceService } from './performance.service';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private url = `${environment.baseUrl}api/metrics`;

  private metricsLoadingSubject = new BehaviorSubject<boolean>(false);
  metricsLoading$ = this.metricsLoadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<boolean>(false);
  error$ = this.errorSubject.asObservable();

  metrics$ = this.featuresService.featuresToUpload$.pipe(
    tap(() => this.metricsLoadingSubject.next(true)),
    switchMap((model) =>
      this.http.post<Metrics[]>(this.url, model).pipe(
        map((metrics) =>
          metrics.filter(validMetric).map((metric) => ({
            ...metric,
            fairness: fairnessMetricsForDisplay(metric.fairness),
          }))
        ),
        tap((metrics) => {
          const thresholds = metrics.map((m) => m.threshold);
          const range: [number, number] = [
            Math.min(...thresholds),
            Math.max(...thresholds),
          ];
          this.thresholdService.setRange(range);
          this.errorSubject.next(false);
        }),
        catchError(() => {
          this.errorSubject.next(true);
          return of(null as Metrics[]);
        })
      )
    ),
    tap(() => this.metricsLoadingSubject.next(false)),
    shareReplay()
  );

  metricsForThreshold$ = this.metrics$.pipe(
    switchMap((metrics) =>
      this.thresholdService.threshold$.pipe(
        map(
          (threshold) =>
            metrics && metrics.find((metric) => metric.threshold === threshold)
        ),
        filter((metrics) => !!metrics)
      )
    ),
    shareReplay()
  );

  performanceMetrics$ = this.metricsForThreshold$.pipe(
    switchMap((metrics) =>
      this.performanceService.performanceType$.pipe(
        map((type) => ({
          values: performanceToChartSeries(metrics.performance, type),
          type,
        }))
      )
    )
  );

  fairnessMetrics$ = this.metricsForThreshold$.pipe(
    map((metrics) => metrics.fairness)
  );

  dfplot$ = this.metricsForThreshold$.pipe(map((metrics) => metrics.dfPlot));

  scatterMetrics$ = this.metrics$.pipe(
    switchMap((metrics: Metrics[]) =>
      combineLatest([
        this.scatterService.scatterX$,
        this.scatterService.scatterY$,
      ]).pipe(
        map(([x, y]) => ({
          xs: metrics && metrics[0].fairness.map((f) => f.name),
          ys: metrics && Object.keys(metrics[0].performance),
          x: x || 'DispImpact',
          y: y || 'Accuracy',
        })),
        map((foo) => ({
          ...foo,
          data: [
            {
              name: 'Fair',
              series:
                metrics &&
                this.metricsToSeries(metrics, foo.x, foo.y, true, 'Fair'),
            },
            {
              name: 'Unfair',
              series:
                metrics &&
                this.metricsToSeries(metrics, foo.x, foo.y, false, 'Unfair'),
            },
          ],
        }))
      )
    )
  );

  constructor(
    private featuresService: FeaturesService,
    private http: HttpClient,
    private thresholdService: ThresholdService,
    private scatterService: ScatterService,
    private performanceService: PerformanceService
  ) {}

  // TODO: tidy this up with array.reduce
  private metricsByFairness(
    metrics: Metrics[],
    fairnessMetric: string,
    fair: boolean
  ): Metrics[] {
    return metrics
      .slice(1, metrics.length - 1)
      .filter(
        (metric) =>
          metricIsFair(
            metric.fairness.find((f) => f.name === fairnessMetric)
          ) === fair
      );
  }

  private metricsToSeries(
    metrics: Metrics[],
    fairnessMetric: string,
    performanceMetric: string,
    fair: boolean,
    seriesName: string
  ) {
    return this.metricsByFairness(metrics, fairnessMetric, fair).map(
      (metric) => ({
        name: `threshold ${metric.threshold}`,
        x: metric.fairness.find((f) => f.name === fairnessMetric).value,
        y: metric.performance[performanceMetric].find((f) => f.name === 'all')
          .value,
        r: metric.threshold,
        seriesName,
      })
    );
  }
}

export function metricIsFair(metric: any) {
  return metric.thresholds.length === 1
    ? metric.value === metric.thresholds[0]
    : metric.value <= metric.thresholds[0] &&
        metric.value >= metric.thresholds[2];
}

export function performanceToChartSeries(
  performance: {
    [key: string]: PerformanceMetric[];
  },
  type: string
) {
  return type === 'multi'
    ? Object.keys(performance).map((k) => ({
        name: k,
        series: performance[k],
      }))
    : Object.keys(performance).map((k) => ({
        name: k,
        value: performance[k].find((m) => m.name === 'all').value,
      }));
}
