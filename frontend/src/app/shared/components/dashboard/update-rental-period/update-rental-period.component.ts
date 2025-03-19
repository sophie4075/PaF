import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {DatePipe} from "@angular/common";

class EditRentalDialogComponent {
}

@Component({
  selector: 'app-update-rental-period',
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormField,
    MatInput,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    FormsModule,
    DatePipe
  ],
  template: `
    <h2 mat-dialog-title>Edit Rental Period</h2>
    <mat-dialog-content>
      <form #form="ngForm" class="flex flex-col">
        <label>Rental Start:</label>
        <input type="date" name="newRentalStart" [value]="rental.rentalStart | date:'yyyy-MM-dd'" [disabled]="!allowEditStart" [required]="allowEditStart" [min]="today">
        <label>Rental end:</label>
        <input type="date" [(ngModel)]="rental.newRentalEnd" [value]="rental.rentalEnd | date:'yyyy-MM-dd'" name="newRentalEnd" [min]="tomorrow" required>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button class="bg-gray-300 text-white py-2 px-4 rounded mt-8 " (click)="onCancel()">Cancel</button>
      <button mat-button [disabled]="!data.rental.newRentalEnd" (click)="onSubmit()" class="bg-blue-500 text-white py-2 px-4 rounded mt-8">Save</button>
    </mat-dialog-actions>
  `,

})
export class UpdateRentalPeriodComponent implements OnInit{
  allowEditStart: boolean = true
  rental: any;
  today = new Date();
  tomorrow = new Date()

  constructor(
      public dialogRef: MatDialogRef<EditRentalDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.rental = data.rental;
    this.tomorrow.setDate(this.today.getDate() + 1);

  }

  ngOnInit(): void {
    const today = new Date();
    const rentalStart = new Date(this.rental.rentalStart);

    this.allowEditStart = today < rentalStart;
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close({ newRentalEnd: this.data.rental.newRentalEnd });
  }
}
