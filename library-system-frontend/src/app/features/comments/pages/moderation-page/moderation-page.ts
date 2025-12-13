import { Component, OnInit, inject, signal, computed, WritableSignal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsTable } from '../../components/comments-table/comments-table';
import { CommentsService } from '../../comment.service';
import { CommentStatus } from '../../models/comment.model';
import { DialogService } from '../../../../shared/services/dialog.service';
import { Comment } from '../../models/comment.model';
import { CommentDetailDialog } from '../../components/comment-detail-dialog/comment-detail-dialog';
import { ModalContainer } from '../../../../shared/components/modal-container/modal-container';

@Component({
  selector: 'app-moderation-page',
  imports: [CommonModule, CommentsTable, ModalContainer, CommentDetailDialog],
  templateUrl: './moderation-page.html',
  styleUrl: './moderation-page.css',
})
export class ModerationPage implements OnInit {
  private commentsService = inject(CommentsService);

  public isLoading = this.commentsService.isLoading;
  public error = this.commentsService.error;

  currentFilter: WritableSignal<CommentStatus | 'ALL'> = signal('PENDING');

  public dialogService = inject(DialogService);

  public activeCommentInDialog = this.dialogService.activeComment;

  constructor() {
    effect(() => {
      const result = this.dialogService.result();
      if (result) {
        if (result.status === 'APPROVED') {
          this.onApprove(result.id);
        } else if (result.status === 'REJECTED') {
          this.onReject(result.id);
        }
      }
    });
  }

  filteredComments = computed(() => {
    const comments = this.commentsService.comments();
    const filter = this.currentFilter();

    if (filter === 'ALL') {
      return comments;
    }
    return comments.filter((c) => c.status === filter);
  });

  protected pendingCount = this.commentsService.pendingCount;
  protected approvedCount = this.commentsService.approvedCount;
  protected rejectedCount = this.commentsService.rejectedCount;
  protected totalCount = this.commentsService.totalCount;

  ngOnInit(): void {
    this.commentsService.loadAllComments();
  }

  setFilter(status: CommentStatus | 'ALL'): void {
    this.currentFilter.set(status);
  }

  onViewDetails(comment: Comment): void {
    this.dialogService.openCommentDetails(comment);
  }

  onApprove(commentId: number): void {
    if (confirm('¿Confirmas aprobar este comentario?')) {
      this.commentsService.updateCommentStatus(commentId, 'APPROVED').subscribe(() => {});
    }
  }

  onReject(commentId: number): void {
    if (confirm('¿Confirmas rechazar y archivar este comentario?')) {
      this.commentsService.updateCommentStatus(commentId, 'REJECTED').subscribe(() => {});
    }
  }
}
