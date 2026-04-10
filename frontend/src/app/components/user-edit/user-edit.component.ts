import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private confirmService = inject(ConfirmService);

  user: User | null = null;
  username = '';
  email = '';
  password = '';
  showPassword = false;
  loading = false;
  error: string | null = null;
  userId = 0;

  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = +id;
      this.loadUser();
    }
  }

  loadUser(): void {
    this.loading = true;
    this.userService.getById(this.userId).subscribe({
      next: (data) => {
        this.user = data;
        this.username = data.username;
        this.email = data.email;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de l\'utilisateur';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  updateUser(): void {
    if (!this.username.trim() || !this.email.trim()) {
      this.error = 'Le nom d\'utilisateur et l\'email sont obligatoires';
      return;
    }

    if (!this.emailPattern.test(this.email)) {
      this.error = 'Veuillez entrer une adresse email valide';
      return;
    }

    this.confirmService.open({
      title: 'Confirmer la modification',
      message: 'Voulez-vous vraiment modifier cet utilisateur ?',
      confirmText: 'Modifier',
      cancelText: 'Annuler'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.loading = true;
        this.error = null;

        const userData: any = {
          username: this.username,
          email: this.email
        };

        if (this.password) {
          userData.password = this.password;
        }

        this.userService.update(this.userId, userData).subscribe({
          next: () => {
            this.router.navigate(['/users']);
          },
          error: (err) => {
            this.error = 'Erreur lors de la mise à jour de l\'utilisateur';
            this.loading = false;
            this.cdr.detectChanges();
            console.error(err);
          }
        });
      }
    });
  }
}
