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
import {ReturnDialogComponent} from "./return-article/return-dialog/return-dialog.component";
import {MatDivider} from "@angular/material/divider";
import {MatButton} from "@angular/material/button";
import {MatCheckbox} from "@angular/material/checkbox";

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
    SortableHeaderComponent,
    MatDivider,
    MatButton,
    MatCheckbox
  ],
  template: `
    
    <div class="max-w-7xl mx-auto px-4 py-8 min-h-full">
      <div class="py-12">
        
        <div class="mx-auto grid lg:grid-cols-3 gap-2 mb-8">
          <div class="overflow-hidden shadow-md sm:rounded-lg">
            <div class="p-6 text-gray-900">
              <h3 class="text-blue-400 text-2xl font-semibold">
                Due today
              </h3>
              <p class="text-xl">
                @if (dueRentals.length){
                  <p class="text-lg font-extrabold">{{dueRentals.length}} {{dueRentals.length === 1 ? 'item is' : 'items are' }} due today</p>
                } @else {
                  <p class="text-gray-700 text-base italic">No instances are due today</p>
                }
              </p>
              @for(rental of dueRentals; track $index){
                <div class="my-4 flex flex-column lg:flex-row lg:justify-between items-center gap-1.5">
                  <div>
                    <p class="text-sm text-gray-900">{{ rental.articleDesignation }} {{ rental.articleInstanceInventoryNumber }}</p>
                    <p class="text-xs text-gray-700">rented by {{ rental.userFirstName }} {{ rental.userLastName }}</p>
                  </div>
                  
                  <mat-checkbox
                      (change)="openReturnDialog(rental)"
                      [checked]="checkboxStates[rental.rentalPositionId] || false"
                      class="text-sm text-gray-900"
                  >
                    Returned
                  </mat-checkbox>
                  <mat-divider></mat-divider>
                </div>
              }
            </div>
          </div>
          <div class="overflow-hidden shadow-md sm:rounded-lg">
            <div class="p-6 text-gray-900">
              <h3 class="text-red-500 text-2xl font-semibold">
                Due today
              </h3>
              <p class="text-xl">
                @if (overDueRentals.length){
                  <p class="text-lg font-extrabold">{{overDueRentals.length}} {{overDueRentals.length === 1 ? 'item is' : 'items are' }} overdue</p>
                } @else {
                  <p class="text-gray-700 text-base italic">No instances are overdue!</p>
                }
              </p>
              @for(rental of overDueRentals; track $index){
                <div class="my-4 flex flex-column lg:flex-row lg:justify-between items-center gap-1.5">
                  <div>
                    <p class="text-sm text-gray-900">{{ rental.articleDesignation }} {{ rental.articleInstanceInventoryNumber }}</p>
                    <p class="text-xs text-gray-700">rented by {{ rental.userFirstName }} {{ rental.userLastName }}</p>
                  </div>

                  <mat-checkbox
                      (change)="openReturnDialog(rental)"
                      class="text-sm text-gray-900"
                  >
                    Returned
                  </mat-checkbox>
                  <mat-divider></mat-divider>
                </div>
              }
            </div>
          </div>
          <div class="overflow-hidden shadow-md sm:rounded-lg">
            <div class="p-6 text-gray-900">
              <h3 class="text-rose-400 text-2xl font-semibold">
                Under Repair
              </h3>
              <p class="text-xl mb-y">
                @if (underRepairRentals.length){
                  <p class="text-lg font-extrabold">{{underRepairRentals.length}}  {{underRepairRentals.length === 1 ? 'item is' : 'items are' }} in need of repair</p>
                } @else {
                  <p class="text-gray-700 text-base italic">Nothing to repair! :)</p>
                }
              </p>

              @for(rental of underRepairRentals; track $index){
                <div class="my-4 flex flex-column lg:flex-row lg:justify-between gap-1.5 items-center">
                  <p class="text-sm">{{ rental.articleDesignation }} {{ rental.articleInstanceInventoryNumber }}
                  </p>
                  <mat-checkbox
                      (change)="markInstanceAsRepaired(rental)"
                      class="text-sm text-gray-900"
                  >
                    Repaired
                  </mat-checkbox>
                  <mat-divider></mat-divider>
                </div>
              }
            </div>
          </div>
        </div>
      
      <div class="overflow-auto shadow-md rounded py pb-5">

        <div class="flex justify-between items-center m-4">
          <h1 class="text-xl font-bold">Items in rental</h1>
          
          @if(allRentals.length){
            <input
                [(ngModel)]="searchTerm"
                placeholder="Search..."
                class="border p-2 rounded w-1/3 bg-transparent" />
          }
          
        </div>

        @if (allRentals.length){

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
              <th>
                <select [(ngModel)]="selectedStatus" class="border p-2 rounded bg-transparent">
                  <option value="">Alle Status</option>
                  <option value="RENTED">Rented</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="AVAILABLE">Returned</option>
                  <option value="UNDER_REPAIR">Under Repair</option>
                  <option value="RETIRED">Retired</option>
                  <!-- ggf. weitere Status -->
                </select>
              </th>
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
                @if (isPastAndNotOverdue(rental)){
                  <span class="text-green-700">Returned</span>
                }
              </td>
              <td class="px-3 py-2">
                @if (!isPastAndNotOverdue(rental) && rental.status){
                  <button (click)="openEditDialog(rental)" class="text-blue-500 hover:underline">
                    Edit
                  </button>
                }
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
          <p class="text-gray-700 text-base italic m-4">No instances are currently borrowed</p>
        }
        
      </div>
      
    </div>
    </div>`,
})
export class AdminDashboardComponent implements OnInit{

