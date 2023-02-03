import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'datetime'
})
export class DatetimePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return format(new Date(value * 1000), 'd MMM HH:mm')
  }

}
