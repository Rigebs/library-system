import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-form.html',
  styleUrl: './review-form.css',
})
export class ReviewForm {
  reviewSubmitted = output<{ rating: number; reviewText: string }>();

  currentRating = signal(0);

  form = new FormGroup({
    reviewText: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  setRating(rating: number): void {
    this.currentRating.set(rating);
  }

  submitReview(): void {
    if (this.currentRating() === 0 || this.form.invalid) {
      return;
    }

    this.reviewSubmitted.emit({
      rating: this.currentRating(),
      reviewText: this.form.controls.reviewText.value,
    });

    this.form.reset();
    this.currentRating.set(0);
  }
}
