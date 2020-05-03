import { Injectable } from '@angular/core';
import { FeaturesService } from '../core/features.service';
import {
  switchMap,
  shareReplay,
  pluck,
  map,
  publishReplay,
  refCount,
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Metrics } from './metrics';
import { ThresholdService } from './threshold.service';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private url = `${environment.baseUrl}api/metrics`;

  metrics$ = this.featuresService.featuresToUpload$.pipe(
    switchMap((model) => this.http.post<Metrics[]>(this.url, model)),
    publishReplay(1),
    refCount()
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
}
