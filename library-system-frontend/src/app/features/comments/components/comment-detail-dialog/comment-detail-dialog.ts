import { Component, inject, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Comment, CommentStatus } from '../../models/comment.model';
import { DialogService } from '../../../../shared/services/dialog.service';

@Component({
  selector: 'app-comment-detail-dialog',
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './comment-detail-dialog.html',
  styleUrl: './comment-detail-dialog.css',
})
export class CommentDetailDialog {
  private dialogService = inject(DialogService);

  comment = input.required<Comment>();

  onClose(): void {
    this.dialogService.close();
  }

  onModerate(status: CommentStatus): void {
    this.dialogService.close({ id: this.comment().id, status: status });
  }
}