  allRentals: AdminRentalInfoDto[] = [];
  currentRentals: AdminRentalInfoDto[] = [];
  dueRentals: AdminRentalInfoDto[] = [];
  overDueRentals: AdminRentalInfoDto[] = [];
  underRepairRentals: AdminRentalInfoDto[] = [];
  private _snackBar = inject(MatSnackBar);
  checkboxStates: { [rentalId: number]: boolean } = {};

  selectedStatus: string = '';
  searchTerm: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' | null = null;

  itemsPerPage = 10;
  currentPage = 1;



  constructor(private adminService: AdminService, private dialog: MatDialog) {}

  ngOnInit() {

    this.loadDueRentals();
    this.loadOverDueRentals();
    this.loadUnderRepairInstances();

    this.loadCurrentRentals();
    this.loadAllRentalPos();

    this.sortField = 'rentalEnd';
    this.sortDirection = 'asc';
  }

  loadDueRentals() {
    this.adminService.getDueRentals().subscribe((data) => {
      this.dueRentals = data;
    });
  }

  loadOverDueRentals() {
    this.adminService.getOverDueRentals().subscribe((data) => {
      this.overDueRentals = data;
    });
  }

  loadUnderRepairInstances() {
    this.adminService.getUnderRepairInstances().subscribe(data => {
      this.underRepairRentals = data;
    });
  }

  loadCurrentRentals() {
    this.adminService.getCurrentRentals().subscribe((data) => {
      this.currentRentals = data;
      console.log(this.currentRentals)
    });
  }

  loadAllRentalPos() {
    this.adminService.getAllRentalPositions().subscribe((data) => {
      this.allRentals = data;
      console.log(this.allRentals)
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
      const matchesSearch =
          rental.articleDesignation.toLowerCase().includes(term) ||
          rental.articleInstanceInventoryNumber.toLowerCase().includes(term) ||
          rental.userFirstName.toLowerCase().includes(term) ||
          rental.userLastName.toLowerCase().includes(term);
      const matchesStatus = this.selectedStatus ? rental.status === this.selectedStatus : true;
      return matchesSearch && matchesStatus;
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
    let filtered = this.allRentals;

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

  openReturnDialog(rental: AdminRentalInfoDto) {
    this.checkboxStates[rental.rentalPositionId] = true;

    const dialogRef = this.dialog.open(ReturnDialogComponent, {
      data: { rental }
    });
    dialogRef.afterClosed().subscribe((newStatus: string) => {
      if (newStatus) {
        this.adminService.updateInstanceStatus(rental.rentalPositionId, newStatus)
            .subscribe({
              next: updated => {
                rental.status = updated.status;
                this.dueRentals = this.dueRentals.filter(r => r !== rental);
                this._snackBar.open('Status updated successfully', '🎉', { duration: 3000 });
              },
              error: err => {
                const errorMessage = err.error?.message || 'An error occurred';
                this._snackBar.open(`Error: ${errorMessage}`, '🤖', { duration: 5000 });
              }
            });
      } else {
        this.checkboxStates[rental.rentalPositionId] = false;
      }
    });
  }


  markInstanceAsRepaired(rental: AdminRentalInfoDto) {
    this.adminService.updateInstanceStatus(rental.rentalPositionId, 'AVAILABLE')
        .subscribe({
          next: updated => {
            rental.status = updated.status;
            this.underRepairRentals = this.underRepairRentals.filter(r => r !== rental);
            this._snackBar.open('Status updated successfully', '🎉', { duration: 3000 });
          },
          error: err => {
            const errorMessage = err.error?.message || 'An error occurred';
            this._snackBar.open(`Error: ${errorMessage}`, '🤖', { duration: 5000 });
          }
        });
  }

  isPastAndNotOverdue(rental: AdminRentalInfoDto): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rentalEnd = new Date(rental.rentalEnd);
    rentalEnd.setHours(0, 0, 0, 0);

    return rentalEnd <= today && rental.status !== 'OVERDUE' || rental.status !== 'RENTED';
  }

}
