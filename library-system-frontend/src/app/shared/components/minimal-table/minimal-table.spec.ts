import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimalTable } from './minimal-table';

describe('MinimalTable', () => {
  let component: MinimalTable;
  let fixture: ComponentFixture<MinimalTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinimalTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinimalTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
