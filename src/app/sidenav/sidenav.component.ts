import {Component, OnDestroy, OnInit, ViewChild, Input, HostListener, ElementRef, AfterViewInit} from '@angular/core';
import {
  MatButton,
  MatDrawer
} from '@angular/material';
import {LayoutService} from '../layout.service';
import {Subject} from 'rxjs/index';
import {takeUntil} from "rxjs/operators";

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav') sidenav: MatDrawer;
  @ViewChild('sidenavBtn') sidenavBtn: MatButton;
  @ViewChild('menuBtns') menuBtns: ElementRef;

  menuButtonItems = [
    {link: "/", icon: 'home'},
    {link: "/about", icon: 'person'},
    {link: "/box-and-weave", icon: 'play_arrow'}
  ]

  private ngUnsubscribe: Subject<boolean> = new Subject();
  private closeIcon = 'close';
  private menuIcon = 'menu';
  buttonIcon = this.menuIcon;

  constructor(private _layout: LayoutService, private router: Router) { }

  ngOnInit() {
    this.initListener();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  private toggleButtonIcon(open){
    this.buttonIcon = this.sidenav.opened ? this.closeIcon : this.menuIcon;
  }

  toggleSidenav(open?){
    if(open == null){
      open = !this.sidenav.opened;
    }
    if(open){
      this.sidenav.open();
      this.sidenavBtn._elementRef.nativeElement.classList.add("sidenav-open");
    } else {
      this.sidenav.close();
      this.sidenavBtn._elementRef.nativeElement.classList.remove("sidenav-open");
    }
    this.toggleButtonIcon(this.sidenav.opened);
  }

  initListener() {
    this._layout.sidenav
      .pipe(takeUntil<any>(this.ngUnsubscribe))
      .subscribe(opened => this.toggleSidenav())
  }

  setActive(event){
    for(let child of event.currentTarget.parentNode.children) {
      child.classList.remove("active");
    }
    event.currentTarget.classList.add("active");
  }

  ngAfterViewInit(): void {
    this.menuButtonItems.map(
      (child, index) => {
        if(child.link == window.location.pathname){
          this.menuBtns.nativeElement.children[index].classList.add("active");
        }
      });
  }

}
