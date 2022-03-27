import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { PeopleComponent } from './people.component';
import { PeopleDetailsComponent } from './people-details/people-details.component';
import { PeopleListAdminsComponent } from './people-list-admins/people-list-admins.component';
import {
  PeopleResolver,
  PeopleSettingResolver,
  UserResolver,
} from './people.resolvers';

const peopleRoutes: Route[] = [
  {
    path: '',
    component: PeopleComponent,
    //canActivate: [CanActivatePeopleGuard],
    children: [
      {
        path: '',
        component: PeopleListAdminsComponent,
        resolve: {
          people: PeopleResolver,
          settings: PeopleSettingResolver,
        },
      },
      {
        path: 'create',
        component: PeopleDetailsComponent,
      },
      {
        path: ':id',
        component: PeopleDetailsComponent,
        resolve: {
          user: UserResolver,
        },
      },
    ],
  },
];

@NgModule({
  declarations: [
    PeopleComponent,
    PeopleDetailsComponent,
    PeopleListAdminsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(peopleRoutes),
    TranslocoModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatTooltipModule,
    MatTableModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSnackBarModule,
  ],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: 'people' },
    PeopleSettingResolver,
  ],
})
export class PeopleModule {}
