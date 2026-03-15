import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../core/auth/auth-api';
import { UsuarioList } from './usuario/usuario-list.component';
import { RolList } from './rol/rol-list.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, UsuarioList, RolList],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class Admin implements OnInit {

  isLoggedIn = false;
  username = '';
  vista = 'usuarios';

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
