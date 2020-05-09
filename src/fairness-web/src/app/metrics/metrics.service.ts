import { Injectable } from '@angular/core';
import { FeaturesService } from '../core/features.service';
import { switchMap, map, tap, catchError, shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  Metrics,
  fairnessMetricsForDisplay,
  PerformanceMetric,
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

  private errorSubject = new Subject<boolean>();
  error$ = this.errorSubject.asObservable();

  metrics$ = this.featuresService.featuresToUpload$.pipe(
    tap(() => this.metricsLoadingSubject.next(true)),
    switchMap((model) =>
      this.http.post<Metrics[]>(this.url, model).pipe(
        map((metrics) =>
          metrics.map((metric) => ({
            ...metric,
            fairness: fairnessMetricsForDisplay(metric.fairness),
          }))
        ),
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
        )
      )
    )
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

  scatterMetrics$ = this.metrics$.pipe(
    switchMap((metrics: Metrics[]) =>
      combineLatest([
        this.scatterService.scatterX$,
        this.scatterService.scatterY$,
      ]).pipe(
        map(([x, y]) => ({
          xs: metrics && metrics[0].fairness.map((f) => f.name),
          ys: metrics && Object.keys(metrics[0].performance),
          x: x || (metrics && metrics[0].fairness[0].name),
          y: y || (metrics && Object.keys(metrics[0].performance))[0],
        })),
        map((foo) => ({
          ...foo,
          data: [
            {
              name: 'Fair',
              series:
                metrics && this.metricsToSeries(metrics, foo.x, foo.y, true),
            },
            {
              name: 'Unfair',
              series:
                metrics && this.metricsToSeries(metrics, foo.x, foo.y, false),
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
      .slice(1)
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
    fair: boolean
  ) {
    return this.metricsByFairness(metrics, fairnessMetric, fair).map(
      (metric) => ({
        name: `threshold ${metric.threshold}`,
        x: metric.fairness.find((f) => f.name === fairnessMetric).value,
        y: metric.performance[performanceMetric].find((f) => f.name === 'all')
          .value,
        r: metric.threshold,
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
