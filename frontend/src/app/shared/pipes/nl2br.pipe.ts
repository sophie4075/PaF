import { Pipe, PipeTransform } from '@angular/core';

@Pipe({standalone: true, name: 'nl2br'})
export class Nl2brPipe implements PipeTransform {
    transform(value: string | undefined): string {
        if (!value) return '';
        return value.replace(/\n/g, '<br />');
    }
}
