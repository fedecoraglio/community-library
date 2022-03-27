import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CanActivatePeopleGuard implements CanActivate {
  /**constructor(
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | UrlTree {
    return this.userService.hasPermissions(Permission.ViewUsers).pipe(
      map((hasPermissions) => {
        return hasPermissions ? true : this.router.createUrlTree(['/404']);
      })
    );
  }**/
  canActivate(): Observable<boolean> {
    return of(true);
  }
}
