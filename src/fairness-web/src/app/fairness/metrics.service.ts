import { Injectable } from '@angular/core';
import { FeaturesService } from '../core/features.service';
import { switchMap, shareReplay, pluck } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Metrics } from './metrics';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private url = 'http://localhost:5000/api/metrics';

  metrics$ = this.featuresService.featuresToUpload$.pipe(
    switchMap((model) => this.http.post<Metrics>(this.url, model)),
    shareReplay()
  );

  performanceMetrics$ = this.metrics$.pipe(pluck('performance'));

  constructor(
    private featuresService: FeaturesService,
    private http: HttpClient
  ) {}
}
