import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, switchMap, throwError } from 'rxjs';
import { LoginResponseDto } from './auth.dtos';
import { UserService } from '../user/user.service';
import { AuthUtils } from './auth.utils';

@Injectable()
export class AuthService {
  private _authenticated = false;
  private readonly _loginSuccessfully$ = new Subject<boolean>();

  constructor(
    private _httpClient: HttpClient,
    private readonly userService: UserService
  ) {}

  get loginSuccessfully$() {
    return this._loginSuccessfully$.asObservable();
  }

  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  signIn(credentials: { email: string; password: string }): Observable<any> {
    // Throw error, if the user is already logged in
    if (this._authenticated) {
      return throwError('User is already logged in.');
    }
    return this._httpClient.post('v1/login', credentials).pipe(
      switchMap((response: LoginResponseDto) => {
        // Store the access token in the local storage
        this.accessToken = response.access_token;

        // Set the authenticated flag to true
        this._authenticated = true;

        // Store the user on the user service
        this.userService.user = response.user;

        // Return a new observable with the response
        return of(response);
      })
    );
  }

  signOut(): Observable<any> {
    // Remove the access token from the local storage
    localStorage.removeItem('accessToken');
    localStorage.clear();

    // Set the authenticated flag to false
    this._authenticated = false;

    // Return the observable
    return of(true);
  }
}
