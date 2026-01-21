import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Admin } from './components/admin/admin';
import { General } from './components/general/general';
import { rolGuard } from './guards/rol-guard';
import { Home } from './components/home/home';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home},
    { path: 'login', component: Login },
    { path: 'admin', component: Admin, canActivate: [rolGuard]},
    { path: 'general', component: General, canActivate: [rolGuard]},
];
