import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>
    <a
      href="https://www.netlify.com"
      style="bottom: 5px; left: 5px; position: absolute; z-index:1"
    >
      <img
        src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg"
        alt="Deploys by Netlify"
      />
    </a>`,
})
export class AppComponent {}
