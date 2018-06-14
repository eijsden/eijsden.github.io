import {Component, HostListener, Inject, Input, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {
  @Input() name: string;
  @Input() title: string;
  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
  }




}
