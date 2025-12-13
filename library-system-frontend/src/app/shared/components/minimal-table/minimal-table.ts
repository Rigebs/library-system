import {
  Component,
  input,
  output,
  computed,
  signal,
  Signal,
  WritableSignal,
  ContentChildren,
  QueryList,
  TemplateRef,
  AfterContentInit,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn<T> {
  key: keyof T | 'actions';
  header: string;
  isSortable?: boolean;
}

export interface TableAction<T> {
  label: string;
  icon?: string;
  color?: 'primary' | 'accent' | 'warn' | 'default';
  onClick: (item: T) => void;
  isHidden?: (item: T) => boolean;
}

type SortDirection = 'asc' | 'desc' | '';

@Component({
  selector: 'app-minimal-table',
  imports: [CommonModule],
  templateUrl: './minimal-table.html',
  styleUrl: './minimal-table.css',
})
export class MinimalTableComponent<T extends Record<string, any>>
  implements OnInit, AfterContentInit
{
  columns = input.required<TableColumn<T>[]>();
  data = input.required<T[]>();
  actions = input<TableAction<T>[]>([]);
  isPaginable = input<boolean>(false);

  initialPageSize = input<number>(5);
  availablePageSizes = [5, 10, 25, 50];

  currentPage = signal(1);
  pageSize!: WritableSignal<number>;

  ngOnInit() {
    this.pageSize = signal(this.initialPageSize());
  }

  sortColumn = signal<keyof T | ''>('');
  sortDirection = signal<SortDirection>('');

  @ContentChildren(TemplateRef, { descendants: true })
  columnTemplates!: QueryList<TemplateRef<any>>;

  templateMap: WritableSignal<Map<keyof T | 'actions', TemplateRef<any>>> = signal(new Map());

  totalPages = computed(() => {
    const totalItems = this.data().length;
    return Math.ceil(totalItems / this.pageSize());
  });

  sortedData = computed(() => {
    const currentData = this.data();
    const column = this.sortColumn();
    const direction = this.sortDirection();

    if (!column || !direction) {
      return currentData;
    }

    return currentData.slice().sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      let comparison = 0;

      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }

      return direction === 'desc' ? comparison * -1 : comparison;
    });
  });

  paginatedData = computed(() => {
    const dataToPaginate = this.sortedData();

    if (!this.isPaginable()) {
      return dataToPaginate;
    }

    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();

    return dataToPaginate.slice(start, end);
  });

  ngAfterContentInit() {
    const templateMap = new Map<keyof T | 'actions', TemplateRef<any>>();

    this.columnTemplates.forEach((template) => {
      const templateContext = (template as any)._declarationTContainer?.attrs;
      if (templateContext) {
        const keyAttrIndex = templateContext.findIndex(
          (attr: any) => typeof attr === 'string' && attr === 'minimalTableCell'
        );

        if (keyAttrIndex !== -1 && templateContext.length > keyAttrIndex + 1) {
          const key = templateContext[keyAttrIndex + 1] as string;
          if (key) {
            templateMap.set(key as keyof T | 'actions', template);
          }
        }
      }
    });

    this.templateMap.set(templateMap as Map<keyof T | 'actions', TemplateRef<any>>);
  }

  toggleSort(column: TableColumn<T>) {
    if (!column.isSortable) return;

    const columnKey = column.key as keyof T;

    if (this.sortColumn() !== columnKey) {
      this.sortColumn.set(columnKey);
      this.sortDirection.set('asc');
    } else {
      const currentDir = this.sortDirection();
      let nextDir: SortDirection;

      if (currentDir === 'asc') {
        nextDir = 'desc';
      } else if (currentDir === 'desc') {
        nextDir = '';
        this.sortColumn.set('');
      } else {
        nextDir = 'asc';
      }

      this.sortDirection.set(nextDir);
    }
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  setPageSize(event: Event): void {
    const newSize = Number((event.target as HTMLSelectElement).value);
    if (this.availablePageSizes.includes(newSize)) {
      (this.pageSize as WritableSignal<number>).set(newSize);
      this.currentPage.set(1);
    }
  }
}
