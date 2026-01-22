import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { UsuarioList } from '../usuario/usuario-list/usuario-list';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, UsuarioList],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {

  isLoggedIn = false;
  username = '';

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.username = this.authService.getUsername();
    });
  }

  logout() {
    this.authService.logout();
  }
}
