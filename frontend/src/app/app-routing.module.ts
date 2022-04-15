import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { InitialDataResolver } from './app.resolvers';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { NoAuthGuard } from './core/auth/guards/noAuth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
  {
    path: 'signed-in-redirect',
    pathMatch: 'full',
    redirectTo: 'people',
  },
  {
    path: 'sign-in',
    loadChildren: () =>
      import('./modules/auth/sign-in/sign-in.module').then(
        (m) => m.AuthSignInModule
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'people',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    resolve: {
      initialData: InitialDataResolver,
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/people/people.module').then((m) => m.PeopleModule),
      },
    ],
  },
  {
    path: 'members',
    loadChildren: () =>
      import('./modules/member/member.module').then((m) => m.MemberModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
