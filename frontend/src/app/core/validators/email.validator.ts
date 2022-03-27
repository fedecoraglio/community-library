import { AbstractControl, ValidationErrors } from '@angular/forms';

export function emailValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const email = control.value || '';

  if (email.length === 0) {
    return null;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? null
    : {
        invalidEmail: true,
      };
}
