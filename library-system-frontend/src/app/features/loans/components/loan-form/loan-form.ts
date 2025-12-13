import { Component, input, output, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { LoanPayload, Loan } from '../../models/loan.model';

@Component({
  selector: 'app-loan-form',
  imports: [ReactiveFormsModule],
  templateUrl: './loan-form.html',
  styleUrl: './loan-form.css',
})
export class LoanFormComponent implements OnInit {
  public initialData = input<Loan | null>(null);
  public isSubmitting = input<boolean>(false);

  public formSubmit = output<LoanPayload>();

  private fb = inject(FormBuilder);
  public loanForm!: FormGroup;

  ngOnInit() {
    this.loanForm = this.fb.group({
      userId: [this.initialData()?.user.id || '', [Validators.required]],
      bookId: [this.initialData()?.book.id || '', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loanForm.valid) {
      this.formSubmit.emit(this.loanForm.value as LoanPayload);
    }
  }

  hasError(controlName: string, errorType: string) {
    const control = this.loanForm.get(controlName);
    return control && control.hasError(errorType) && (control.touched || control.dirty);
  }
}
