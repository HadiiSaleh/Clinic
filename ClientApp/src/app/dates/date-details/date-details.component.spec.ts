import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateDetailsComponent } from './date-details.component';

describe('DateDetailsComponent', () => {
  let component: DateDetailsComponent;
  let fixture: ComponentFixture<DateDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
