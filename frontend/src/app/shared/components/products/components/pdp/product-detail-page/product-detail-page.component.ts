import {Component, inject, OnInit} from '@angular/core';
import {
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker
} from "@angular/material/datepicker";
import { MatFormFieldModule } from '@angular/material/form-field';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatNativeDateModule} from "@angular/material/core";
import {Article, ArticleService} from "../../../../../services/article/article.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {StatusService} from "../../../../../services/status/status.service";
import {StorageService} from "../../../../../services/storage/storage.service";
import {CurrencyPipe, NgClass, NgForOf} from "@angular/common";
import {
  ArticleInstanceDto,
  ArticleInstanceService
} from "../../../../../services/article-instance/article-instance.service";
import {CartService} from "../../../../../services/cart/cart.service";
import {MatIcon} from "@angular/material/icon";
import {Nl2brPipe} from "../../../../../pipes/nl2br.pipe";
import {MarkdownPipe} from "../../../../../pipes/markdown.pipe";
import {RentalService} from "../../../../../services/rental/rental.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDateRangePicker,
    MatDateRangeInput,
    MatDatepickerToggle,
    ReactiveFormsModule,
    NgClass,
    FormsModule,
    NgForOf,
    MatIcon,
    RouterLink,
    CurrencyPipe,
    Nl2brPipe,
    MarkdownPipe
  ],
  template: `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-full">
      <div class="flex justify-center items-center h-full flex-col pb-5">
        <div class="grid grid-cols-1 w-full md:grid-cols-2 gap-4">
          <!-- img -->
          <img src="{{article?.bildUrl}}" alt="Produktbild"
               class="w-full h-auto object-cover rounded-lg"/>

          <!-- info -->
          <div class="flex flex-col justify-between">
            <div>
              <h1 class="text-3xl font-bold mb-2">
                {{ article?.bezeichnung }}
                @if (isAdminOrStaff) {
                  <a [routerLink]="['/admin', 'pdp', 'article', article?.id, 'edit']">
                    <mat-icon aria-hidden="false" aria-label="edit icon" fontIcon="mode_edit"></mat-icon>
                  </a>
                }
              </h1>
              <div class="font-semibold mb-4">
                {{ article?.grundpreis | currency:'EUR':'symbol':'1.2-2':'de-DE' }} <span
                  class="text-base font-normal text-gray-600">pro Tag</span>
              </div>
              <p class="mb-4" id="article-description" [innerHTML]="article?.beschreibung | markdown"></p>

            </div>

            <div class="w-full">
              <div class="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div class="w-full md:w-1/3">
                  <label for="quantity" class="block mb-1 text-sm font-medium text-gray-900">Menge:</label>
                  <input
                      type="number"
                      id="quantity"
                      min="1"
                      max="{{article?.stueckzahl}}"
                      [(ngModel)]="quantity"
                      class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full md:w-1/2"
                  />
                </div>
                <mat-form-field class="w-full md:w-2/3">
                  <mat-label>Verfügbarkeit prüfen</mat-label>
                  <mat-date-range-input [formGroup]="range" [rangePicker]="picker">
                    <input matStartDate formControlName="start" placeholder="Start date">
                    <input matEndDate formControlName="end" placeholder="End date">
                  </mat-date-range-input>
                  @if (available && this.range.get('start')?.value && this.range.get('end')?.value) {
                    <mat-hint class="text-green-700">
                      In dem Zeitraum verfügbar für insgesamt: {{ totalPrice | currency:'EUR':'symbol':'1.2-2':'de-DE' }}
                    </mat-hint>
                  } @else if (!available && this.range.get('start')?.value && this.range.get('end')?.value) {
                    <mat-hint class="text-red-500">
                      Nicht Verfügbar
                    </mat-hint>
                  } @else {
                    <mat-hint>DD/MM/YYYY – DD/MM/YYYY</mat-hint>
                  }

                  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-date-range-picker #picker></mat-date-range-picker>

                  @if (range.controls.start.hasError('matStartDateInvalid')) {
                    <mat-error>Invalid start date</mat-error>
                  }
                  @if (range.controls.end.hasError('matEndDateInvalid')) {
                    <mat-error>Invalid end date</mat-error>
                  }
                </mat-form-field>

              </div>

              <button
                  [disabled]="!available"
                  (click)="addToCart()"
                  class="bg-blue-500 w-full hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-20">
                Add to Cart
              </button>
            </div>

          </div>
        </div>

        @if (isAdminOrStaff) {
          <div class="bg-white rounded-lg w-full mt-8">
            <!-- Header -->
            <div class="px-4 py-2 flex justify-between items-center border-b cursor-pointer"
                 (click)="toggleInstancesPanel()">
              <h2 class="">Artikelinstanzen verwalten</h2>
              <svg class="w-6 h-6 transform transition-transform duration-200"
                   [ngClass]="{'rotate-180': showInstancesPanel}"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>

            @if (showInstancesPanel) {
              @for (instance of instances; track $index) {
                <div class="flex items-center justify-between border-b px-4 py-2">
                  <div>
                    <p class="font-semibold">{{ article?.bezeichnung }} {{ instance.inventoryNumber }}</p>
                    <p class="text-sm text-gray-600">Status: {{ instance.status }}</p>
                  </div>

                  <div class="flex justify-between">
                    @if (instance.status !== 'RENTED' && instance.status !== 'RETIRED') {
                      <select class="border border-gray-300 rounded p-1"
                              [(ngModel)]="instance.status"
                              (change)="onInstanceStatusChange(instance, $index)">
                        <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
                      </select>
                    }

                    @if (instance.status === 'RETIRED' && this.isAdmin) {
                      <button
                          class="bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1"
                          (click)="deleteInstance(instance, $index)">
                        Löschen
                      </button>
                    }
                  </div>


                </div>

              }

              <div class="mt-4">
                <button class="px-4 py-2 w-full flex justify-between items-center"
                        (click)="addInstance()">
                  Instanz hinzufügen
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon"
                       class="size-5">
                    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"></path>
                  </svg>
                </button>
              </div>
            }

          </div>
        }
      </div>
    </div>
  `,
  styles: [':host /deep/ .mdc-text-field--filled:not(.mdc-text-field--disabled) { background-color: transparent !important; }']

})
export class ProductDetailPageComponent implements OnInit {

