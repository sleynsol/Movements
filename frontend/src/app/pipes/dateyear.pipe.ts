import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'dateyear'
})
export class DatePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return format(new Date(value * 1000), 'dd MMM y')
  }

}
