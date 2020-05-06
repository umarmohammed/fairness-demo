import { Injectable } from '@angular/core';
import { FeaturesService } from '../core/features.service';
import { switchMap, map, tap, share, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Metrics, fairnessMetricsForDisplay } from './metrics';
import { ThresholdService } from './threshold.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, of, Subject, combineLatest } from 'rxjs';
import { ScatterService } from './scatter.service';

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
    share()
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
    map((metrics) => metrics.performance)
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
          xs: metrics && metrics[0].fairness,
          ys: metrics && metrics[0].performance,
          x: x || (metrics && metrics[0].fairness[0].name),
          y: y || (metrics && metrics[0].performance[0].name),
          data: [
            {
              name: 'results',
              series:
                metrics &&
                metrics.slice(1).map((metric) => ({
                  name: `threshold ${metric.threshold}`,
                  x: metric.fairness.find(
                    (f) =>
                      f.name === (x || (metrics && metrics[0].fairness[0].name))
                  ).value,
                  y: metric.performance.find(
                    (f) =>
                      f.name ===
                      (y || (metrics && metrics[0].performance[0].name))
                  ).value,
                  r: 0.5,
                })),
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
    private scatterService: ScatterService
  ) {}

  metricsPageEntered() {
    this.metricsLoadingSubject.next(true);
  }
}
