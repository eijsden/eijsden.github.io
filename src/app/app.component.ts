import { Component } from '@angular/core';
import {LayoutService} from './layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(private _layout: LayoutService) {}

  toggleSidenav(){
    this._layout.toggleSidenav();
  }

}
