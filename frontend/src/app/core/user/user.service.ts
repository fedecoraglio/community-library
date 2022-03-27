import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { UserDto } from './user.dtos';
import { UpdateUserRequestDto } from '../../modules/people/people.dtos';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user: ReplaySubject<UserDto> = new ReplaySubject<UserDto>(1);

  constructor(private _httpClient: HttpClient) {}

  set user(value: UserDto) {
    this._user.next(value);
  }

  get user$(): Observable<UserDto> {
    return this._user.asObservable();
  }

  get isAdministrator$(): Observable<boolean> {
    return of(true);
  }

  getCurrentUser(): Observable<UserDto> {
    return this._httpClient.get<UserDto>('v1/users/me').pipe(
      tap((user) => {
        this._user.next(user);
      })
    );
  }

  update(user: UpdateUserRequestDto): Observable<any> {
    return this._httpClient.post<UserDto>('v1/users/me', user).pipe(
      map((response) => {
        this._user.next(response);
      })
    );
  }

  hasPermissions(...requiredPermissions): Observable<boolean> {
    return this.user$.pipe(
      take(1),
      map((user) => true)
    );
  }
}
