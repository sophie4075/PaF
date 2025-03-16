import {Component, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe, NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {ArticleService} from "../../../../shared/services/article/article.service";
import {FileUploadService} from "../../../../shared/services/file-upload/file-upload.service";
import {Category, CategoryService} from '../../../../shared/services/category/category.service';
import {StatusService} from '../../../../shared/services/status/status.service';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatChipGrid, MatChipInput, MatChipRow} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {CategorySelectorComponent} from "../category-selector/category-selector.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgxCurrencyDirective} from "ngx-currency";

@Component({
  selector: 'app-post-article',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    MatButton,
    RouterLink,
    MatFormField,
    MatChipGrid,
    MatChipRow,
    MatIcon,
    MatAutocomplete,
    MatOption,
    CategorySelectorComponent,
    AsyncPipe,
    MatAutocompleteTrigger,
    MatChipInput,
    MatLabel,
    MatProgressSpinner,
    NgxCurrencyDirective,
  ],
  template: `
    <section class="">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto">

        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
              Add a new Article
            </h1>
            <img [src]="url" height="200" alt="">
            <form class="space-y-4 md:space-y-6" [formGroup]="articleForm" (ngSubmit)="onSubmit()">

              <div class="mb-4">
                <label for="bezeichnung"
                       class="block mb-2 text-sm font-medium text-gray-900">Bezeichnung</label>
                <input id="bezeichnung" type="text" formControlName="bezeichnung"
                       class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                @if (articleForm.get('bezeichnung')?.hasError('required') && articleForm.get('bezeichnung')?.touched) {
                  <div>
                    <p class="text-red-600 text-sm">Bezeichnung ist erforderlich.</p>
                  </div>
                }
              </div>

              <div class="mb-4">
                <label for="beschreibung"
                       class="block mb-2 text-sm font-medium text-gray-900">Beschreibung</label>
                <textarea id="beschreibung" formControlName="beschreibung"
                          class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                @if (articleForm.get('beschreibung')?.hasError('required') && articleForm.get('beschreibung')?.touched) {
                  <div>
                    <p class="text-red-600 text-sm">Beschreibung ist erforderlich.</p>
                  </div>
                }
                @if (showGenerateDescriptionButton && !loading) {
                  <button type="button" (click)="onGenerateDescription()"
                          class="bg-blue-500 text-white py-1 px-2 rounded mt-2">
                    KI Beschreibung generieren ✨
                  </button>
                } @else if (showGenerateDescriptionButton && loading) {
                  <mat-progress-spinner diameter="20" mode="indeterminate"></mat-progress-spinner>
                }
              </div>

              <div class="mb-4">
                <label for="stueckzahl" class="block mb-1 text-sm font-medium text-gray-900">Stückzahl</label>
                <input id="stueckzahl" type="number" formControlName="stueckzahl"
                       class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                @if (articleForm.get('stueckzahl')?.hasError('required') && articleForm.get('stueckzahl')?.touched) {
                  <div>
                    <p class="text-red-600 text-sm">Stückzahl ist erforderlich.</p>
                  </div>
                }
              </div>


              <div class="mb-4">
                <label for="grundpreis" class="block mb-2 text-sm font-medium text-gray-900">Grundpreis pro
                  Tag</label>
                <input id="grundpreis"
                       type="number"
                       formControlName="grundpreis"
                       [currencyMask]="{ suffix: '€ ', thousands: '.', decimal: ',', precision: 2 }"
                       class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                @if (articleForm.get('grundpreis')?.hasError('required') && articleForm.get('grundpreis')?.touched) {
                  <div>
                    <p class="text-red-600 text-sm">Grundpreis pro Tag ist erforderlich.</p>
                  </div>
                }
              </div>

              <div class="mb-4">
                <label for="bildUrl" class="block mb-2 text-sm font-medium text-gray-900">Bild</label>
                <input (change)="onSelectFile($event)" id="bildUrl" type="file" formControlName="bildUrl"
                       accept="image/png, image/jpeg"
                       class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
              </div>


              <div class="mb-4">
                <label class="block mb-2 text-sm font-medium text-gray-900">Kategorie</label>
                <app-category-selector
                    [allCategories]="categories"
                    (categoriesChanged)="onCategoriesChanged($event)">
                </app-category-selector>
              </div>


              @if (articleForm.get('sameStatus')?.value) {
                <div class="mb-4">
                  <label for="status" class="block mb-2 text-sm font-medium text-gray-900">Status</label>
                  <select id="status" formControlName="status"
                          class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">Bitte wählen</option>
                    <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
                  </select>
                  @if (articleForm.get('status')?.hasError('required') && articleForm.get('status')?.touched) {
                    <div>
                      <p class="text-red-600 text-sm">Status wählen.</p>
                    </div>
                  }
                </div>
              } @else {

                @for (instanceStatus of instanceStatuses.controls; track $index) {
                  <div formArrayName="instanceStatuses" class="mb-4">
                    <label for="instanceStatus-{{$index}}"
                           class="block mb-2 text-sm font-medium text-gray-900">
                      Status für Instanz {{ $index + 1 }}
                    </label>
                    <select [formControlName]="$index" id="instanceStatus-{{$index}}"
                            class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 ng-untouched ng-pristine ng-valid">
                      <option value="">Bitte wählen</option>
                      <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
                    </select>
                  </div>
                }
              }

              <div class="mb-4 flex items-center">
                <label class="block mb-2 text-sm font-medium text-gray-900">
                  <input type="checkbox" formControlName="sameStatus"/>
                  Alle Artikel Instanzen haben denselben Status
                </label>
              </div>


              <div>
                <button type="submit" [disabled]="articleForm.invalid"
                        class="bg-blue-500 text-white py-2 px-4 rounded">
                  Artikel anlegen
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class PostArticleComponent implements OnInit {
  articleForm!: FormGroup;
  categories: Category[] = [];
  statuses: string[] = [];
  selectedFile: File | undefined;
  selectedCategories: Category[] = [];
  private _snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder,
              private articleService: ArticleService,
              private fileUploadService: FileUploadService,
              private categoryService: CategoryService,
              private statusService: StatusService,
              private router: Router) { }

  showGenerateDescriptionButton = false;
  ngOnInit() {
    // Formular initialisieren
    this.articleForm = this.fb.group({
      bezeichnung: ['', Validators.required],
      beschreibung: ['', Validators.required],
      stueckzahl: [0, Validators.required],
      grundpreis: [0.0, Validators.required],
      bildUrl: [''],
      category: ['', Validators.required],
      sameStatus: [true],
      status: ['', Validators.required],
      instanceStatuses: this.fb.array([])
    });

    this.articleForm.get('bezeichnung')?.valueChanges.subscribe(value => {
      this.showGenerateDescriptionButton = (value && value.trim().length > 0);
    });

    this.articleForm.get('stueckzahl')?.valueChanges.subscribe(() => {
      this.updateInstanceStatuses();
    });


    this.articleForm.get('sameStatus')?.valueChanges.subscribe(value => {
      if (value) {
        this.articleForm.get('status')?.enable();
      } else {
        this.articleForm.get('status')?.disable();
      }
      this.updateInstanceStatuses();
    });

    // Get data from backend
    this.loadCategories();
    this.loadStatuses();
  }

  onCategoriesChanged(categories: Category[]): void {
    this.selectedCategories = categories;
    this.articleForm.patchValue({ category: categories });
  }

  loadCategories() {

    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: (err: any) => {
        console.error('Error loading  categories', err)
      }
    })
  }

  loadStatuses() {

    this.statusService.getStatuses().subscribe({
      next: (data: string[]) => {
        this.statuses = data;
      },
      error: (err) => {
        console.error('Error while loading the status', err);
      },
    });
  }

  get instanceStatuses(): FormArray {
    return this.articleForm.get('instanceStatuses') as FormArray;
  }

  updateInstanceStatuses(): void {
    while (this.instanceStatuses.length) {
      this.instanceStatuses.removeAt(0);
    }

    if (!this.articleForm.get('sameStatus')?.value) {
      const count = this.articleForm.get('stueckzahl')?.value || 0;
      for (let i = 0; i < count; i++) {
        this.instanceStatuses.push(this.fb.control('', Validators.required));
      }
    }
  }


  onSubmit() {
    if (this.articleForm.valid) {
      // Upload Image first
      if (this.selectedFile) {
        this.fileUploadService.uploadImage(this.selectedFile).subscribe({
              next: (uploadResponse) => {
                // Get URL from Upload response
                const imageUrl = uploadResponse.fileDownloadUri;

                // Create article, referencing the image via the URL
                const formValue = this.articleForm.value;

                let articleInstances = [];

                if (formValue.sameStatus) {
                  articleInstances.push({
                    status: formValue.status,
                    inventoryNumber: null // Generated in Backend
                  });
                } else {
                  articleInstances = formValue.instanceStatuses.map((s: string) => ({ status: s, inventoryNumber: null }));
                }

                const newArticle = {
                  bezeichnung: formValue.bezeichnung,
                  beschreibung: formValue.beschreibung,
                  stueckzahl: formValue.stueckzahl,
                  grundpreis: formValue.grundpreis,
                  bildUrl: imageUrl,
                  categories: this.selectedCategories,
                  articleInstances: articleInstances
                };
                this.articleService.createArticle(newArticle).subscribe(
                    {
                      next: (response) => {
                        this.router.navigateByUrl('/admin')
                        this._snackBar.open('Created article successfully ', '🎉', {
                          duration: 5000,
                        });
                      },error: (err) => {
                        console.error('Error while creating the article', err);
                        this.router.navigateByUrl("/admin/post-article")
                        this._snackBar.open('Error while creating the article ', '(╥﹏╥)', {
                          duration: 5000,
                        });
                      }

                    }
                );
              },
              error: (err) => {
                console.error('Error while uploading image', err);
                this._snackBar.open('Error while uploading image ', '(╥﹏╥)', {
                  duration: 5000,
                });
              },

            }

        );
      } else {
        console.error('No Image selected');
        this._snackBar.open('No Image selected ', '(＋_＋)', {
          duration: 5000,
        });
      }
    } else {
      console.error('Form not valid ┐( ˘ ､ ˘ )┌');
      this._snackBar.open('Form not valid ', ' ┐( ˘ ､ ˘ )┌', {
        duration: 5000,
      });
    }
  }



  url: string | ArrayBuffer | null | undefined  = ''
  onSelectFile(event: Event){
    const target = event.target as HTMLInputElement;
    if(target.files && target.files[0]){

      this.selectedFile = target.files[0];
      let reader = new FileReader();

      reader.readAsDataURL(target.files[0]);

      reader.onload = (event) => {
        this.url = event.target?.result
      }
    }
  }

  loading = false;
  onGenerateDescription() {
    const productName = this.articleForm.get('bezeichnung')?.value;
    if (productName) {
      this.loading = true
      this.articleService.generateDescriptionForName(productName).subscribe(
          (description: string) => {
            this.articleForm.patchValue({ beschreibung: description });
            this.loading = false;
          },
          error => {
            console.error('*Error generating Description', error);
            this.articleForm.patchValue({ beschreibung: '**Error generating Description**' });
            this.loading = false;
          }
      );
    }
  }


}
