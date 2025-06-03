import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Submission } from '../../models/Submission';
import { StudentExamView } from '../../models/StudentExamView';

@Component({
  selector: 'app-grade-appeal',
  templateUrl: './grade-appeal.component.html',
  styleUrls: ['./grade-appeal.component.css'],
  animations: [
    trigger('modalAnimation', [
      state('in', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')
      ]),
      transition('* => void', [
        animate('200ms cubic-bezier(0.4, 0, 1, 1)',
          style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ]),
    trigger('overlayAnimation', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('250ms ease-out')
      ]),
      transition('* => void', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('buttonHover', [
      state('default', style({ transform: 'scale(1)' })),
      state('hovered', style({ transform: 'scale(1.02)' })),
      transition('default <=> hovered', animate('150ms ease-out'))
    ])
  ]
})
export class GradeAppealComponent {
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitAppeal = new EventEmitter<string>();
  // @Input() submission?: Submission;
  @Input() submission?: StudentExamView;

  // Using signals for better performance
  appealText = signal('');
  isSubmitting = signal(false);
  submitButtonHover = signal(false);
  cancelButtonHover = signal(false);

  readonly maxLength = 2000;

  onClose(): void {
    this.closeModal.emit();
    this.appealText.set('');
  }

  onSubmit(): void {
    const text = this.appealText().trim();
    if (text) {
      this.isSubmitting.set(true);

      // Simulate API call
      setTimeout(() => {
        this.submitAppeal.emit(text);
        this.isSubmitting.set(false);
        this.onClose();
      }, 1000);
    }
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onTextareaInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.appealText.set(target.value);
  }

  onSubmitButtonHover(isHovered: boolean): void {
    this.submitButtonHover.set(isHovered);
  }

  onCancelButtonHover(isHovered: boolean): void {
    this.cancelButtonHover.set(isHovered);
  }

  get characterCount(): number {
    return this.appealText().length;
  }

  get isSubmitDisabled(): boolean {
    return !this.appealText().trim() || this.isSubmitting();
  }
}