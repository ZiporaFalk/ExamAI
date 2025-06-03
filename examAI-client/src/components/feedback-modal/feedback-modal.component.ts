import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { StudentExamView } from '../../models/StudentExamView';
import { DownloadUrlService } from "../../services/download-url/download-url.service"
import { finalize } from 'rxjs';
@Component({
  selector: 'app-feedback-modal',
  imports: [CommonModule],
  templateUrl: './feedback-modal.component.html',
  styleUrl: './feedback-modal.component.css',
  animations: [
    trigger('modalAnimation', [
      state('closed', style({
        opacity: 0,
        transform: 'scale(0.7)'
      })),
      state('open', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('closed => open', animate('300ms ease-out')),
      transition('open => closed', animate('200ms ease-in'))
    ]),
    trigger('backdropAnimation', [
      state('closed', style({
        opacity: 0
      })),
      state('open', style({
        opacity: 1
      })),
      transition('closed => open', animate('300ms ease-out')),
      transition('open => closed', animate('200ms ease-in'))
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class FeedbackModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Input() exam: StudentExamView | null = null;
  @Output() close = new EventEmitter<void>();

  imageUrl: string | null = null;
  loading = false;
  error: string | null = null;
  isImageLoaded = false;

  constructor(private downloadUrlService: DownloadUrlService) { }

  ngOnInit() {
    if (this.isOpen && this.exam) {
      this.loadExamImage();
    }
    if (this.isOpen) {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
    }
  }

  ngOnDestroy() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  }

  ngOnChanges() {
    if (typeof document !== 'undefined') {
      if (this.isOpen && this.exam) {
        this.loadExamImage();
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  }

  async loadExamImage() {
    if (!this.exam?.file_Url) {
      this.error = 'No feedback file available';
      console.log("loadFeedbackImage-error");
      return;
    }
    this.loading = true;
    this.error = null;
    this.isImageLoaded = false;
    this.downloadUrlService.getUrlFile(this.exam, false, false).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response) => {
        console.log(response.url);
        console.log(this.error);
        this.imageUrl = response.url;
      },
      error: (error) => {
        console.error("Error View Exam File:" + error);
      }
    })
  }
  onImageLoad() {
    this.isImageLoaded = true;
  }

  onImageError() {
    this.error = 'Failed to load image';
    this.loading = false;
  }

  async downloadExam() {
    if (!this.exam?.file_Url) {
      return;
    }
    if (typeof document !== 'undefined') {

      this.downloadUrlService.getUrlFile(this.exam, false, true).subscribe({
        next: (response) => {
          if (!response?.url) {
            console.error('No URL returned from server.');
            return;
          }
          const link = document.createElement('a');
          link.href = response.url;
          link.download = `${this.exam!.subject}_Exam.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        },
        error: (error) => {
          console.error('Error downloading feedback:', error);
        }
      });
    }
  }

  closeModal() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
      this.close.emit();
    }
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }
  getScoreColor(score?: number): string {
    if (!score) return '#6b7280';
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#f59e0b';
    if (score >= 70) return '#f97316';
    return '#ef4444';
  }
  // .............................................
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

}

