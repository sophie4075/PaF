import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-return-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatButton
  ],
  template: `
    <h2 mat-dialog-title>Confirm return</h2>
    <mat-dialog-content>
      <p>Bitte wählen Sie den Zustand der zurückgegebenen Instanz aus:</p>
      <button mat-button (click)="confirm(Status[0])">Article is okay and can be rented by next customer </button>
      <button mat-button (click)="confirm(Status[1])">Under Repair</button>
    </mat-dialog-content>

  `,
})
export class ReturnDialogComponent {
  Status = ['AVAILABLE', 'UNDER_REPAIR'];
  constructor(
      public dialogRef: MatDialogRef<ReturnDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirm(newStatus: string) {
    this.dialogRef.close(newStatus);
  }
}
