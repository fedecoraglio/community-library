import { AbstractControl, ValidationErrors } from '@angular/forms';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { trim } from 'lodash-es';

export function phoneNumberValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const phone = trim(control.value);

  if (phone.length === 0) {
    return null;
  }

  if (phone.length < 15) {
    return {
      invalidPhoneNumber: true,
    };
  }

  return phoneUtil.isValidNumber(phoneUtil.parse(phone))
    ? null
    : {
        invalidPhoneNumber: true,
      };
}
