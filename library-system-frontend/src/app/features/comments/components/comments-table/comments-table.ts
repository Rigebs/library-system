import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MinimalTableComponent,
  TableAction,
  TableColumn,
} from '../../../../shared/components/minimal-table/minimal-table';
import { Comment } from '../../models/comment.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-comments-table',
  imports: [CommonModule, MinimalTableComponent, RouterLink],
  templateUrl: './comments-table.html',
  styleUrl: './comments-table.css',
})
export class CommentsTable {
  comments = input.required<Comment[]>();

  approve = output<number>();
  reject = output<number>();
  viewDetail = output<Comment>();

  commentColumns: TableColumn<Comment>[] = [
    { key: 'id', header: 'ID', isSortable: true },
    { key: 'status', header: 'Estado', isSortable: true },
    { key: 'book', header: 'Libro' },
    { key: 'text', header: 'Comentario' },
    { key: 'user', header: 'Usuario' },
    { key: 'createdAt', header: 'Fecha', isSortable: true },
    { key: 'actions', header: 'Acciones' },
  ];

  commentActions: TableAction<Comment>[] = [
    {
      label: 'Ver detalles',
      icon: '/icons/view.svg',
      color: 'accent',
      onClick: (comment: Comment) => this.viewDetail.emit(comment),
    },
    {
      label: 'Aprobar',
      icon: '/icons/check.svg',
      color: 'primary',
      onClick: (comment: Comment) => this.approve.emit(comment.id),
      isHidden: (comment: Comment) => comment.status !== 'PENDING',
    },
    {
      label: 'Rechazar',
      icon: '/icons/delete.svg',
      color: 'warn',
      onClick: (comment: Comment) => this.reject.emit(comment.id),
      isHidden: (comment: Comment) => comment.status === 'REJECTED',
    },
  ];
}
