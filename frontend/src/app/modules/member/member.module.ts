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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { MemberComponent } from './member.component';
import { MemberListComponent } from './list/member-list.component';
import { MemberViewComponent } from './view/member-view.component';
import { FormatGenderPipe } from '../../core/pipe/format-gender.pipe';
import { MatNativeDateModule } from '@angular/material/core';
import { FormatActivePipe } from '../../core/pipe/format-active.pipe';
import { MemberResolver, MemberSettingResolver } from './people.resolvers';

const routes: Route[] = [
  {
    path: '',
    component: MemberComponent,
    resolve: {
      settings: MemberSettingResolver,
    },
    children: [
      {
        path: '',
        component: MemberListComponent,
      },
      {
        path: 'create',
        component: MemberViewComponent,
      },
      {
        path: ':id',
        component: MemberViewComponent,
        resolve: {
          member: MemberResolver,
        },
      },
    ],
  },
];

@NgModule({
  declarations: [
    MemberComponent,
    MemberListComponent,
    MemberViewComponent,
    FormatGenderPipe,
    FormatActivePipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
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
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: 'member' },
    MemberSettingResolver,
  ],
})
export class MemberModule {}
