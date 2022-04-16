import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import {
  CreateMemberRequestDto,
  GetMemberRequestDto,
  GetMemberResponseDto,
  MemberDto,
} from './member.dtos';
import { query } from '@angular/animations';

@Injectable({ providedIn: 'root' })
export class MemberService {
  static LIMIT_PER_PAGE = 5;

  private readonly _members$ = new BehaviorSubject<MemberDto[]>([]);
  private readonly _memberTotal$ = new BehaviorSubject<number>(0);
  private readonly _member$ = new BehaviorSubject<MemberDto>(null);

  get members$(): Observable<MemberDto[]> {
    return this._members$.asObservable();
  }

  get memberTotal$(): Observable<number> {
    return this._memberTotal$.asObservable();
  }

  get member$(): Observable<MemberDto> {
    return this._member$.asObservable();
  }

  constructor(private readonly http: HttpClient) {}

  fetchMembers(param: GetMemberRequestDto): Observable<GetMemberResponseDto> {
    const option: any = {
      page: param.page || 1,
      pageSize: param.pageSize || MemberService.LIMIT_PER_PAGE,
    };
    if (param.query) {
      option.query = param.query;
    }
    console.log(option);
    return this.http
      .get<GetMemberResponseDto>('v1/members', { params: option })
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
    return this.http.post<MemberDto>(`v1/members`, member);
  }

  updateMember(id: string, member: Partial<MemberDto>): Observable<MemberDto> {
    return this.http.put<MemberDto>(`v1/members/${id}`, member);
  }
}
