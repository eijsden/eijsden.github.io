import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCardAccordionComponent } from './info-card-accordion.component';

describe('InfoCardAccordionComponent', () => {
  let component: InfoCardAccordionComponent;
  let fixture: ComponentFixture<InfoCardAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoCardAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoCardAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
