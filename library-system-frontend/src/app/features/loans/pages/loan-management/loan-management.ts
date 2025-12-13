import { Component } from '@angular/core';
import { LoanListComponent } from '../../components/loan-list/loan-list';

@Component({
  selector: 'app-loan-management',
  imports: [LoanListComponent],
  templateUrl: './loan-management.html',
  styleUrl: './loan-management.css',
})
export class LoanManagementPage {
  // Este componente solo actúa como enrutador y contenedor
}
