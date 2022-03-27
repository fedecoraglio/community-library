import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { ErrorCode } from '../../../core/http/error-code';
import { LoaderService } from '../../../core/loader/loader.service';
import { emailValidator } from '../../../core/validators/email.validator';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AuthSignInComponent implements OnInit, OnDestroy {
  signInForm: FormGroup;
  private readonly _unsubscribe$ = new Subject<any>();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly matSnackBar: MatSnackBar,
    private readonly translocoService: TranslocoService,
    private readonly loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    // Create the form
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, emailValidator]],
      password: ['', Validators.required],
    });
  }

  ngOnDestroy() {
    this._unsubscribe$.next(1);
    this._unsubscribe$.complete();
  }

  signIn() {
    // Return if the form is invalid
    if (this.signInForm.invalid) {
      return;
    }
    const data = this.signInForm.getRawValue();

    // Disable the form
    this.signInForm.disable();
    this.loaderService.showLoading();
    // Sign in
    this.authService
      .signIn(data)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe({
        next: () => {
          this.loaderService.hideLoading();
          const redirectURL =
            this.activatedRoute.snapshot.queryParamMap.get('redirectURL') ||
            '/signed-in-redirect';

          // Navigate to the redirect url
          this.router.navigateByUrl(redirectURL);
        },
        error: (response) => {
          this.loaderService.hideLoading();
          const { error } = response;
          let message: string;

          switch (error.code) {
            case ErrorCode.UserNotFound:
              message = this.translocoService.translate(
                'text_user_not_found_auth'
              );
              break;
            case ErrorCode.PasswordsNotMatch:
              message = this.translocoService.translate(
                'text_pass_not_match_auth'
              );
              break;
            default:
              message = this.translocoService.translate(
                'text_error_has_occurred_auth'
              );
          }

          // Re-enable the form
          this.signInForm.enable();
          this.matSnackBar.open(message, null, {
            duration: 3500,
            verticalPosition: 'bottom',
          });
        },
      });
  }
}
