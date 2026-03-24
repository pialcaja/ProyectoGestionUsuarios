import { Routes } from '@angular/router';
import { Login } from './auth/login.component';
import { Admin } from './admin/admin.component';
import { Profile } from './profile/profile.component';
import { rolGuard } from './core/guards/rol.guard';
import { Home } from './public/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home},
    { path: 'login', component: Login },
    { path: 'admin', component: Admin, canActivate: [rolGuard]},
    { path: 'profile', component: Profile, canActivate: [rolGuard]},
];
