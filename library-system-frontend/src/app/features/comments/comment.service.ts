import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap, map, Observable } from 'rxjs';
import { ApiResponse } from '../../core/auth/auth.models';
import { Comment, CommentStatus, CommentPayload } from './models/comment.model';

interface CommentsState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/comments';
  private moderationUrl = `${this.apiUrl}/moderation`;

  private state: WritableSignal<CommentsState> = signal<CommentsState>({
    comments: [],
    isLoading: false,
    error: null,
  });

  public comments = computed(() => this.state().comments);
  public isLoading = computed(() => this.state().isLoading);
  public error = computed(() => this.state().error);

  public pendingCount = computed(
    () => this.comments().filter((c) => c.status === 'PENDING').length
  );
  public approvedCount = computed(
    () => this.comments().filter((c) => c.status === 'APPROVED').length
  );
  public rejectedCount = computed(
    () => this.comments().filter((c) => c.status === 'REJECTED').length
  );
  public totalCount = computed(() => this.comments().length);

  loadAllComments(): void {
    if (this.isLoading()) return;

    this.state.update((s) => ({ ...s, isLoading: true, error: null }));

    this.http
      .get<ApiResponse<Comment[]>>(this.moderationUrl)
      .pipe(
        map((response) => response.data || []),
        catchError((err) => {
          console.error('Error loading comments for moderation:', err);
          this.state.update((s) => ({
            ...s,
            isLoading: false,
            error: 'Failed to load comments. Authentication or network error.',
          }));
          return of([] as Comment[]);
        })
      )
      .subscribe((comments) => {
        this.state.update((s) => ({
          ...s,
          comments: comments,
          isLoading: false,
        }));
      });
  }

  updateCommentStatus(commentId: number, newStatus: CommentStatus): Observable<Comment> {
    return this.http
      .patch<ApiResponse<Comment>>(`${this.moderationUrl}/${commentId}/status`, null, {
        params: { status: newStatus },
      })
      .pipe(
        map((response) => {
          if (!response.success || !response.data) {
            throw new Error(response.message || `Error updating status to ${newStatus}.`);
          }
          return response.data;
        }),
        tap((updatedComment) => {
          this.state.update((s) => ({
            ...s,
            comments: s.comments.map((c) => (c.id === commentId ? updatedComment : c)),
          }));
        }),
        catchError((err) => {
          console.error('Error updating comment status:', err);
          this.state.update((s) => ({
            ...s,
            error: 'Error al actualizar el estado. Intente de nuevo.',
          }));
          return of(null as unknown as Comment);
        })
      );
  }

  submitComment(payload: CommentPayload): Observable<Comment> {
    return this.http.post<ApiResponse<Comment>>(this.apiUrl, payload).pipe(
      map((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Error al enviar el comentario.');
        }
        return response.data;
      }),
      catchError((err) => {
        console.error('Error submitting comment:', err);
        return of(null as unknown as Comment);
      })
    );
  }
}
