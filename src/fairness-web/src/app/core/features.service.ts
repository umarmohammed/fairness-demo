import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelService } from './model.service';
import { switchMap, shareReplay, map, filter } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { SelectedFeature } from '../fairness/selected-feature';

@Injectable({ providedIn: 'root' })
export class FeaturesService {
  private url = 'http://localhost:5000/api/features';

  features$ = this.modelService.model$.pipe(
    switchMap((model) => this.http.post<string[]>(this.url, model)),
    shareReplay()
  );

  private gminSubject = new BehaviorSubject<string>(null);
  private gmaxSubject = new BehaviorSubject<string>(null);

  private featureTypeMap = {
    gmin: this.gminSubject,
    gmax: this.gmaxSubject,
  };

  selectedFeatures$ = combineLatest([this.gminSubject, this.gmaxSubject]).pipe(
    filter(([gmin, gmax]) => !!gmin && !!gmax),
    map(([gmin, gmax]): SelectedFeature => ({ gmin, gmax }))
  );

  constructor(private http: HttpClient, private modelService: ModelService) {}

  updateSelectedFeature(feature: { type: string; value: string }) {
    this.featureTypeMap[feature.type].next(feature.value);
  }
}
