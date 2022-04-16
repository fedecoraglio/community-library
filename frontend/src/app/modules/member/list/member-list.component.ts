import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { MemberService } from '../member.service';
import { MatTableDataSource } from '@angular/material/table';
import { MemberDto } from '../member.dtos';

@Component({
  selector: 'member-list',
  templateUrl: 'member-list.component.html',
})
export class MemberListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  memberDataSource = new MatTableDataSource<MemberDto>([]);
  readonly memberTotal$ = this.memberService.memberTotal$;
  readonly displayedColumns = ['uid', 'name', 'email', 'phone', 'edit'];

  private readonly members$ = this.memberService.members$;
  private readonly _unsubscribe$ = new Subject<any>();

  constructor(
    private readonly memberService: MemberService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.loadMembers();
  }

  ngOnDestroy() {
    this._unsubscribe$.next({});
    this._unsubscribe$.complete();
  }

  onPageChange() {
    const pageSize = this.paginator.pageSize || MemberService.LIMIT_PER_PAGE;
    const page = this.paginator.pageIndex + 1;

    this.memberService
      .fetchMembers({
        pageSize: pageSize,
        page,
      })
      .pipe(takeUntil(this._unsubscribe$))
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
    this.memberDataSource.paginator = this.paginator;
    this.members$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((members: MemberDto[]) => {
        this.memberDataSource = new MatTableDataSource<MemberDto>(members);
      });

    this.memberService
      .fetchMembers({ page: 1, pageSize: MemberService.LIMIT_PER_PAGE })
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(() => {});
  }
}
