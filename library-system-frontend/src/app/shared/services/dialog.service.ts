import { Injectable, signal, WritableSignal } from '@angular/core';
import { CommentStatus } from '../../features/comments/models/comment.model';
import { Comment } from '../../features/comments/models/comment.model';

export interface DialogResult {
  id: number;
  status: CommentStatus;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private activeDialogData: WritableSignal<Comment | null> = signal(null);

  private dialogResult = signal<DialogResult | null>(null);

  public activeComment = this.activeDialogData.asReadonly();
  public result = this.dialogResult.asReadonly();

  openCommentDetails(comment: Comment): void {
    this.dialogResult.set(null);
    this.activeDialogData.set(comment);
  }

  close(result: DialogResult | null = null): void {
    this.dialogResult.set(result);
    this.activeDialogData.set(null);
  }
}
