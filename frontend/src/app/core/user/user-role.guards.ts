import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleAdministratorGuard implements CanActivate {
  constructor(private userService: UserService) {}

  canActivate(): Observable<UrlTree | boolean> {
    return this.userService.isAdministrator$.pipe(take(1));
  }
}

@Injectable({
  providedIn: 'root',
})
export class RoleUserGuard implements CanActivate {
  constructor(private userService: UserService) {}

  canActivate(): Observable<UrlTree | boolean> {
    return this.userService.isAdministrator$.pipe(
      take(1),
      map(isAdministrator => !isAdministrator),
    );
  }
}
