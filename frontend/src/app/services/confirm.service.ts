import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { first, take } from 'rxjs/operators';

export interface ConfirmData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private subject = new Subject<ConfirmData>();
  private pendingResponse: Subject<boolean> | null = null;

  confirm$ = this.subject.asObservable();

  open(data: ConfirmData): Observable<boolean> {
    this.pendingResponse = new Subject<boolean>();
    this.subject.next(data);
    return this.pendingResponse.asObservable().pipe(first());
  }

  respond(confirmed: boolean): void {
    if (this.pendingResponse) {
      this.pendingResponse.next(confirmed);
      this.pendingResponse.complete();
      this.pendingResponse = null;
    }
  }
}
