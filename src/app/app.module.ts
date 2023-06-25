import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {NzSwitchModule } from 'ng-zorro-antd/switch';
import { DatePipe } from '@angular/common';

import {TransactionManagerComponent} from './pages/transaction-manager/transaction-manager.component';
import {UserManagerComponent} from './pages/user-manager/user-manager.component';
import {GenQRComponent} from './pages/gen-qrad/gen-qr.component';
import {GenQRBankComponent} from './pages/gen-qrbank/gen-qrbank.component';
import { MyQRComponent } from './pages/my-qr/my-qr.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';

import {LoginComponent} from './pages/login/login.component';

import { HomeComponent } from './pages/home/home.component';
import { AuthService } from 'src/app/auth-service';
import { LoginGuard  } from './pages/login/login.guard';
import { QRManagerComponent } from './pages/qr-manager/qr-manager.component';

registerLocaleData(en);

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    GenQRComponent,
    GenQRBankComponent,
    UserManagerComponent,
    TransactionManagerComponent,
    LoginComponent,
    HomeComponent,
    QRManagerComponent,
    MyAccountComponent,
    MyQRComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzCardModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzSwitchModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzTableModule,
    NzModalModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    AuthService,
    LoginGuard,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
