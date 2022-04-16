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
import { LoaderService } from '../../../core/loader/loader.service';

@Component({
  selector: 'member-view',
  templateUrl: 'member-view.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MemberViewComponent {
  member: MemberDto & { id: string };
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
    private readonly translocoService: TranslocoService,
    private readonly loaderService: LoaderService
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
    if (this.memberForm.invalid || this.waitToProcess) {
      return;
    }
    this.loaderService.showLoading();
    this.waitToProcess = true;
    const member = this.memberForm.getRawValue() as MemberDto & {
      id: string;
    };

    this.memberService
      .updateMember(this.member.id, member)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe({
        next: () => {
          this.matSnackBar.open(`El socio se guardo con éxito`, null, {
            duration: 3000,
          });
          this.router.navigate(['/members']);
          this.waitToProcess = false;
          this.loaderService.hideLoading();
        },
        error: (response) => {
          this.matSnackBar.open(
            `${this.translate('alert_error_updated_member')} ${
              response?.error?.message ||
              this.translate('text_unknown_error_member')
            }`,
            null,
            {
              duration: 4000,
            }
          );
          this.waitToProcess = false;
          this.loaderService.hideLoading();
        },
      });
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
    this.memberService.member$.pipe(takeUntil(this._unsubscribe$)).subscribe({
      next: (member: MemberDto) => {
        this.member = {
          ...member,
        };

        if (!this.createMode) {
          this.memberForm.patchValue(this.member);
        }
        this.loaderService.hideLoading();
      },
      error: () => {
        this.loaderService.hideLoading();
      },
    });
  }
}
