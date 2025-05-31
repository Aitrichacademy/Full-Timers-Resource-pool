import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeetableComponent } from './employeetable.component';

describe('EmployeetableComponent', () => {
  let component: EmployeetableComponent;
  let fixture: ComponentFixture<EmployeetableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeetableComponent]
    });
    fixture = TestBed.createComponent(EmployeetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
