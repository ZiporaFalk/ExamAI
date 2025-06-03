
import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { StudentExamView } from '../../models/StudentExamView';
import { ExamsService } from '../../services/exams/exams.service';
import { FeedbackModalComponent } from '../feedback-modal/feedback-modal.component';
import { DownloadUrlService } from '../../services/download-url/download-url.service';
import { EmailService } from '../../services/email/email.service';
import { EmailRequest } from '../../models/EmailRequest';
import { GradeAppealComponent } from "../grade-appeal/grade-appeal.component";

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, FormsModule, FeedbackModalComponent, GradeAppealComponent],
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('0.6s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-50px)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.9) translateY(20px)', opacity: 0 }),
        animate('0.4s ease-out', style({ transform: 'scale(1) translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ transform: 'translateY(20px)', opacity: 0 }),
          stagger(100, [
            animate('0.5s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('buttonHover', [
      state('normal', style({ transform: 'scale(1)' })),
      state('hovered', style({ transform: 'scale(1.05)' })),
      transition('normal <=> hovered', animate('0.2s ease-in-out'))
    ]),
    trigger('scoreAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class ExamsComponent implements OnInit {
  searchTerm: string = '';
  selectedSubject: string = 'All Subjects';
  subjects: string[] = ['All Subjects'];
  filteredExams: StudentExamView[] = [];
  allExams: StudentExamView[] = [];
  loading = true;
  // studentId = 1024;
  studentId = JSON.parse(localStorage.getItem('userId')!);
  // studentId = 5;
  allExams$: Observable<StudentExamView[]>;
  imageUrl: string | null = null;
  isAppealDialogOpen = false;
  selectedSubmission?: StudentExamView
  showFeedbackModal = false;
  selectedExam: StudentExamView | null = null;

  constructor(private examsService: ExamsService, private downloadUrlService: DownloadUrlService, private emailService: EmailService
  ) {
    console.log('examsService:', this.examsService);
    this.allExams$ = this.examsService.exams$;
  }

  submitAppeal(submission: StudentExamView) {
    this.selectedSubmission = submission;
    this.isAppealDialogOpen = true;
  }

  handleAppealSubmission(text: string) {
    console.log('Appeal submitted for:', this.selectedSubmission);
    console.log('Text:', text);
    this.isAppealDialogOpen = false;
    const name = JSON.parse(localStorage.getItem('profile') || '{}').name
    const emailRequest: EmailRequest = {
      subject: `${name} | ${this.selectedSubmission?.subject} | ${this.selectedSubmission?.dateExam} `,
      to: 'z0548498935@gmail.com',
      body: `${text}`
    };
    this.emailService.sendEmail(emailRequest).subscribe(response => {
      console.log('Email sent successfully:', response);
    }
      , error => {
        console.error('Error sending email:', error);
      });
  }

  ngOnInit(): void {
    this.examsService.loadStudentExams(this.studentId);
    this.allExams$ = this.examsService.exams$;
    this.allExams$.subscribe(exams => {
      this.allExams = exams;
      this.filteredExams = exams;
      this.loading = false;
      exams.forEach(exam => { if (!this.subjects.includes(exam.subject)) { this.subjects.push(exam.subject); } });
    });
  }

  filterExams() {
    const term = this.searchTerm.toLowerCase();
    this.filteredExams = this.allExams.filter(exam => {
      const matchesSubjectText = exam.subject.toLowerCase().includes(term);
      const matchesDate = exam.dateExam?.toString().toLowerCase().includes(term);
      const matchesScore = exam.score?.toString().includes(term);
      const matchesSearch =
        matchesSubjectText || matchesDate || matchesScore;
      const matchesSubject =
        this.selectedSubject === 'All Subjects' || exam.subject === this.selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }

  onSearchChange() {
    this.filterExams();
  }

  onSubjectChange() {
    this.filterExams();
  }

  getScoreColor(score?: number): string {
    if (!score) return '#6b7280';
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#f59e0b';
    if (score >= 70) return '#f97316';
    return '#ef4444';
  }

  getStatusColor(status: string): string {
    return status === 'Graded' ? '#f59e0b' : '#6b7280';
  }

  downloadFile(exam: StudentExamView, IsFeedback: boolean) {
    this.downloadUrlService.getUrlFile(exam, IsFeedback, true).subscribe({
      next: (response) => {
        if (!response?.url) {
          console.error('No URL returned from server.');
          return;
        }
        const link = document.createElement('a');
        link.href = response.url;
        // link.download = `${exam.subject}Exam.jpg`;
        const nameFile = IsFeedback ? `${exam.subject}_Exam.docs` : `${exam.subject}_Exam.jpg`;
        link.download = nameFile;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: (error) => {
        console.error('Error downloading feedback:', error);
      }
    });
  }

  viewScannedExam(exam: StudentExamView) {
    if (!exam.file_Url) {
      console.error("No feedback file URL available");
      return;
    }
    this.selectedExam = exam;
    this.showFeedbackModal = true;
  }

  closeFeedbackModal() {
    this.showFeedbackModal = false;
    this.selectedExam = null;
  }

}


