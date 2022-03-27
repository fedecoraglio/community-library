import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { map, take, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';

import { PeopleService } from '../people.service';
import { CreateUserRequestDto, UpdateUserRequestDto } from '../people.dtos';
import { UserDto } from '../../../core/user/user.dtos';
import { UserService } from '../../../core/user/user.service';
import { emailValidator } from '../../../core/validators/email.validator';

@Component({
  selector: 'people-details',
  templateUrl: 'people-details.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class PeopleDetailsComponent {
  private readonly _unsubscribe$: Subject<any> = new Subject<any>();

  user: UpdateUserRequestDto & {
    id: string;
  };
  currentUser: UserDto;
  userForm: FormGroup;
  showPermissionsField = false;
  createMode = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly peopleService: PeopleService,
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    public route: ActivatedRoute,
    public location: Location,
    private readonly matSnackBar: MatSnackBar,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit() {
    // Get currently logged user
    // We need that to ensure you do not block/delete yourself
    this.userService.user$
      .pipe(take(1), takeUntil(this._unsubscribe$))
      .subscribe((user) => {
        this.currentUser = user;
      });

    this.activatedRoute.queryParams
      .pipe(
        map((params) => params.add),
        takeUntil(this._unsubscribe$)
      )
      .subscribe((add: string) => {
        const isModeCreate = add === 'true';

        this.createMode = isModeCreate;

        this.initForm();
        isModeCreate ? this.userForm.reset() : this.setUserModeEdit();
      });
  }

  initForm() {
    // Create the user form
    this.userForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, emailValidator]],
      password: this.createMode
        ? [null, [Validators.required, Validators.minLength(8)]]
        : [null, [Validators.minLength(8)]],
    });
  }

  ngOnDestroy() {
    this._unsubscribe$.next({});
    this._unsubscribe$.complete();
  }

  setUserModeEdit() {
    // Get the user
    this.peopleService.user$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((user: UserDto) => {
        // Open the drawer in case it is closed
        this.user = {
          ...user,
        };

        // Patch values to the form
        if (!this.createMode) {
          this.userForm.patchValue(this.user);
        }
      });
  }

  createUser() {
    const userForm: CreateUserRequestDto = {
      password: this.userForm.get('password').value,
      name: this.userForm.get('name').value,
      email: this.userForm.get('email').value,
    };

    this.peopleService
      .createUser(userForm)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe({
        next: () => {
          this.navigateToUsers();
        },
        error: (response) => {
          this.matSnackBar.open(
            `${this.translate('alert_error_updated_user_people')} ${
              response?.error?.message ||
              this.translate('text_unknown_error_people')
            }`,
            null,
            {
              duration: 3000,
            }
          );
        },
      });
  }

  navigateToUsers() {
    this.router.navigate(['/people']);
  }

  updateUser() {
    if (this.userForm.invalid) {
      return;
    }

    let user = this.userForm.getRawValue() as UpdateUserRequestDto & {
      id: string;
    };

    if (!this.userForm.get('password').value) {
      const { password, ...rest } = user;

      user = rest;
    }

    user = {
      ...user,
    };

    this.peopleService
      .updateUser(user.id, user)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe({
        next: () => {
          this.router.navigate(['/people']);
        },
        error: (response) => {
          this.matSnackBar.open(
            `${this.translate('alert_error_updated_user_people')} ${
              response?.error?.message ||
              this.translate('text_unknown_error_people')
            }`,
            null,
            {
              duration: 4000,
            }
          );
        },
      });
  }

  translate(key: string): string {
    return this.translocoService.translate(`people.${key}`);
  }

  trackByFn(index: number, item: any) {
    return item.id || index;
  }
}
