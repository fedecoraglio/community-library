import { Pipe, PipeTransform } from '@angular/core';
import { Gender } from '../user/gender';

export function genderToString(gender: Gender): string {
  switch (gender) {
    case Gender.Male: {
      return 'Hombre';
    }
    case Gender.Female: {
      return 'Mujer';
    }
    case Gender.Other: {
      return 'Otro';
    }
  }
}

@Pipe({
  name: 'formatGender',
})
export class FormatGenderPipe implements PipeTransform {
  transform(gender: Gender): string {
    return genderToString(gender);
  }
}
