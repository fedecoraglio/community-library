import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule } from '@ngneat/transloco';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthSignInComponent } from './sign-in.component';
import { SharedModule } from '../../../shared/shared.module';

export const authSignInRoutes: Route[] = [
  {
    path: '',
    component: AuthSignInComponent,
  },
];

@NgModule({
  declarations: [AuthSignInComponent],
  imports: [
    RouterModule.forChild(authSignInRoutes),
    TranslocoModule,
    SharedModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
})
export class AuthSignInModule {}
