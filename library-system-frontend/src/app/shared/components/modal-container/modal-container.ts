import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal-container',
  imports: [],
  templateUrl: './modal-container.html',
  styleUrl: './modal-container.css',
})
export class ModalContainer {
  isOpen = input.required<boolean>();

  closeRequested = output<void>();

  onCloseRequested(): void {
    this.closeRequested.emit();
  }
}
