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
  pluck,
} from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { SelectedFeature } from '../metrics/selected-feature';
import { environment } from 'src/environments/environment';
import { FixService } from './fix.service';
import { FeaturesResponse } from './features-response';
import { GoalMetric } from '../metrics/metrics';

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

  targetMetrics$ = this.options$.pipe(pluck('metrics'));

  private featuresLoadingSubject = new BehaviorSubject<boolean>(false);
  featuresLoading$ = this.featuresLoadingSubject.asObservable();

  private gminSubject = new BehaviorSubject<string>(null);
  private gmajSubject = new BehaviorSubject<string>(null);

  private featureTypeMap = {
    gmin: this.gminSubject,
    gmaj: this.gmajSubject,
  };

  private selectedGoalMetricSubject = new BehaviorSubject<GoalMetric>(null);
  selectedGoalMetric$ = this.selectedGoalMetricSubject.pipe(
    map((metric) => (this.goalMetricValid(metric) ? metric : null))
  );

  selectedFairnessMethod$ = this.selectedGoalMetricSubject.pipe(
    map((metric) => metric && metric.fairnessMethod)
  );

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

  updateGoalOptions(goalMetric: { [K in keyof GoalMetric]?: any }) {
    this.selectedGoalMetricSubject.next({
      ...this.selectedGoalMetricSubject.value,
      ...goalMetric,
    });
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

  private goalMetricValid(goalMetric: GoalMetric) {
    return (
      goalMetric.fairnessMethod &&
      goalMetric.goalValue !== null &&
      goalMetric.goalValue !== undefined
    );
  }
}
