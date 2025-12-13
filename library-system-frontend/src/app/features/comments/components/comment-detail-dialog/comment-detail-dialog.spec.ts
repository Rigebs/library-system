import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentDetailDialog } from './comment-detail-dialog';

describe('CommentDetailDialog', () => {
  let component: CommentDetailDialog;
  let fixture: ComponentFixture<CommentDetailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentDetailDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentDetailDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
