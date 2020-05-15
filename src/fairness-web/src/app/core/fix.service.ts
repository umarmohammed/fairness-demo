import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FixService {
  private fixActionSubject = new BehaviorSubject<string>('');
  fixAction$ = this.fixActionSubject.asObservable();

  private fixingSubject = new BehaviorSubject<boolean>(false);
  fixing$ = this.fixingSubject.asObservable().pipe(tap(console.log));

  fix() {
    this.fixActionSubject.next('fix');
  }

  fixing() {
    this.fixingSubject.next(true);
  }

  fixed() {
    this.fixingSubject.next(false);
  }

  clear() {
    this.fixActionSubject.next('clear');
  }
}
