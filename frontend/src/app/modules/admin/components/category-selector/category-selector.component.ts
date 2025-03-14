import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatChipGrid, MatChipInput, MatChipRow, MatChipRemove, MatChip} from "@angular/material/chips";;
import {MatIconModule} from "@angular/material/icon";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {map, Observable, startWith} from "rxjs";
import {AsyncPipe, NgForOf} from "@angular/common";
import {Category} from "../../../../shared/services/category/category.service";

@Component({
  selector: 'app-category-selector',
  standalone: true,
  imports: [
    MatFormField,
    MatChipGrid,
    MatChipRow,
    MatChipRemove,
    MatChip,
    MatIconModule,
    MatLabel,
    MatAutocomplete,
    MatOption,
    ReactiveFormsModule,
    MatChipInput,
    MatAutocompleteTrigger,
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './category-selector.component.html',
  styleUrl: './category-selector.component.css'
})
export class CategorySelectorComponent implements OnInit, OnChanges{
  @Input() allCategories: Category[] = [];
  @Input() existingCategories: Category[] = [];
  @Output() categoriesChanged = new EventEmitter<Category[]>();

  categoryCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredCategories!: Observable<Category[]>;
  selectedCategories: Category[] = [];

  ngOnInit(): void {
    this.selectedCategories = [...this.existingCategories];

    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
        startWith(''),
        map((value: string | Category | null) => typeof value === 'string' ? value : value?.name),
        //map(name => name ? this._filter(name) : this.allCategories.slice())
        map(name =>
            name
                ? this._filter(name)
                : this.allCategories.slice().filter(cat =>
                    !this.selectedCategories.some(selected => selected.id === cat.id)
                )
        )
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['existingCategories'] && !changes['existingCategories'].firstChange) {
      this.selectedCategories = [...changes['existingCategories'].currentValue];
    }
  }


  private _filter(name: string): Category[] {
    const filterValue = name.toLowerCase();
    //return this.allCategories.filter(cat => cat.name.toLowerCase().includes(filterValue));
    return this.allCategories.filter(cat => {
      const matchesName = cat.name.toLowerCase().includes(filterValue);
      const notSelected = !this.selectedCategories.some(selected => selected.id === cat.id);
      return matchesName && notSelected;
    });
  }

  addCategory(event: any): void {
    const input = event.input;
    const value = (event.value || '').trim();
    if (value) {
      const existing = this.allCategories.find(cat => cat.name.toLowerCase() === value.toLowerCase());
      const category: Category = existing ? existing : { name: value };
      const alreadySelected = this.selectedCategories.some(cat => cat.name.toLowerCase() === category.name.toLowerCase());
      if (!alreadySelected) {
        this.selectedCategories.push(category);
        this.categoriesChanged.emit(this.selectedCategories);
      }
    }
    if (input) {
      input.value = '';
    }
    this.categoryCtrl.setValue(null);
  }

  removeCategory(category: Category): void {
    const index = this.selectedCategories.indexOf(category);
    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
      this.categoriesChanged.emit(this.selectedCategories);
    }
  }

  selectedCategory(event: any): void {
    const category: Category = event.option.value;
    const alreadySelected = this.selectedCategories.some(cat => cat.name.toLowerCase() === category.name.toLowerCase());
    if (!alreadySelected) {
      this.selectedCategories.push(category);
      this.categoriesChanged.emit(this.selectedCategories);
    }
    this.categoryCtrl.setValue(null);
  }
}
