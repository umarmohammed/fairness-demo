import { Injectable } from '@angular/core';
import { FeaturesService } from '../core/features.service';
import { switchMap, map, tap, share, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Metrics, fairnessMetricsForDisplay } from './metrics';
import { ThresholdService } from './threshold.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, of, Subject } from 'rxjs';

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

  constructor(
    private featuresService: FeaturesService,
    private http: HttpClient,
    private thresholdService: ThresholdService
  ) {}
}
