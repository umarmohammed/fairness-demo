import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelService } from './model.service';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FeaturesService {
  private url = 'http://localhost:5000/api/features';

  features$ = this.modelService.model$.pipe(
    switchMap((model) => this.http.post<string[]>(this.url, model))
  );

  constructor(private http: HttpClient, private modelService: ModelService) {}
}
