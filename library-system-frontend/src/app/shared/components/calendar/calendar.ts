import { Component, signal, computed, output, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Day = { date: Date; dayOfMonth: number; isCurrentMonth: boolean; isSelected: boolean };

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class CalendarComponent implements OnInit {
  initialDate = input<Date | null>(null);

  daySelected = output<Date>();

  private dateInView = signal(new Date());

  private selectedDate = signal<Date | null>(null);

  readonly weekdayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Propiedad para el Two-way binding del selector de año
  currentYear = signal(this.dateInView().getFullYear());

  // Signal computado para generar una lista de años (ej: +/- 10 años del actual)
  availableYears = computed(() => {
    const current = this.currentYear();
    const years: number[] = [];
    for (let i = current - 10; i <= current + 10; i++) {
      years.push(i);
    }
    return years;
  });

  ngOnInit(): void {
    const initial = this.initialDate();
    if (initial) {
      this.selectedDate.set(initial);
      this.dateInView.set(initial);
      this.currentYear.set(initial.getFullYear());
    }
  }

  // MODIFICADO: Solo muestra el nombre del mes, ya que el año está en el selector
  currentMonthLabel = computed(() => {
    return this.dateInView().toLocaleDateString('es-ES', { month: 'long' });
  });

  daysInMonth = computed<Day[]>(() => {
    const viewDate = this.dateInView();
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const days: Day[] = [];

    const firstDayOfMonth = new Date(year, month, 1);
    const startDayIndex = firstDayOfMonth.getDay();

    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonth = month === 0 ? 11 : month - 1;
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    for (let i = 0; i < startDayIndex; i++) {
      const dayOfMonth = daysInPrevMonth - startDayIndex + i + 1;
      const date = new Date(prevMonthYear, prevMonth, dayOfMonth);
      days.push({
        date,
        dayOfMonth,
        isCurrentMonth: false,
        isSelected: this.isSameDay(date, this.selectedDate()),
      });
    }

    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        dayOfMonth: i,
        isCurrentMonth: true,
        isSelected: this.isSameDay(date, this.selectedDate()),
      });
    }

    const totalCells = days.length;
    const nextMonthYear = month === 11 ? year + 1 : year;
    const nextMonth = month === 11 ? 0 : month + 1;

    for (let i = 1; totalCells + i <= 42; i++) {
      const date = new Date(nextMonthYear, nextMonth, i);
      days.push({
        date,
        dayOfMonth: i,
        isCurrentMonth: false,
        isSelected: this.isSameDay(date, this.selectedDate()),
      });
    }

    return days;
  });

  // NUEVO: Método para cambiar el año
  selectYear(yearString: string): void {
    const newYear = parseInt(yearString, 10);
    this.currentYear.set(newYear);

    this.dateInView.update((date) => {
      const newDate = new Date(date);
      newDate.setFullYear(newYear);
      return newDate;
    });
  }

  previousMonth(): void {
    this.dateInView.update((date) => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() - 1);
      this.currentYear.set(newDate.getFullYear()); // Asegura que el selector de año se actualice
      return newDate;
    });
  }

  nextMonth(): void {
    this.dateInView.update((date) => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() + 1);
      this.currentYear.set(newDate.getFullYear()); // Asegura que el selector de año se actualice
      return newDate;
    });
  }

  selectDay(date: Date): void {
    this.selectedDate.set(date);
    this.daySelected.emit(date);

    const viewDate = this.dateInView();
    if (date.getMonth() !== viewDate.getMonth() || date.getFullYear() !== viewDate.getFullYear()) {
      this.dateInView.set(date);
      this.currentYear.set(date.getFullYear()); // Asegura que el selector de año se actualice
    }
  }

  private isSameDay(d1: Date, d2: Date | null): boolean {
    if (!d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }
}
