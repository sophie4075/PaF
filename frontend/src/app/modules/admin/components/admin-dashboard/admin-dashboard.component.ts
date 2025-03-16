import {Component, inject, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {AdminRentalInfoDto, AdminService} from "../../service/admin.service";
import {DatePipe, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {
  MatExpansionPanelHeader,
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {FilterPipe} from "../../../../shared/pipes/filter.pipe";
import {
  UpdateRentalPeriodComponent
} from "../../../../shared/components/dashboard/update-rental-period/update-rental-period.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OrderByPipe} from "../../../../shared/pipes/oder.pipe";
import {
  SortableHeaderComponent
} from "../../../../shared/components/dashboard/sortable-header/sortable-header.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatAccordion,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatProgressSpinner,
    FilterPipe,
    NgForOf,
    OrderByPipe,
    SortableHeaderComponent
  ],
  template: `
    
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="overflow-auto shadow-md rounded py">

        <div class="flex justify-between items-center m-4">
          <h1 class="text-xl font-bold">Items in rental</h1>
          <input
              [(ngModel)]="searchTerm"
              placeholder="Search..."
              class="border p-2 rounded w-1/3 bg-transparent" />
        </div>

        @if (currentRentals.length){

          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text xs text-gray-700 uppercase">
            <tr class="text-nowrap flex justify-between items-center">
              <app-sortable-header label="Artikel" field="articleDesignation"
                                   [sortField]="sortField" [sortDirection]="sortDirection"
                                   (sort)="onSortChange($event)">
              </app-sortable-header>
              <app-sortable-header label="Inventory Number" field="articleInstanceInventoryNumber"
                                   [sortField]="sortField" [sortDirection]="sortDirection"
                                   (sort)="onSortChange($event)">
              </app-sortable-header>
              <app-sortable-header label="Rental End" field="rentalEnd"
                                   [sortField]="sortField" [sortDirection]="sortDirection"
                                   (sort)="onSortChange($event)">
              </app-sortable-header>
              <app-sortable-header label="Rented by" field="userLastName"
                                   [sortField]="sortField" [sortDirection]="sortDirection"
                                   (sort)="onSortChange($event)">
              </app-sortable-header>
              <th class="px-3 py-2">Aktionen</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let rental of paginatedRentals()" class="border-b flex justify-between items-center">
              <td class="px-3 py-2">{{ rental.articleDesignation }}</td>
              <td class="px-3 py-2">{{ rental.articleInstanceInventoryNumber }}</td>
              <td class="px-3 py-2">
                {{ rental.rentalStart | date:'dd.MM.yyyy' }} - {{ rental.rentalEnd | date:'dd.MM.yyyy' }}
              </td>
              <td class="px-3 py-2">
                {{ rental.userFirstName }} {{ rental.userLastName }}
              </td>
              <td class="px-3 py-2">
                <button (click)="openEditDialog(rental)" class="text-blue-500 hover:underline">
                  Bearbeiten
                </button>
              </td>
            </tr>
            </tbody>
          </table>

          <div class="flex justify-center items-center mt-4 text-sm mb-4">
            <button class="px-3 py-1 bg-gray-200 rounded mr-1.5" [disabled]="currentPage === 1" (click)="prevPage()">Zurück</button>
            <span>Seite {{ currentPage }} von {{ totalPages() }}</span>
            <button class="px-3 py-1 bg-gray-200 rounded ml-1.5" [disabled]="currentPage === totalPages()" (click)="nextPage()">Weiter</button>
          </div>

        } @else {
          <p class="text-gray-700 text-base italic">No instances are currently borrowed</p>
        }
        
      </div>
      
    </div>

    

  `,
})
export class AdminDashboardComponent implements OnInit{

  currentRentals: AdminRentalInfoDto[] = [];
  dueRentals: AdminRentalInfoDto[] = [];
  upcomingUnderRepair: AdminRentalInfoDto[] = [];
  private _snackBar = inject(MatSnackBar);

  selectedSort: string = '';
  searchTerm: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' | null = null;

  itemsPerPage = 10;
  currentPage = 1;



