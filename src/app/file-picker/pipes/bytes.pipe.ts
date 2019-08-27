import { Pipe, PipeTransform } from '@angular/core';

const bytesMap = [
  { min: 0, max: 9, suffix: ' b' },
  { min: 10, max: 19, suffix: ' kB' },
  { min: 20, max: 29, suffix: ' MB' },
  { min: 30, max: 39, suffix: ' GB' },
  { min: 40, max: 49, suffix: ' TB' },
];

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

@Pipe({
  name: 'bytes'
})
export class BytesPipe implements PipeTransform {

  private static roundBytes(value: number, pow: number) {
    return (value / Math.pow(2, pow)).toFixed(2);
  }

  transform(value: number | undefined): string {
    if (isNumber(value)) {
      if (value > 0) {
        const lg2 = Math.log2(value);
        for (const map of bytesMap) {
          if (lg2 >= map.min && lg2 <= map.max) {
            return BytesPipe.roundBytes(value, map.min) + map.suffix;
          }
        }
      }

      return value === 0 ? value + ' b' : value.toString();
    }

    return '';
  }
}
