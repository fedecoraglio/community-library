import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  takeUntil,
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { MemberService } from '../member.service';
import { MemberDto } from '../member.dtos';
import { LoaderService } from '../../../core/loader/loader.service';

@Component({
  selector: 'member-list',
  templateUrl: 'member-list.component.html',
})
export class MemberListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  memberDataSource = new MatTableDataSource<MemberDto>([]);
  memberTotal = 0;
  readonly pageSizeOptions = [MemberService.LIMIT_PER_PAGE, 60, 200];
  readonly searchInputControl: FormControl = new FormControl();
  readonly displayedColumns = [
    'uid',
    'name',
    'email',
    'phone',
    'active',
    'edit',
  ];

  private searchValue: string | null;
  private readonly members$ = this.memberService.members$;
  private readonly memberTotal$ = this.memberService.memberTotal$;
  private readonly _unsubscribe$ = new Subject<any>();

  constructor(
    private readonly loaderService: LoaderService,
    private readonly memberService: MemberService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.configSearch();
    this.searchValue = null;
    this.loaderService.showLoading();
    this.loadMembers();
  }

  ngOnDestroy() {
    this._unsubscribe$.next({});
    this._unsubscribe$.complete();
  }

  ngAfterViewInit() {
    this.memberDataSource.paginator = this.paginator;
    this.paginator.page
      .pipe(
        takeUntil(this._unsubscribe$),
        switchMap(() => {
          return this.memberService.fetchMembers({
            page: this.paginator.pageIndex + 1,
            pageSize: this.paginator.pageSize,
            query: this.searchValue,
          });
        })
      )
      .subscribe(() => {});
  }

  navigateToCreateMember() {
    this.router.navigate(['/members/create'], {
      queryParams: {
        add: true,
      },
    });
  }

  navigateToEditMember(id: string) {
    this.router.navigate([`/members/${id}`]);
  }

  private loadMembers() {
    this.memberTotal$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((total: number) => {
        this.memberTotal = total;
      });

    this.members$.pipe(takeUntil(this._unsubscribe$)).subscribe({
      next: (members: MemberDto[]) => {
        this.memberDataSource = new MatTableDataSource<MemberDto>(members);
        this.loaderService.hideLoading();
      },
      error: () => {
        this.loaderService.hideLoading();
      },
    });

    this.memberService
      .fetchMembers({ page: 1, pageSize: MemberService.LIMIT_PER_PAGE })
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(() => {});
  }

  private configSearch() {
    this.searchInputControl.valueChanges
      .pipe(
        filter<string>((query) => query.length > 0 || query.length === 0),
        debounceTime(200),
        distinctUntilChanged(),
        takeUntil(this._unsubscribe$),
        tap(() => (this.paginator.pageIndex = 0)),
        switchMap((query) => {
          this.searchValue = query;
          this.loaderService.showLoading();
          return this.memberService.fetchMembers({
            page: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            query,
          });
        })
      )
      .subscribe({
        next: () => {
          this.loaderService.hideLoading();
        },
        error: () => {
          this.loaderService.hideLoading();
        },
      });
  }
}
