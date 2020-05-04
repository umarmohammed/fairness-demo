import { Injectable } from '@angular/core';
import { FeaturesService } from '../core/features.service';
import { switchMap, pluck, map, tap, share } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Metrics } from './metrics';
import { ThresholdService } from './threshold.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private url = `${environment.baseUrl}api/metrics`;

  private metricsLoadingSubject = new BehaviorSubject<boolean>(false);
  metricsLoading$ = this.metricsLoadingSubject.asObservable();

  metrics$ = this.featuresService.featuresToUpload$.pipe(
    switchMap((model) => this.http.post<Metrics[]>(this.url, model)),
    tap(() => this.metricsLoadingSubject.next(false)),
    share()
  );

  metricsForThreshold$ = this.metrics$.pipe(
    switchMap((metrics) =>
      this.thresholdService.threshold$.pipe(
        map((threshold) =>
          metrics.find((metric) => metric.threshold === threshold)
        )
      )
    )
  );

  performanceMetrics$ = this.metricsForThreshold$.pipe(pluck('performance'));

  fairnessMetrics$ = this.metricsForThreshold$.pipe(pluck('fairness'));

  constructor(
    private featuresService: FeaturesService,
    private http: HttpClient,
    private thresholdService: ThresholdService
  ) {}

  metricsPageEntered() {
    this.metricsLoadingSubject.next(true);
  }
}
