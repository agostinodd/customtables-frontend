import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomtableComponent } from './add-customtable.component';

describe('AddCustomtableComponent', () => {
  let component: AddCustomtableComponent;
  let fixture: ComponentFixture<AddCustomtableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomtableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
