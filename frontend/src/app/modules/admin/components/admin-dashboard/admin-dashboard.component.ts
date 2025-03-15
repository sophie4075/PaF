import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../../shared/services/article/article.service";
import {RentalPositionDto} from "../../../../shared/services/rental/rental.service";
import {AdminRentalInfoDto, AdminService} from "../../service/admin.service";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
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

}
