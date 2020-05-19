import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelService } from './model.service';
import {
  switchMap,
  shareReplay,
  map,
  filter,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { SelectedFeature } from '../metrics/selected-feature';
import { environment } from 'src/environments/environment';
import { FixService } from './fix.service';
import { FeaturesResponse } from './features-response';

@Injectable({ providedIn: 'root' })
export class FeaturesService {
  private url = `${environment.baseUrl}api/features`;

  options$ = this.modelService.model$.pipe(
    tap(() => {
      this.featuresLoadingSubject.next(true);
      this.clearSelectedFeatures();
    }),
    switchMap((model) => this.http.post<FeaturesResponse>(this.url, model)),
    tap(() => this.featuresLoadingSubject.next(false)),
    shareReplay()
  );

  features$ = this.options$.pipe(map((options) => options.features));

  private featuresLoadingSubject = new BehaviorSubject<boolean>(false);
  featuresLoading$ = this.featuresLoadingSubject.asObservable();

  private gminSubject = new BehaviorSubject<string>(null);
  private gmajSubject = new BehaviorSubject<string>(null);

  private featureTypeMap = {
    gmin: this.gminSubject,
    gmaj: this.gmajSubject,
  };

  groupNames$ = combineLatest([this.gminSubject, this.gmajSubject]).pipe(
    filter(([gmin, gmaj]) => !!gmin && !!gmaj)
  );

  selectedFeatures$ = this.groupNames$.pipe(
    map(([gmin, gmaj]): SelectedFeature => ({ gmin, gmaj }))
  );

  featuresToUpload$ = this.selectedFeatures$.pipe(
    withLatestFrom(this.modelService.model$),
    map(this.createFeaturesToUpload)
  );

  constructor(
    private http: HttpClient,
    private modelService: ModelService,
    private fixService: FixService
  ) {}

  updateSelectedFeature(feature: { type: string; value: string }) {
    this.featureTypeMap[feature.type].next(feature.value);
    this.fixService.clear();
  }

  private clearSelectedFeatures() {
    this.gmajSubject.next(null);
    this.gminSubject.next(null);
  }

  private createFeaturesToUpload([selectedFeature, formData]: [
    SelectedFeature,
    FormData
  ]) {
    const out = new FormData();
    out.append('file', formData.get('file'));
    out.append('data', JSON.stringify(selectedFeature));
    return out;
  }
}
