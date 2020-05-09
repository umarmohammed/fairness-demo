import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FixService {
  private fixActionSubject = new BehaviorSubject<string>('');
  fixAction$ = this.fixActionSubject.asObservable();

  fix() {
    this.fixActionSubject.next('fix');
  }

  clear() {
    this.fixActionSubject.next('clear');
  }
}
