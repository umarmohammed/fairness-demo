import { Injectable } from '@angular/core';
import { FixService } from '../core/fix.service';
import { switchMap, tap, shareReplay, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { FeaturesService } from '../core/features.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FairModelService {
  private url = `${environment.baseUrl}api/fix`;

  fairModel$ = this.fixService.fixAction$.pipe(
    withLatestFrom(this.featureService.featuresToUpload$),
    switchMap(([action, features]) =>
      action === 'fix' ? this.http.post<string>(this.url, features) : of(false)
    ),
    shareReplay(),
    tap(console.log)
  );

  constructor(
    private fixService: FixService,
    private featureService: FeaturesService,
    private http: HttpClient
  ) {}
}
