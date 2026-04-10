import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entity } from '../models/entity.model';

@Injectable({
  providedIn: 'root'
})
export class EntityService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/entities';

  getAll(): Observable<Entity[]> {
    return this.http.get<Entity[]>(this.apiUrl);
  }

  getById(id: number): Observable<Entity> {
    return this.http.get<Entity>(`${this.apiUrl}/${id}`);
  }

  create(entity: { name: string }): Observable<Entity> {
    return this.http.post<Entity>(this.apiUrl, entity);
  }

  update(id: number, entity: { name: string }): Observable<Entity> {
    return this.http.put<Entity>(`${this.apiUrl}/${id}`, entity);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  checkAssociations(id: number): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/${id}/associations`);
  }
}
