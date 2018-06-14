import {Component, OnDestroy, OnInit, ViewChild, Input, HostListener} from '@angular/core';
import {MatDrawer, MatDrawerContainer, MatSidenav} from '@angular/material';
import {LayoutService} from '../layout.service';
import {Subject} from 'rxjs/index';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('opened', [
      state('true', style({
        'padding-left': '15px;',
      })),
      state('false',   style({
        'padding-left': '86px;'
      })),
      transition('true => false', animate('100ms ease-in')),
      transition('false => true', animate('100ms ease-out'))
    ])
  ]
})
export class SidenavComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: MatDrawer;

  private ngUnsubscribe: Subject<boolean> = new Subject();
  private closeIcon = 'close';
  private menuIcon = 'menu';
  opened;
  buttonIcon = this.menuIcon;

  constructor(private _layout: LayoutService) { }

  ngOnInit() {
    this.layoutListener();
    this.opened = this.sidenav.opened + "";
  }

  private toggleButtonIcon(){
    this.buttonIcon = this.sidenav.opened ? this.closeIcon : this.menuIcon;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  private toggleSidenav(){
    this.sidenav.toggle();
    this.toggleButtonIcon();
    this.opened = this.sidenav.opened + "";
  }

  layoutListener() {
    this._layout.sidenav
      .subscribe(
        open => {
          if(open == null) {
            this.sidenav.toggle();
            return;
          }
          this.sidenav.opened = open;
        }
      );
  }


  @HostListener('window:scroll', [])
  scrollHandler(event) {
    console.log("Scroll Event", event);
  }


}
