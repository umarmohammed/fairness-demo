import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SideNavService {
  private sideNavOpenSubject = new BehaviorSubject<boolean>(true);

  sideNavOpen$ = this.sideNavOpenSubject.asObservable();

  toggle() {
    this.sideNavOpenSubject.next(!this.sideNavOpenSubject.value);
  }
}
