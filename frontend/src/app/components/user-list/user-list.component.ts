import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private confirmService = inject(ConfirmService);

  users: User[] = [];
  error: string | null = null;

  ngOnInit(): void {
    this.loadUsers();

    // Recharger les données après chaque navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadUsers();
    });
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  deleteUser(id: number): void {
    // Vérifier d'abord les associations
    this.userService.checkAssociations(id).subscribe({
      next: (assocData) => {
        const hasAssociations = assocData.count > 0;

        this.confirmService.open({
          title: 'Confirmer la suppression',
          message: hasAssociations
            ? `Cet utilisateur est associé à ${assocData.count} entité(s). Voulez-vous vraiment le supprimer ? Ses associations seront également supprimées.`
            : 'Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.',
          confirmText: 'Supprimer',
          cancelText: 'Annuler'
        }).subscribe(confirmed => {
          if (confirmed) {
            this.userService.delete(id).subscribe({
              next: (response) => {
                this.users = this.users.filter(u => u.id !== id);
                this.cdr.detectChanges();
                alert(response.message);
              },
              error: (err) => {
                console.error('Erreur lors de la suppression:', err);
                alert('Erreur lors de la suppression');
              }
            });
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la vérification des associations:', err);
        // Continuer avec le message par défaut si la vérification échoue
        this.confirmService.open({
          title: 'Confirmer la suppression',
          message: 'Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.',
          confirmText: 'Supprimer',
          cancelText: 'Annuler'
        }).subscribe(confirmed => {
          if (confirmed) {
            this.userService.delete(id).subscribe({
              next: () => {
                this.users = this.users.filter(u => u.id !== id);
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('Erreur lors de la suppression:', err);
                alert('Erreur lors de la suppression');
              }
            });
          }
        });
      }
    });
  }
}
