import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private readonly _showLoadingProcessBar$ = new Subject<boolean>();

  constructor() {}

  get showLoadingProcessBar$() {
    return this._showLoadingProcessBar$.asObservable();
  }

  showLoading() {
    setTimeout(() => {
      this._showLoadingProcessBar$.next(true);
    });
  }

  hideLoading() {
    setTimeout(() => {
      this._showLoadingProcessBar$.next(false);
    });
  }
}
