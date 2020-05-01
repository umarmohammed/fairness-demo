import { Injectable } from '@angular/core';
import { FeaturesService } from '../core/features.service';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private url = 'http://localhost:5000/api/metrics';

  metrics$ = this.featuresService.featuresToUpload$.pipe(
    switchMap((model) => this.http.post(this.url, model))
  );

  constructor(
    private featuresService: FeaturesService,
    private http: HttpClient
  ) {}
}
