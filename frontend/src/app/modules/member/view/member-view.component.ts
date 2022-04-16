import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, takeUntil, tap, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';

import { emailValidator } from '../../../core/validators/email.validator';
import { CreateMemberRequestDto, MemberDto } from '../member.dtos';
import { MemberService } from '../member.service';
import { Gender } from '../../../core/user/gender';
import { getEnumValues } from '../../../core/util/get-enum-values';

@Component({
  selector: 'member-view',
  templateUrl: 'member-view.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MemberViewComponent {
  member: MemberDto;
  memberForm: FormGroup;
  createMode = false;
  waitToProcess = false;
  maxBirthdayDate = new Date();
  readonly genders: Gender[] = getEnumValues(Gender);

  private readonly _unsubscribe$: Subject<any> = new Subject<any>();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly memberService: MemberService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly matSnackBar: MatSnackBar,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(
        map((params) => params.add),
        takeUntil(this._unsubscribe$)
      )
      .subscribe((add: string) => {
        const isModeCreate = add === 'true';

        this.createMode = isModeCreate;

        this.initForm();
        isModeCreate ? this.memberForm.reset() : this.setMemberEditMode();
      });
  }

  ngOnDestroy() {
    this._unsubscribe$.next({});
    this._unsubscribe$.complete();
  }

  createMember() {
    if (!this.waitToProcess) {
      this.waitToProcess = true;
      const memberRequest: CreateMemberRequestDto = {
        ...this.memberForm.getRawValue(),
      };
      this.memberService
        .createMember(memberRequest)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe({
          next: () => {
            this.matSnackBar.open(`El socio se guardo con éxito`, null, {
              duration: 3000,
            });
            this.navigateToMembers();
            this.waitToProcess = false;
          },
          error: (response) => {
            this.matSnackBar.open(
              `${this.translate('alert_error_updated_member')} ${
                response?.error?.message ||
                this.translate('text_unknown_error_member')
              }`,
              null,
              {
                duration: 3000,
              }
            );
            this.waitToProcess = false;
          },
        });
    }
  }

  navigateToMembers() {
    this.router.navigate(['/members']);
  }

  updateMember() {
    /**if (this.userForm.invalid) {
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
      });**/
  }

  trackByFn(index: number, item: any) {
    return item.id || index;
  }

  private translate(key: string): string {
    return this.translocoService.translate(`member.${key}`);
  }

  private initForm() {
    // Create the user form
    this.memberForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [emailValidator]],
      address: [null, []],
      gender: [null, []],
      birthday: [null, []],
      phone: [null, []],
    });
  }

  private setMemberEditMode() {
    // Get the user
    /**this.memberService.members$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((user: UserDto) => {
        // Open the drawer in case it is closed
        this.member = {
          ...user,
        };

        // Patch values to the form
        if (!this.createMode) {
          this.userForm.patchValue(this.user);
        }
      });**/
  }
}
