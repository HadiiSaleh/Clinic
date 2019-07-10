import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantDetailsComponent } from './assistant-details.component';

describe('AssistantDetailsComponent', () => {
  let component: AssistantDetailsComponent;
  let fixture: ComponentFixture<AssistantDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
