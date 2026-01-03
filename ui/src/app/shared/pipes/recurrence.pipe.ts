import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'recurrence',
  standalone: true,
})
export class RecurrencePipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(value: string | undefined | null): Observable<string> {
    if (!value) return of('');

    const freqMatch = value.match(/FREQ=(\w+)/i);
    const intervalMatch = value.match(/INTERVAL=(\d+)/i);

    const freq = freqMatch ? freqMatch[1].toUpperCase() : '';
    const interval = intervalMatch ? parseInt(intervalMatch[1], 10) : 1;

    if (!freq) return of(value);

    const suffix = interval === 1 ? 'SIMPLE' : 'COMPLEX';
    const key = `RECURRENCE.${freq}.${suffix}`;

    return this.translate.stream(key, { count: interval });
  }
}
