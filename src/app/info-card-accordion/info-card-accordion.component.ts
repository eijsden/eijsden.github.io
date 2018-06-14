import {Component, Input, OnInit} from '@angular/core';
import {CardInfo} from '../classes/card-info';

@Component({
  selector: 'app-info-card-accordion',
  templateUrl: './info-card-accordion.component.html',
  styleUrls: ['./info-card-accordion.component.scss']
})
export class InfoCardAccordionComponent implements OnInit {

  @Input() cardsInfo: CardInfo[];

  step = 0;

  constructor() { }

  ngOnInit() {
  }

  stepEvent(newValue){
    this.step = newValue;
  }

  isCardLastInList(index){
    return (this.cardsInfo.length-1) == index;
  }



}
