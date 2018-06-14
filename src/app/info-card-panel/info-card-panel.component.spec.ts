import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCardPanelComponent } from './info-card-panel.component';

describe('InfoCardPanelComponent', () => {
  let component: InfoCardPanelComponent;
  let fixture: ComponentFixture<InfoCardPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoCardPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoCardPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
