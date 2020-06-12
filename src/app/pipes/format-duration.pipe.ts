import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({name: 'formatDuration'})
export class FormatDurationPipe implements PipeTransform {
  transform(duration): string {
    const time = moment()
      .seconds(duration.seconds())
      .minutes(duration.minutes());

    return time.format('mm:ss');
  }
}