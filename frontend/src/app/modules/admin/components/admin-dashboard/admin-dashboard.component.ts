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
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
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
