import { Injectable } from '@angular/core';
import { Router, CanLoad, UrlSegment, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { ModelService } from './model.service';
import { map, tap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ModelLoadedGuard implements CanLoad {
  constructor(private modelService: ModelService, private router: Router) {}

  canLoad(_route: Route, _segments: UrlSegment[]): Observable<boolean> {
    return this.modelService.model$.pipe(
      tap((model) => {
        if (!model) {
          this.router.navigate(['/home']);
        }
      }),
      map((model) => !!model),
      take(1)
    );
  }
}
