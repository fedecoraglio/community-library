import {
  Component,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { PeopleService } from '../people.service';
import { map, takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { of, Subject } from 'rxjs';
import { UserService } from '../../../core/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'people-list-admins',
  templateUrl: 'people-list-admins.component.html',
})
export class PeopleListAdminsComponent implements OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  readonly people$ = this.peopleService.people$;
  readonly peopleTotal$ = this.peopleService.peopleTotal$;
  readonly currentUserId$ = this.userService.user$.pipe(map((user) => user.id));
  readonly displayedColumns = ['name', 'email', 'edit'];
  canEditAdmins$ = of(true); //this.userService.hasPermissions(Permission.EditAdmins);
  private readonly _unsubscribe$ = new Subject<any>();

  constructor(
    private readonly peopleService: PeopleService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this._unsubscribe$.next({});
    this._unsubscribe$.complete();
  }

  onPageChange() {
    const pageSize = this.paginator.pageSize || PeopleService.LIMIT_PER_PAGE;
    const page = this.paginator.pageIndex + 1;

    this.peopleService
      .fetchPeople({
        pageSize: pageSize,
        page,
      })
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(() => {});
  }

  navigateToCreateUser() {
    this.router.navigate(['/people/create'], {
      queryParams: {
        add: true,
      },
    });
  }

  navigateToEditUser(id: string) {
    this.router.navigate([`/people/${id}`]);
  }
}
