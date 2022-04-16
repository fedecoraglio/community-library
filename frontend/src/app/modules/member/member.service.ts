import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import {
  CreateMemberRequestDto,
  GetMemberRequestDto,
  GetMemberResponseDto,
  MemberDto,
} from './member.dtos';

@Injectable({ providedIn: 'root' })
export class MemberService {
  static LIMIT_PER_PAGE = 5;

  private readonly _members$ = new ReplaySubject<MemberDto[]>(1);
  private readonly _memberTotal$ = new ReplaySubject<number>(1);
  private readonly _member$ = new ReplaySubject<MemberDto>(1);

  get members$(): Observable<MemberDto[]> {
    return this._members$.asObservable();
  }

  get memberTotal$(): Observable<number> {
    return this._memberTotal$.asObservable();
  }

  get menber$(): Observable<MemberDto> {
    return this._member$.asObservable();
  }

  constructor(private readonly http: HttpClient) {}

  fetchMembers(query: GetMemberRequestDto): Observable<GetMemberResponseDto> {
    return this.http
      .get<GetMemberResponseDto>('v1/members', {
        params: {
          page: query.page || 1,
          pageSize: query.pageSize || MemberService.LIMIT_PER_PAGE,
        },
      })
      .pipe(
        tap((response) => {
          this._members$.next(response.members);
          this._memberTotal$.next(response.total);
        })
      );
  }

  fetchMemberById(id: string): Observable<MemberDto> {
    return this.http.get<MemberDto>(`v1/members/${id}`).pipe(
      tap((response) => {
        this._member$.next(response);
      })
    );
  }

  createMember(member: CreateMemberRequestDto): Observable<MemberDto> {
    console.log('member', member);
    return this.http.post<MemberDto>(`v1/members`, member);
  }
}
