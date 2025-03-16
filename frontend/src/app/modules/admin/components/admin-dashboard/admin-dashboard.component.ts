import {Component, OnInit} from '@angular/core';
import {AdminRentalInfoDto, AdminService} from "../../service/admin.service";
import {DatePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {
  MatExpansionPanelHeader,
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

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
    MatProgressSpinner
  ],
  template: `
    <!--WIP-->

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center flex-col gap-8 items-center">
      <h1 class="font-bold text-xl mb-2 mt-8">Hi, hier das wichtigste auf einem Blick!</h1>

      <div class="md:w-1/2 w-full rounded overflow-hidden shadow-lg">
        <div class="px-6 py-4 ">
          <h2  class="font-bold text-xl mb-2">Aktuell verliehene Instanzen</h2>
          @if (currentRentals.length) {
            @for (rental of currentRentals; track $index) {

              <div class="mb-4 mt-4">
                <h3>{{ rental.articleDesignation }}</h3>
                <p class="text-gray-700 text-sm">{{ rental.articleInstanceInventoryNumber }}, rented by: {{rental.userFirstName}}</p>
                <p class="text-gray-700 text-base">
                  Rental period: {{rental.rentalStart | date: 'dd.MM.yyyy'}} - {{rental.rentalEnd | date: 'dd.MM.yyyy'}}
                </p>
              </div>

              <mat-accordion>
                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      Edit rental period
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  <div>
                    <form (ngSubmit)="onUpdateRentalPeriod(rental)" class="flex flex-col">
                      <label>Rental Start:</label>
                      <input type="date" name="newRentalStart" [value]="rental.rentalStart | date:'yyyy-MM-dd'" disabled>
                      <label>Rental end:</label>
                      <input type="date" [(ngModel)]="rental.newRentalEnd" name="newRentalEnd" required>
                      <div class="w-full flex justify-end">
                        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded mt-8 " >
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                </mat-expansion-panel>
              </mat-accordion>


            }
          } @else {
            <p class="text-gray-700 text-base italic">No instances are currently borrowed</p>
          }
        </div>
      </div>

      <div class="md:w-1/2 w-full rounded overflow-hidden shadow-lg">
        <div class="px-6 py-4">
          <h2  class="font-bold text-xl mb-2">Articles due within the next 3 days</h2>
          @if (dueRentals.length) {
            @for (rental of dueRentals; track $index) {

              <div class="mb-4 mt-4">
                <h3>{{ rental.articleDesignation }}</h3>
                <p class="text-gray-700 text-sm">{{ rental.articleInstanceInventoryNumber }}</p>
                <p class="text-gray-700 text-base">Due: {{rental.rentalEnd | date: 'dd.MM.yyyy'}}
                </p>
              </div>


              <mat-accordion>
                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      Edit rental period
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  <div>
                    <form (ngSubmit)="onUpdateRentalPeriod(rental)" class="flex flex-col">
                      <label>Rental Start:</label>
                      <input type="date" name="newRentalStart" [value]="rental.rentalStart | date:'yyyy-MM-dd'" disabled>
                      <label>Rental end:</label>
                      <input type="date" [(ngModel)]="rental.newRentalEnd" name="newRentalEnd" required>
                      <div class="w-full flex justify-end">
                        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded mt-8 " >
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                </mat-expansion-panel>
              </mat-accordion>
            }
          } @else {
            <p class="text-gray-700 text-base italic">No returns are due within the next 3 days</p>
          }
        </div>
      </div>

      <div class="md:w-1/2 w-full rounded overflow-hidden shadow-lg">
        <div class="px-6 py-4">
          <h2  class="font-bold text-xl mb-2">Attention: Under repair, but will be needed soon!</h2>
          @if (upcomingUnderRepair.length) {
            @for (rental of upcomingUnderRepair; track $index) {
              <h3>{{ rental.articleDesignation }}</h3>
              <p class="text-gray-700 text-sm">{{ rental.articleInstanceInventoryNumber }}</p>
              <p class="text-gray-700 text-base">
                Article needed from: {{ rental.rentalStart | date: 'dd.MM.yyyy' }}
              </p>
              <p class="text-gray-700 text-base italic">Please make sure to contact {{rental.userFirstName }} {{rental.userLastName}} via {{rental.userEmail}} in case the Article will not be available</p>

              <mat-accordion>
                <mat-expansion-panel>
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      Change Satus
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  <div>
                    <form (ngSubmit)="onStatusChange" class="flex flex-col">
                      <label>Rental Start:</label>
                      <input type="date" name="newRentalStart" [value]="rental.rentalStart | date:'yyyy-MM-dd'" disabled>
                      <label>Rental end:</label>
                      <input type="date" [(ngModel)]="rental.newRentalEnd" name="newRentalEnd" required>
                      <div class="w-full flex justify-end">
                        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded mt-8 " >
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                </mat-expansion-panel>
              </mat-accordion>
            }
          } @else {
            <p class="text-gray-700 text-base italic">Nothing urgent under repair :)</p>
          }
        </div>
      </div>

    </div>
  `,
})
export class AdminDashboardComponent implements OnInit{

  currentRentals: AdminRentalInfoDto[] = [];
  dueRentals: AdminRentalInfoDto[] = [];
  upcomingUnderRepair: AdminRentalInfoDto[] = [];



  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadCurrentRentals();
    this.loadUpcomingUnderRepair();
    this.loadDueRentals();
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

  onStatusChange(){
    console.log("click")
  }


}
