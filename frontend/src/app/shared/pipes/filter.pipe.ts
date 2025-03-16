import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'rentalFilter'
})
export class FilterPipe implements PipeTransform {
    transform(rentals: any[], searchTerm: string): any[] {
        if (!rentals) return [];
        if (!searchTerm) return rentals;
        searchTerm = searchTerm.toLowerCase();
        return rentals.filter(rental =>
            rental.articleDesignation.toLowerCase().includes(searchTerm) ||
            rental.articleInstanceInventoryNumber.toLowerCase().includes(searchTerm) ||
            rental.userFirstName.toLowerCase().includes(searchTerm) ||
            rental.userLastName.toLowerCase().includes(searchTerm)
        );
    }
}
