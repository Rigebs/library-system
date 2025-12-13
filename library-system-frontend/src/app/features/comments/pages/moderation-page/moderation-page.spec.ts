import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationPage } from './moderation-page';

describe('ModerationPage', () => {
  let component: ModerationPage;
  let fixture: ComponentFixture<ModerationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModerationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModerationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
