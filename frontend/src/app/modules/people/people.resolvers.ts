import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { PeopleService } from './people.service';
import { Observable, throwError } from 'rxjs';
import { GetUsersResponseDto } from './people.dtos';
import { catchError, map, take } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { UserDto } from '../../core/user/user.dtos';

@Injectable({
  providedIn: 'root',
})
export class PeopleResolver implements Resolve<any> {
  constructor(private readonly usersService: PeopleService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<GetUsersResponseDto> {
    return this.usersService.fetchPeople({
      page: 1,
      pageSize: PeopleService.LIMIT_PER_PAGE,
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<any> {
  constructor(
    private readonly peopleService: PeopleService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{
    user: UserDto;
  }> {
    return this.peopleService.fetchUserById(route.paramMap.get('id')).pipe(
      catchError((error) => {
        const parentUrl = state.url.split('/').slice(0, -1).join('/');

        this.router.navigateByUrl(parentUrl);

        return throwError(error);
      }),
      map((user) => ({
        user,
      }))
    );
  }
}

@Injectable()
export class PeopleSettingResolver implements Resolve<string> {
  constructor(private readonly translocoService: TranslocoService) {}

  resolve(): Observable<string> {
    return this.translocoService
      .selectTranslate('load', {}, { scope: 'people' })
      .pipe(take(1));
  }
}
