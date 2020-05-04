import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ShellService {
  showMenu$ = this.router.events.pipe(
    map(() => this.router.url),
    distinctUntilChanged(),
    map((url) => url === '/metrics')
  );

  constructor(private router: Router) {}
}
