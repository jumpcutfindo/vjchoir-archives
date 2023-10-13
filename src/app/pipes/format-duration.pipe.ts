import { Pipe, PipeTransform } from '@angular/core';

export const FORMAT_HOUR_MIN = "h:m";
export const FORMAT_MIN_SEC = "m:s";

@Pipe({name: 'formatDuration'})
export class FormatDurationPipe implements PipeTransform {
  zeroPad = (num, places) => String(num).padStart(places, '0');

  transform(duration: number, format: string = FORMAT_MIN_SEC, ): string {
    let hours, minutes, seconds;

    switch (format) {
    case FORMAT_HOUR_MIN:
      hours = Math.floor(duration / 3600);
      minutes = Math.floor((duration % 3600) / 60);
      return this.zeroPad(hours, 2) + "H " + this.zeroPad(minutes, 2) + "M";
    default:
      minutes = Math.floor(duration / 60);
      seconds = Math.floor(duration % 60);
      return this.zeroPad(minutes, 2) + ":" + this.zeroPad(seconds, 2);
    }
  }
}

@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {
  transform(duration: number): string {
    const formatter = new Intl.DateTimeFormat('en-gb', { month: 'long' });
    const date = new Date(duration);
    return `${date.getDate()} ${formatter.format(date)} ${date.getFullYear()}`
  }
}