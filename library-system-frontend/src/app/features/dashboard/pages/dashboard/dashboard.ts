import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardPage implements OnInit {
  private dashboardService = inject(DashboardService);

  public summary = this.dashboardService.summary;
  public isLoading = this.dashboardService.isLoading;
  public error = this.dashboardService.error;

  ngOnInit(): void {
    this.dashboardService.loadSummary().subscribe();
  }
}