  quantity: number = 1;
  articleId: number = 0
  article: Article | undefined
  statuses: string[] = [];
  instances: ArticleInstanceDto[] | undefined;
  availableInstances: number[] | undefined = []
  isAdminOrStaff = false;
  isAdmin = false;
  showInstancesPanel = false;

  availabilityMessage: string = '';
  available: boolean = false;
  totalPrice: number = 0;

  private _snackBar = inject(MatSnackBar);

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,
              private statusService: StatusService,
              private instanceService: ArticleInstanceService,
              private cartService: CartService,
              private rentalService: RentalService,
              private router: Router
              ) {

  }

  ngOnInit() {
    this.articleId = this.activatedRoute.snapshot.params["id"];
    this.isAdminOrStaff = StorageService.isAdminLoggedIn() || StorageService.isStaffLoggedIn();
    this.isAdmin = StorageService.isAdminLoggedIn()

    this.getArticleById();
    this.loadStatuses();
    this.loadInstances();

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['start'] && params['end']) {
        this.range.patchValue({
          start: new Date(params['start']),
          end: new Date(params['end'])
        });
        this.checkAvailability();
      }
    });

    this.range.valueChanges.subscribe(() => {
      this.checkAvailability();
    });
  }

  getArticleById(){
    this.articleService.getArticleById(this.articleId).subscribe((res) => {
      console.log(res)
      this.article = res

      if (!this.article.articleInstances) {
        this.article.articleInstances = [];
      }
    })
  }

  loadInstances(){
    this.instanceService.getInstances(this.articleId).subscribe((res) => {
      console.log(res)
      this.instances = res
    })
  }

  loadStatuses() {
    this.statusService.getStatuses().subscribe(
        (data: string[]) => {this.statuses = data;},
        (error: any) => { console.error('Fehler beim Laden der Status', error); }
    );
  }

  toggleInstancesPanel() {
    this.showInstancesPanel = !this.showInstancesPanel;
  }

  deleteInstance(instance: ArticleInstanceDto, index: number) {
    if (!this.article || !this.article.id || !instance.id ) return;
    this.instanceService.deleteInstance(this.article.id, instance.id).subscribe(
        () => {

          if(this.instances){
            this.instances.splice(index, 1);
          }

          if (this.article) {
            this.article.articleInstances.splice(index, 1);
          }
        },
        error => console.error('Fehler beim Löschen der Instanz', error)
    );
  }

  onInstanceStatusChange(instance: ArticleInstanceDto, index: number) {
    if (!this.article || !this.article.id || !instance.id) return;
    this.instanceService
        .updateInstance(this.article.id, instance.id, instance)
        .subscribe(
            updatedInstance => {

              if(this.instances){
                this.instances[index] = updatedInstance;
                if (this.article) {
                  this.article.articleInstances[index] = updatedInstance;
                }
              }

            },
            error => console.error('Fehler beim Aktualisieren der Instanz', error)
        );
  }

  addInstance() {
    if (!this.article || !this.article.id) return;
    // ID and inventoryNumber are set within the backend
    const newInstance: ArticleInstanceDto = { status: 'PRE_LAUNCH' };

    this.instanceService.addInstance(this.article.id, newInstance).subscribe({
      next: (createdInstance) => {
        if(this.instances){
          this.instances.push(createdInstance);
        }
        if (this.article) {
          this.article.articleInstances.push(createdInstance);
        }
      },
      error: (err) => {
        console.error('Error adding instance', err)
        const errorMessage = err.error?.message || 'Error adding instance.';
        this._snackBar.open(`Error: ${errorMessage}`, '🤖', {
          duration: 5000,
        });

      },
    });
  }

  checkAvailability() {
    const start = this.range.get('start')?.value;
    const end = this.range.get('end')?.value;
    if (start && end && this.articleId) {
      this.articleService.checkAvailability(this.articleId, start, end).subscribe({
        next: (result) => {
          console.log("Result " + result.availableInstances )
          this.available = result.available;
          this.availableInstances = result.availableInstances;
          let availableInstances = result.availableInstances?.length || 0
          if (this.available && result.totalPrice && availableInstances >= this.quantity) {
            this.totalPrice = result.totalPrice * this.quantity ;
          } else {
            let amount: string | number = availableInstances === 0 ? "keine" : availableInstances
            this.availabilityMessage = `Es sind ${amount} Artikel zu dem Zeitraum Verfügbar`;
          }
        },
        error: (err) => {
          console.error(err);
          this.availabilityMessage = 'Error while checking availability';
          this.available = false;
        },
      });

    } else {
      this.availabilityMessage = '';
      this.available = false;
    }
  }

  addToCart() {
    const name = this.article?.bezeichnung || ""
    const start = this.range.get('start')?.value;
    const end = this.range.get('end')?.value;

    if(!start || !end){
      this._snackBar.open('Please select a date range ', '📅', {
        duration: 5000,
      });
      return
    }

    if(this.availableInstances?.length && this.articleId){

        this.cartService.addItem({
          articleName: name,
          articleId: this.articleId,
          rentalStart: start,
          rentalEnd: end,
          dailyPrice: this.article?.grundpreis,
          quantity: this.quantity
        });


      this.router.navigateByUrl('/products');
      this._snackBar.open('Article(s) added to cart! ', '🛍️', {
        duration: 5000,
      });


    } else {
      this._snackBar.open('Error while adding articles to cart ', ':/', {
        duration: 5000,
      });
    }
  }


}

