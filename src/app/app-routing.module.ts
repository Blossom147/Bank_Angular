  import { NgModule } from '@angular/core';
  import { Routes, RouterModule } from '@angular/router';
  import { GenQRComponent } from './pages/gen-qrad/gen-qr.component';
  import { GenQRBankComponent } from './pages/gen-qrbank/gen-qrbank.component';
  import {UserManagerComponent} from './pages/user-manager/user-manager.component';
  import {TransactionManagerComponent} from './pages/transaction-manager/transaction-manager.component';
  import {LoginComponent} from './pages/login/login.component';
  import { LoginGuard } from '../app/pages/login/login.guard';
  import { HomeComponent } from './pages/home/home.component';
  import { QRManagerComponent } from './pages/qr-manager/qr-manager.component';
  import { MyQRComponent } from './pages/my-qr/my-qr.component';
  import { MyAccountComponent } from './pages/my-account/my-account.component';


  const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/login' },
    { path: 'genadqr', component: GenQRComponent, canActivate: [LoginGuard] },
    { path: 'home', component: HomeComponent, canActivate: [LoginGuard] },
    { path: 'genqrbank', component: GenQRBankComponent, canActivate: [LoginGuard] },
    { path: 'user', component: UserManagerComponent, canActivate: [LoginGuard] },
    { path: 'qr', component: QRManagerComponent, canActivate: [LoginGuard] },
    { path: 'trans', component: TransactionManagerComponent, canActivate: [LoginGuard] },
    { path: 'myQR', component: MyQRComponent , canActivate: [LoginGuard] },
    { path: 'myAccount', component: MyAccountComponent , canActivate: [LoginGuard] },
    { path: 'login', component: LoginComponent },

  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
