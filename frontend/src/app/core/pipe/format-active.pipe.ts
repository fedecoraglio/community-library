import { Pipe, PipeTransform } from '@angular/core';

export function activeToString(active: boolean): string {
  return active ? 'Si' : 'No';
}

@Pipe({
  name: 'formatActive',
})
export class FormatActivePipe implements PipeTransform {
  transform(active: boolean): string {
    return activeToString(active);
  }
}