  constructor(private adminService: AdminService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadCurrentRentals();
    this.loadUpcomingUnderRepair();
    this.loadDueRentals();

    this.sortField = 'rentalEnd';
    this.sortDirection = 'asc';
  }

  loadCurrentRentals() {
    this.adminService.getCurrentRentals().subscribe((data) => {
      this.currentRentals = data;
      console.log(this.currentRentals)
    });
  }

  loadDueRentals() {
    this.adminService.getDueRentals().subscribe((data) => {
      this.dueRentals = data;
    });
  }

  loadUpcomingUnderRepair() {
    this.adminService.getUpcomingUnderRepairRentals().subscribe((data) => {
      this.upcomingUnderRepair = data;
    });
  }

  onUpdateRentalPeriod(rental: AdminRentalInfoDto) {
    if (!rental.newRentalEnd) { return; }
    const formattedNewEnd = this.adminService.formatToLocalDate(rental.newRentalEnd);
    console.log(formattedNewEnd)
    this.adminService.updateRentalPeriod(rental.rentalPositionId, formattedNewEnd)
        .subscribe(updated => {
          rental.rentalEnd = updated.rentalEnd;
        });
  }

  openEditDialog(rental: AdminRentalInfoDto) {
    const dialogRef = this.dialog.open(UpdateRentalPeriodComponent, {
      data: { rental }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.newRentalEnd) {
        const formattedNewEnd = this.adminService.formatToLocalDate(result.newRentalEnd);
        this.adminService.updateRentalPeriod(rental.rentalPositionId, formattedNewEnd)
            .subscribe({
              next: updated => {
                rental.rentalEnd = updated.rentalEnd;
                this._snackBar.open('Rental period updated ', ' 🎉', { duration: 3000 });
              },
              error: err => {
                if (err.status === 409) {
                  this._snackBar.open('Rental period cannot be adjusted as there are overlaps.', 'OK 🤖', { duration: 5000 });
                } else {
                  const errorMessage = err.error?.message || 'An error occurred';
                  this._snackBar.open(`Error: ${errorMessage}`, '🤖', {
                    duration: 5000,
                  });
                }
              }}
            );
      }
    });
  }

  onSortChange(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  filteredRentals(): AdminRentalInfoDto[] {
    return this.currentRentals.filter(rental => {
      const term = this.searchTerm.toLowerCase();
      return rental.articleDesignation.toLowerCase().includes(term)
          || rental.articleInstanceInventoryNumber.toLowerCase().includes(term);
    });
  }

  sortedRentals(): AdminRentalInfoDto[] {
    const rentals = [...this.filteredRentals()];
    if (this.sortField && this.sortDirection) {
      rentals.sort((a, b) => {
        let valA: any, valB: any;

        if (this.sortField === 'name') {
          valA = `${a.userFirstName} ${a.userLastName}`.toLowerCase();
          valB = `${b.userFirstName} ${b.userLastName}`.toLowerCase();
        } else if (this.sortField === 'rentalEnd') {
          valA = new Date(a.rentalEnd);
          valB = new Date(b.rentalEnd);
        } else {
          valA = (a as any)[this.sortField]?.toLowerCase?.() ?? (a as any)[this.sortField];
          valB = (b as any)[this.sortField]?.toLowerCase?.() ?? (b as any)[this.sortField];
        }

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return rentals;
  }


  paginatedRentals(): AdminRentalInfoDto[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.combinedRentals().slice(start, start + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.sortedRentals().length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }


  onStatusChange(){
    console.log("click")
  }

  combinedRentals(): AdminRentalInfoDto[] {
    let filtered = this.currentRentals;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(rental =>
          rental.articleDesignation.toLowerCase().includes(term) ||
          rental.articleInstanceInventoryNumber.toLowerCase().includes(term) ||
          rental.userFirstName.toLowerCase().includes(term) ||
          rental.userLastName.toLowerCase().includes(term)
      );
    }

    if (this.sortField && this.sortDirection) {
      filtered.sort((a, b) => {
        const valA = (a as any)[this.sortField];
        const valB = (b as any)[this.sortField];
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }





}
