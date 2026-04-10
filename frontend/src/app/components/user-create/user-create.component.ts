import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);

  username = '';
  email = '';
  password = '';
  showPassword = false;
  loading = false;
  error: string | null = null;

  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  createUser(): void {
    if (!this.username.trim() || !this.email.trim() || !this.password) {
      this.error = 'Tous les champs sont obligatoires';
      this.cdr.detectChanges();
      return;
    }

    if (!this.emailPattern.test(this.email)) {
      this.error = 'Veuillez entrer une adresse email valide';
      this.cdr.detectChanges();
      return;
    }

    this.confirmService.open({
      title: 'Confirmer la création',
      message: 'Voulez-vous vraiment créer cet utilisateur ?',
      confirmText: 'Créer',
      cancelText: 'Annuler'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.loading = true;
        this.error = null;
        this.cdr.detectChanges();

        this.userService.create({
          username: this.username,
          email: this.email,
          password: this.password
        }).subscribe({
          next: () => {
            this.router.navigate(['/users']);
          },
          error: (err) => {
            this.error = 'Erreur lors de la création de l\'utilisateur';
            this.loading = false;
            this.cdr.detectChanges();
            console.error(err);
          }
        });
      }
    });
  }
}
