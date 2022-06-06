import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatDuration'})
export class FormatDurationPipe implements PipeTransform {
  zeroPad = (num, places) => String(num).padStart(places, '0');

  transform(duration): string {
    const minutes = duration / 60;
    const seconds = duration % 60;
  
    return this.zeroPad(minutes, 2) + ":" + this.zeroPad(seconds, 2);
  }
}