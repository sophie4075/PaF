import {Component, OnInit} from '@angular/core';
import {Article, ArticleService} from "../../../../../services/article/article.service";
import {Category, CategoryService} from "../../../../../services/category/category.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {RouterLink} from "@angular/router";
import {CurrencyPipe} from "@angular/common";

@Component({
    selector: 'app-product-category',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterLink,
        CurrencyPipe
    ],
    template: `
        <div class="bg-white min-h-full">
            <div class="pb-5">
                <!-- Mobile Filterdialog -->
                @if (mobileFilterOpen) {
                    <div class="relative z-40 lg:hidden" role="dialog" aria-modal="true">
                        <div class="fixed inset-0 bg-black/25" aria-hidden="true"></div>
                        <div class="fixed inset-0 z-40 flex">
                            <div class="relative ml-auto flex w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">

                                <!-- Filter -->
                                <form [formGroup]="filterForm" (ngSubmit)="applyFilters()"
                                      class="mt-4 border-t border-gray-200">

                                    <!-- Category -->
                                    <div class="border-t border-gray-200 px-4 py-6">
                                        <h3 class="-mx-2 -my-3 flow-root">
                                            <button type="button"
                                                    (click)="toggleSection('category')"
                                                    class="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                                            >
                                                <span class="font-medium text-gray-900">Category</span>
                                                <span class="ml-6 flex items-center">
                                        @if (!categoryOpen) {
                                            <svg class="size-5" viewBox="0 0 20 20" fill="currentColor"
                                                 aria-hidden="true" data-slot="icon">
                                                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
                                            </svg>
                                        } @else {
                                            <svg class="size-5" viewBox="0 0 20 20" fill="currentColor"
                                                 aria-hidden="true" data-slot="icon">
                                                <path fill-rule="evenodd"
                                                      d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        }
                                    </span>
                                            </button>
                                        </h3>
                                        @if (categoryOpen) {
                                            <div class="pt-6" id="filter-section-mobile-category">
                                                <div class="space-y-4">
                                                    @for (cat of categories; track $index) {
                                                        <div class="flex gap-3 items-center">
                                                            <input
                                                                    type="checkbox"
                                                                    [value]="cat.id"
                                                                    (change)="onCategoryChange($event)"
                                                                    class="h-5 w-5 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500">
                                                            <label class="text-sm text-gray-600">{{ cat.name }}</label>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        }

                                    </div>

                                    <!-- Price -->
                                    <div class="border-t border-gray-200 px-4 py-6">
                                        <h3 class="-mx-2 -my-3 flow-root">
                                            <button type="button"
                                                    (click)="toggleSection('price')"
                                                    class="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                                            >
                                                <span class="text-gray-900">Price</span>
                                                <span class="ml-6 flex items-center">
                                        @if (!priceOpen) {
                                            <svg class="size-5" viewBox="0 0 20 20" fill="currentColor"
                                                 aria-hidden="true" data-slot="icon">
                                                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
                                            </svg>
                                        } @else {
                                            <svg class="size-5" viewBox="0 0 20 20" fill="currentColor"
                                                 aria-hidden="true" data-slot="icon">
                                                <path fill-rule="evenodd"
                                                      d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        }
                                    </span>
                                            </button>
                                        </h3>

                                        @if (priceOpen) {
                                            <div class="pt-6" id="filter-section-mobile-price">
                                                <div class="space-y-4">
                                                    <div class="mb-2">
                                                        <label class="block text-sm text-gray-700">
                                                            Min: {{ filterForm.get('minPrice')?.value }}€
                                                        </label>
                                                        <input type="number"
                                                               [min]="minPrice"
                                                               [max]="maxPrice"
                                                               formControlName="minPrice"
                                                               class="mt-1 block w-full border-gray-300 rounded-md shadow-sm font-light">
                                                    </div>
                                                    <div>
                                                        <label class="block text-sm text-gray-700">
                                                            Max: {{ filterForm.get('maxPrice')?.value }}€
                                                        </label>
                                                        <input type="number"
                                                               [min]="minPrice"
                                                               [max]="maxPrice"
                                                               formControlName="maxPrice"
                                                               class="mt-1 block w-full border-gray-300 rounded-md shadow-sm font-light">
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    <!-- Date -->
                                    <div class="border-t border-gray-200 px-4 py-6">
                                        <h3 class="-mx-2 -my-3 flow-root">
                                            <button type="button"
                                                    (click)="toggleSection('availability')"
                                                    class="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                                            >
                                                <span class="text-gray-900">Availability</span>
                                                @if (!priceOpen) {
                                                    <svg class="size-5" viewBox="0 0 20 20" fill="currentColor"
                                                         aria-hidden="true" data-slot="icon">
                                                        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
                                                    </svg>
                                                } @else {
                                                    <svg class="size-5" viewBox="0 0 20 20" fill="currentColor"
                                                         aria-hidden="true" data-slot="icon">
                                                        <path fill-rule="evenodd"
                                                              d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z"
                                                              clip-rule="evenodd"/>
                                                    </svg>
                                                }
                                            </button>
                                        </h3>
                                        @if (priceOpen) {
                                            <div class="pt-6" id="filter-section-mobile-dates">
                                                <div class="space-y-4">
                                                    <div>
                                                        <label class="block text-sm text-gray-700">Start</label>
                                                        <input type="date" formControlName="startDate"
                                                               class="mt-1 block w-full border-gray-300 rounded-md shadow-sm font-light">
                                                    </div>
                                                    <div>
                                                        <label class="block text-sm text-gray-700">End</label>
                                                        <input type="date" formControlName="endDate"
                                                               class="mt-1 block w-full border-gray-300 rounded-md shadow-sm font-light">
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    <button type="submit"
                                            class="lg:w-full ml-4 bg-indigo-600 text-white py-2 px-4 rounded-md">
                                        Filter anwenden
                                    </button>

                                </form>

                                <div class="fixed bottom-0 max-w-xs w-full">
                                    <div class="flex items-center justify-between px-4">
                                        <h2 class="text-lg font-medium text-gray-900">Filters</h2>
                                        <button type="button"
                                                (click)="toggleSection('mobileFilterSection')"
                                                class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400">
                                            <span class="sr-only">Close menu</span>
                                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                 stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                      d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                } @else {
                    <div class="fixed bottom-0 w-full bg-white lg:hidden">
                        <button type="button"
                                (click)="toggleSection('mobileFilterSection')"
                                class="-mr-2 flex h-10 w-full items-center justify-between bg-white p-2 text-gray-400">
                            <span class="sr-only">Open filter menu</span>
                            <span class="text-lg font-medium text-gray-900">Filters</span>
                            <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                                 data-slot="icon">
                                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
                            </svg>
                        </button>

                    </div>
                }

                <!-- Desktop View -->
                <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between border-b border-gray-200 pt-24 pb-6">
                        <h1 class="text-4xl font-bold tracking-tight text-gray-900">Products</h1>
                        <div class="relative" [formGroup]="searchForm">
                            <input type="text"
                                   placeholder="Search products..."
                                   formControlName="searchQuery"
                                   class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm transition duration-150 ease-in-out">
                        </div>
                    </div>
                    <div class="flex flex-col lg:flex-row">
                        <form class="hidden lg:block lg:w-1/4 p-4" (ngSubmit)="applyFilters()" [formGroup]="filterForm">

                            <!-- Category -->
                            <div class="border-b border-gray-200 py-6">
                                <h3 class="-my-3 flow-root">
                                    <button type="button"
                                            (click)="toggleSection('category')"
                                            class="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                                    >
                                        <span class="font-medium text-gray-900">Category</span>
                                        @if (!categoryOpen) {
                                            <svg class="size-5" viewBox="0 0 20 20" fill="currentColor"
                                                 aria-hidden="true" data-slot="icon">
                                                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
                                            </svg>
                                        } @else {
                                            <svg class="size-5" viewBox="0 0 20 20" fill="currentColor"
                                                 aria-hidden="true" data-slot="icon">
                                                <path fill-rule="evenodd"
                                                      d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        }
                                    </button>
                                </h3>
                                @if (categoryOpen) {
                                    <div class="pt-6" id="filter-section-0">
                                        <div class="space-y-4">
                                            @for (cat of categories; track $index) {
                                                <div class="flex gap-3 items-center">
                                                    <input
                                                            type="checkbox"
                                                            [value]="cat.id"
                                                            (change)="onCategoryChange($event)"
                                                            class="h-5 w-5 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500">
                                                    <label class="text-sm text-gray-600">{{ cat.name }}</label>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>

                            <!-- Price -->
                            <div class="border-t border-gray-200 px-4 py-6">
                                <h3 class="-mx-2 -my-3 flow-root">
                                    <button type="button"
                                            (click)="toggleSection('price')"
                                            class="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                                    >
                                        <span class="font-medium text-gray-900">Price</span>
                                        @if (!priceOpen) {
                                            <svg class="size-5" viewBox="0 0 20 20" fill="currentColor"
                                                 aria-hidden="true" data-slot="icon">
                                                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
                                            </svg>
                                        } @else {
                                            <svg class="size-5" viewBox="0 0 20 20" fill="currentColor"
                                                 aria-hidden="true" data-slot="icon">
                                                <path fill-rule="evenodd"
                                                      d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        }
                                    </button>
                                </h3>
                                @if (priceOpen) {
                                    <div class="pt-6" id="filter-section-desktop-price">
                                        <div class="space-y-4">
                                            <div class="mb-2">
                                                <label class="block text-sm text-gray-700">
                                                    Min: {{ filterForm.get('minPrice')?.value }}€
                                                </label>
                                                <input type="number"
                                                       [min]="minPrice"
                                                       [max]="maxPrice"
                                                       formControlName="minPrice"
                                                       class="mt-1 block w-full border-gray-300 rounded-md shadow-sm font-light">
                                            </div>
                                            <div>
                                                <label class="block text-sm text-gray-700">
                                                    Max: {{ filterForm.get('maxPrice')?.value }}€
                                                </label>
                                                <input type="number"
                                                       [min]="minPrice"
                                                       [max]="maxPrice"
                                                       formControlName="maxPrice"
                                                       class="mt-1 block w-full border-gray-300 rounded-md shadow-sm font-light">
                                            </div>
                                        </div>

                                    </div>
                                }
                            </div>

                            <!-- Date -->
                            <div class="border-t border-gray-200 px-4 py-6">
                                <h3 class="-mx-2 -my-3 flow-root">
                                    <button type="button"
                                            (click)="toggleSection('availability')"
                                            class="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                                    >
                                        <span class="font-medium text-gray-900">Availability</span>
                                        @if (!availabilityOpen) {
                                            <svg class="size-5" viewBox="0 0 20 20" fill="currentColor"
                                                 aria-hidden="true" data-slot="icon">
                                                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
                                            </svg>
                                        } @else {
                                            <svg class="size-5" viewBox="0 0 20 20" fill="currentColor"
                                                 aria-hidden="true" data-slot="icon">
                                                <path fill-rule="evenodd"
                                                      d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z"
                                                      clip-rule="evenodd"/>
                                            </svg>
                                        }
                                    </button>
                                </h3>
                                @if (availabilityOpen) {
                                    <div class="pt-6" id="filter-section-desktop-dates">
                                        <div class="space-y-4">
                                            <div>
                                                <label class="block text-sm text-gray-700">Start</label>
                                                <input type="date" formControlName="startDate"
                                                       class="mt-1 block w-full border-gray-300 rounded-md text-sm font-light">
                                            </div>
                                            <div>
                                                <label class="block text-sm text-gray-700">End</label>
                                                <input type="date" formControlName="endDate"
                                                       class="mt-1 block w-full border-gray-300 rounded-md text-sm font-light ">
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>

                            <button type="submit" class="mt-4 lg:w-full bg-indigo-600 text-white py-2 px-4 rounded-md">
                                Apply Filter
                            </button>
                        </form>

                        <!-- Products -->
                        <div class="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-3 md:grid-cols-2 lg:ml-auto lg:mr-auto mt-4">
                            @for (article of articles; track $index) {
                                <a
                                        routerLink="/pdp/article/{{article.id}}"
                                        [queryParams]="{start: filterForm.get('startDate')?.value, end: filterForm.get('endDate')?.value}"
                                        class="group"
                                >
                                    <img [src]="article.bildUrl" alt="{{ article.bezeichnung }}"
                                         class="aspect-square rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8 w-full lg:w-[200px] lg:h-[200px]">
                                    <h3 class="mt-4 text-sm text-gray-700">{{ article.bezeichnung }}</h3>
                                    <p class="mt-1 text-xs text-gray-900">{{ article?.grundpreis | currency:'EUR':'symbol':'1.2-2':'de-DE' }}
                                        per day, per Item</p>
                                </a>
                            }
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `,
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
            selectedCategories: [[]],
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
