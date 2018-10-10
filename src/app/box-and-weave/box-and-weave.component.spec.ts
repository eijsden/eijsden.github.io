import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxAndWeaveComponent } from './box-and-weave.component';

describe('BoxAndWeaveComponent', () => {
  let component: BoxAndWeaveComponent;
  let fixture: ComponentFixture<BoxAndWeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxAndWeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxAndWeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
