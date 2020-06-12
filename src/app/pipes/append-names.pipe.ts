import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'appendNames'})
export class AppendNamesPipe implements PipeTransform {
  transform(value: any[]): string {
    let output: string = "";
    for(let i = 0; i < value.length; i++) {
      if(i != value.length - 1) {
        output += value[i] + ", "
      } else {
        output += value[i]
      }
    }

    return output;
  }
}