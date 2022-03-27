import { Injectable } from '@angular/core';
import { forkJoin, Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

import {
  CreateUserRequestDto,
  GetUsersRequestDto,
  GetUsersResponseDto,
  UpdateUserRequestDto,
} from './people.dtos';
import { UserService } from '../../core/user/user.service';
import { UserDto } from '../../core/user/user.dtos';

@Injectable({ providedIn: 'root' })
export class PeopleService {
  static LIMIT_PER_PAGE = 5;

  private readonly _people$ = new ReplaySubject<UserDto[]>(1);
  private readonly _peopleTotal$ = new ReplaySubject<number>(1);
  private readonly _user$ = new ReplaySubject<UserDto>(1);

  get people$(): Observable<UserDto[]> {
    return this._people$.asObservable();
  }

  get peopleTotal$(): Observable<number> {
    return this._peopleTotal$.asObservable();
  }

  get user$(): Observable<UserDto> {
    return this._user$.asObservable();
  }

  constructor(private readonly http: HttpClient) {}

  fetchPeople(query: GetUsersRequestDto): Observable<GetUsersResponseDto> {
    return this.http
      .get<GetUsersResponseDto>('v1/users', {
        params: {
          page: query.page || 1,
          pageSize: query.pageSize || PeopleService.LIMIT_PER_PAGE,
        },
      })
      .pipe(
        tap((response) => {
          this._people$.next(response.users);
          this._peopleTotal$.next(response.total);
        })
      );
  }

  fetchUserById(id: string): Observable<UserDto> {
    return this.http.get<UserDto>(`v1/users/${id}`).pipe(
      tap((response) => {
        this._user$.next(response);
      })
    );
  }

  createUser(user: CreateUserRequestDto): Observable<UserDto> {
    return this.http.post<UserDto>(`v1/users`, user);
  }

  updateUser(
    id: string,
    user: Partial<UpdateUserRequestDto>
  ): Observable<UserDto> {
    return this.http.put<UserDto>(`v1/users/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return forkJoin([
      this.people$.pipe(take(1)),
      this.peopleTotal$.pipe(take(1)),
    ]).pipe(
      switchMap(([people, peopleTotal]) => {
        return this.http.delete<any>(`v1/users/${id}`).pipe(
          tap(() => {
            const index = people.findIndex((item) => item.id === id);

            people[index] = null;

            this._people$.next(people.filter((user) => user));
            this._peopleTotal$.next(peopleTotal - 1);
          })
        );
      })
    );
  }
}
