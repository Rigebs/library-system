import { Component, inject, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../../core/models/user.model';
import { Role } from '../../../../core/enums/role.enum';

type UserFormOutput = { id?: number; data: any };

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  public userData = input<User | null>(null);
  public save = output<UserFormOutput>();
  public isLoading = input<boolean>(false);

  public userForm!: FormGroup;
  public isEditMode: boolean = false;
  public roles = Object.values(Role);

  ngOnInit(): void {
    this.isEditMode = !!this.userData();
    this.initForm();
  }

  private initForm(): void {
    const user = this.userData();

    this.userForm = this.fb.group({
      name: [user?.name || '', [Validators.required, Validators.minLength(3)]],
      email: [user?.email || '', [Validators.required, Validators.email]],
      password: [
        '',
        [
          !this.isEditMode ? Validators.required : Validators.nullValidator,
          Validators.minLength(6),
        ],
      ],
      role: [user?.role || Role.USER, [Validators.required]],
    });

    if (this.isEditMode) {
      this.userForm.get('email')?.disable();
    }
  }

  public onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = {
      ...this.userForm.getRawValue(),
      email: this.userData()?.email || this.userForm.get('email')?.value,
    };

    if (this.isEditMode && !formValue.password) {
      delete formValue.password;
    }

    this.save.emit({
      id: this.userData()?.id,
      data: formValue,
    });
  }
}
