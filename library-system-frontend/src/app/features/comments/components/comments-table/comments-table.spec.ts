import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsTable } from './comments-table';

describe('CommentsTable', () => {
  let component: CommentsTable;
  let fixture: ComponentFixture<CommentsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
