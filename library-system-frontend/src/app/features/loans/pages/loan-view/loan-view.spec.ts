import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanEdit } from './loan-view';

describe('LoanEdit', () => {
  let component: LoanEdit;
  let fixture: ComponentFixture<LoanEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
