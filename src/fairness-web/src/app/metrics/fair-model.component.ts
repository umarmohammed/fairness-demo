import { Component } from '@angular/core';
import { FairModelService } from './fair-model.service';

@Component({
  selector: 'fai-fair-model',
  template: `{{ fairModel$ | async | json }}`,
})
export class FairModelComponent {
  fairModel$ = this.fairModelService.fairModel$;

  constructor(private fairModelService: FairModelService) {}
}
