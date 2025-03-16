import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
    transform(array: any[], field: string, direction: string = 'asc'): any[] {
        if (!array || !field) {
            return array;
        }
        const multiplier = direction === 'asc' ? 1 : -1;
        return array.sort((a, b) => {
            const valA = a[field];
            const valB = b[field];
            if (valA < valB) return -1 * multiplier;
            if (valA > valB) return 1 * multiplier;
            return 0;
        });
    }
}
