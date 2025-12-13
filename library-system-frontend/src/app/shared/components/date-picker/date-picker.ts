import { Component, signal, input, output, effect, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
})
export class DatePickerComponent implements OnInit {
  initialDate = input<Date | null>(null);
  placeholder = input('Seleccionar fecha...');
  dateFormat = input('shortDate');
  daySelected = output<Date>();

  isCalendarOpen = signal(false);
  selectedDate = signal<Date | null>(null);

  ngOnInit(): void {
    const initial = this.initialDate();
    this.selectedDate.set(initial ?? null);
  }

  toggleCalendar(): void {
    this.isCalendarOpen.update((isOpen) => !isOpen);
  }

  handleDaySelected(date: Date): void {
    this.selectedDate.set(date);
    this.daySelected.emit(date);
    this.isCalendarOpen.set(false);
  }

  closeCalendarOnFocusOut(event: FocusEvent): void {
    const newFocusTarget = event.relatedTarget as HTMLElement;
    const container = (event.currentTarget as HTMLElement).closest('.date-picker-container');

    if (this.isCalendarOpen() && container && !container.contains(newFocusTarget)) {
      this.isCalendarOpen.set(false);
    }
  }

  closeCalendar(): void {
    if (!this.isCalendarOpen()) return;
    this.isCalendarOpen.set(false);
  }
}
