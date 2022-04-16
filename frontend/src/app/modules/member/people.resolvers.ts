import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';

import { UserDto } from '../../core/user/user.dtos';
import { MemberService } from './member.service';
import { MemberDto } from './member.dtos';
import { LoaderService } from '../../core/loader/loader.service';

@Injectable({
  providedIn: 'root',
})
export class MemberResolver implements Resolve<any> {
  constructor(
    private readonly memberService: MemberService,
    private readonly loaderService: LoaderService,
    private readonly router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{
    member: MemberDto;
  }> {
    this.loaderService.showLoading();
    return this.memberService.fetchMemberById(route.paramMap.get('id')).pipe(
      catchError((error) => {
        const parentUrl = state.url.split('/').slice(0, -1).join('/');

        this.router.navigateByUrl(parentUrl);
        this.loaderService.showLoading();
        return throwError(error);
      }),
      map((member) => ({
        member,
      }))
    );
  }
}

@Injectable()
export class MemberSettingResolver implements Resolve<string> {
  constructor(private readonly translocoService: TranslocoService) {}

  resolve(): Observable<string> {
    return this.translocoService
      .selectTranslate('load', {}, { scope: 'member' })
      .pipe(take(1));
  }
}
