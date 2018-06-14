import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-info-card-panel',
  templateUrl: './info-card-panel.component.html',
  styleUrls: ['./info-card-panel.component.scss']
})
export class InfoCardPanelComponent implements OnInit {

  @Input() step;
  @Input() index;
  @Input() card;
  @Input() last = false;
  @Output() stepChanged = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
    console.debug(this.card);
  }

  setStep(next){
    this.noActions();
    this.step = next;
    this.emitChange();
  }

  nextStep() {
    this.noActions();
    this.step++;
    this.emitChange();
  }

  prevStep() {
    this.noActions();
    this.step--;
    this.emitChange();
  }

  emitChange(){
    this.stepChanged.emit(this.step);
  }

  isLast(){
    return this.last;
  }

  isFirst(){
    return this.index == 0;
  }

  noActions() {
    if(!this.card.actions){
      return;
    }
  }


}
