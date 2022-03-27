import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './core/auth/auth.service';
import { LoaderService } from './core/loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title = 'library-webapp';
  sideBarOpen = true;
  isLogged = false;
  readonly showLoadingProcessBar$ = this.loaderService.showLoadingProcessBar$;
  private readonly _unsubscribe$ = new Subject<any>();
  constructor(
    readonly location: Location,
    private readonly authService: AuthService,
    private readonly loaderService: LoaderService
  ) {
    location.onUrlChange(() => {
      const token = this.authService.accessToken;
      this.isLogged = token ? true : false;
    });
  }

  ngOnDestroy() {
    this._unsubscribe$.next({});
    this._unsubscribe$.complete();
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
