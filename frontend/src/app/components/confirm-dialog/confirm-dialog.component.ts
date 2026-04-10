import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ConfirmService, ConfirmData } from '../../services/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirm-overlay" *ngIf="show">
      <div class="confirm-dialog">
        <h3>{{ data.title }}</h3>
        <p>{{ data.message }}</p>
        <div class="confirm-actions">
          <button class="btn btn-confirm" (click)="onConfirm()">
            {{ data.confirmText || 'Confirmer' }}
          </button>
          <button class="btn btn-cancel" (click)="onCancel()">
            {{ data.cancelText || 'Annuler' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .confirm-dialog {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      width: 90%;
      text-align: center;
    }
    .confirm-dialog h3 {
      margin-top: 0;
      color: #333;
    }
    .confirm-dialog p {
      color: #666;
      margin: 1rem 0;
    }
    .confirm-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1.5rem;
    }
    .btn {
      padding: 0.5rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      color: white;
    }
    .btn-confirm {
      background-color: #007bff;
    }
    .btn-confirm:hover {
      background-color: #0056b3;
    }
    .btn-cancel {
      background-color: #6c757d;
    }
    .btn-cancel:hover {
      background-color: #5a6268;
    }
  `]
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  show = false;
  data: ConfirmData = { title: '', message: '' };
  private subscription: Subscription | null = null;

  constructor(private confirmService: ConfirmService) {}

  ngOnInit(): void {
    this.subscription = this.confirmService.confirm$.subscribe((data) => {
      this.data = data;
      this.show = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onConfirm(): void {
    this.show = false;
    this.confirmService.respond(true);
  }

  onCancel(): void {
    this.show = false;
    this.confirmService.respond(false);
  }
}
