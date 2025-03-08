import {Component, OnInit} from '@angular/core';
import {Article, ArticleService} from "../../../../../services/article/article.service";
import {Category, CategoryService} from "../../../../../services/category/category.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-product-category',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterLink
    ],
    templateUrl: './product-category.component.html',
    styleUrl: './product-category.component.css'
})
export class ProductCategoryComponent implements OnInit {
    articles: Article[] = [];
    categories: Category[] = [];
    filterForm: FormGroup;
    searchForm: FormGroup;

    categoryOpen: boolean = true;
    priceOpen: boolean = false;
    availabilityOpen: boolean = false;
    mobileFilterOpen: boolean = false;

    minPrice: number = 0;
    maxPrice: number = 0;

    constructor(private articleService: ArticleService,
                private categoryService: CategoryService,
                private fb: FormBuilder) {
        this.filterForm = this.fb.group({
            minPrice: [this.minPrice],
            maxPrice: [this.maxPrice],
            startDate: [''],
            endDate: ['']
        });

        this.searchForm = this.fb.group({
            searchQuery: ['']
        })

    }

    ngOnInit() {
        this.getAllArticles()
        this.getAllCategories()

        this.searchForm.get('searchQuery')?.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(query => {
                if (query && query.trim().length > 0) {
                    this.articleService.searchArticles(query.trim())
                        .subscribe(results => {
                            this.articles = results;
                        });
                } else {
                    this.getAllArticles();
                }
            });
    }

    getAllArticles() {
        this.articleService.getArticles().subscribe((res) => {
            console.log(res)
            this.articles = res;
            this.minPrice = this.findMinVal(this.articles, "grundpreis");
            this.maxPrice = this.findMaxVal(this.articles, "grundpreis");

            this.filterForm.patchValue({
                minPrice: [this.minPrice],
                maxPrice: [this.maxPrice],
            });

        })
    }

    getAllCategories() {
        this.categoryService.getCategories().subscribe((cat) => {
            this.categories = cat;
        })
    }


    onCategoryChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const categoryId = target.value;
        let selected: number[] = this.filterForm.get('selectedCategories')?.value || [];
        if (target.checked) {
            selected.push(+categoryId);
        } else {
            selected = selected.filter(id => id !== +categoryId);
        }
        this.filterForm.get('selectedCategories')?.setValue(selected);
    }


    applyFilters() {
        const filters = this.filterForm.value;
        filters.priceRange = [filters.minPrice, filters.maxPrice];
        console.log(filters)
        this.articleService.getFilteredArticles(filters).subscribe((filteredArticles) => {
            console.log(filteredArticles);
            this.articles = filteredArticles;
        });
    }

    /** The `reduce()` function is used to iterate over each object in the array.
     * The initial value (`Infinity` for minimum, `-Infinity` for maximum) is set to ensure that the first
     * comparison sets the initial minimum or maximum value correctly.
     * The function then compares the property value of each object to the current minimum or maximum value and updates it accordingly.
     * Finally, the minimum or maximum value is returned after all objects in the array have been processed.
     * Src: https://rathoreaparna678.medium.com/how-to-get-min-or-max-value-of-a-property-in-a-javascript-array-of-objects-b39c279205b9
     * */

    findMinVal(article: Array<Article>, property: "grundpreis" | "stueckzahl"): number {
        return article.reduce((min, obj) => {
            return obj[property] < min ? obj[property] : min;
        }, Infinity);
    }

    findMaxVal(article: Array<Article>, property: "grundpreis" | "stueckzahl"): number {
        return article.reduce((max, obj) => {
            return obj[property] > max ? obj[property] : max;
        }, -Infinity);
    }

    toggleSection(section: 'category' | 'price' | 'availability' | 'mobileFilterSection'): void {
        if (section === 'category') {
            this.categoryOpen = !this.categoryOpen;
        }
        if (section === 'price') {
            this.priceOpen = !this.priceOpen;
        }
        if (section === 'availability') {
            this.availabilityOpen = !this.availabilityOpen;
        }
        if(section === 'mobileFilterSection'){
            this.mobileFilterOpen = !this.mobileFilterOpen
        }
    }


}
