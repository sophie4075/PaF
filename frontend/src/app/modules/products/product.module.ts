import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import { ProductRoutingModule } from './product-routing.module';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ProductRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class ProductModule { }