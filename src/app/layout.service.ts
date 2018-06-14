import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  sidenav: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  openSidenav() {
    this.sidenav.emit(true)
  }
  closeSidenav() {
    this.sidenav.emit(false)
  }
  toggleSidenav() {
    this.sidenav.emit();
  }
}
