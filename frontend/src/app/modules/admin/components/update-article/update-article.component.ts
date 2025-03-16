import {Component, inject, OnInit} from '@angular/core';
import {ArticleService} from "../../../../shared/services/article/article.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CategorySelectorComponent} from "../category-selector/category-selector.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgForOf, NgIf} from "@angular/common";
import {Category, CategoryService} from "../../../../shared/services/category/category.service";
import {FileUploadService} from "../../../../shared/services/file-upload/file-upload.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatChipGrid, MatChipInput, MatChipRemove, MatChipRow, MatChip, MatChipListbox} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {NgxCurrencyDirective} from "ngx-currency";

@Component({
  selector: 'app-update-article',
  standalone: true,
  imports: [
    CategorySelectorComponent,
    FormsModule,
    MatProgressSpinner,
    NgForOf,
    ReactiveFormsModule,
    MatIcon,
    NgIf,
    MatChipGrid,
    MatChipRow,
    MatChipInput,
    MatChipRemove,
    MatChip,
    MatChipListbox,
    NgxCurrencyDirective,

  ],
  template: `
    <section class="">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto">

        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">

            <div class="flex flex-col items-center gap-4">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
                Update {{ articleName }}
              </h1>
              <img [src]="existingImage" height="200" alt="" class="rounded-2xl">
            </div>

            <form class="space-y-4 md:space-y-6" [formGroup]="updateForm" (ngSubmit)="onSubmit()">

              <div class="mb-4">
                <label for="beschreibung"
                       class="block mb-2 text-sm font-medium text-gray-900">Beschreibung</label>
                <textarea id="beschreibung" formControlName="beschreibung"
                          class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                @if (updateForm.get('beschreibung')?.hasError('required') && updateForm.get('beschreibung')?.touched) {
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
                <label for="grundpreis" class="block mb-2 text-sm font-medium text-gray-900">Grundpreis pro
                  Tag</label>
                <input id="grundpreis"
                       type="text"
                       [currencyMask]="{ suffix: '€ ', thousands: '.', decimal: ',', precision: 2 }"
                       formControlName="grundpreis"
                       class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                @if (updateForm.get('grundpreis')?.hasError('required') && updateForm.get('grundpreis')?.touched) {
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
                <label class="block mb-2 text-sm font-medium text-gray-900">Kategorie hinzufügen</label>
                <app-category-selector
                    [allCategories]="categories"
                    [existingCategories]="selectedCategories"
                    (categoriesChanged)="onCategoriesChanged($event)">
                </app-category-selector>
              </div>


              <div>
                <button type="submit" [disabled]="updateForm.invalid"
                        class="bg-blue-500 text-white py-2 px-4 rounded">
                  Update Article
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class UpdateArticleComponent implements OnInit{

  articleId: number = 0
  existingImage: string | ArrayBuffer | null | undefined = null
  categories: Category[] = [];
  selectedCategories: Category[] = [];
  updateForm!: FormGroup
  selectedFile: File | undefined;
  private _snackBar = inject(MatSnackBar);
  showGenerateDescriptionButton = true;
  articleName: string = ""
  originalArticle: any;



  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,
              private fileUploadService: FileUploadService,
              private categoryService: CategoryService,
              private router: Router,
              private fb: FormBuilder) {

  }

  ngOnInit() {
    this.articleId = this.activatedRoute.snapshot.params["id"]

    this.updateForm = this.fb.group({
      beschreibung: ['', Validators.required],
      grundpreis: [0.0, Validators.required],
      bildUrl: [''],
      categories: [[], Validators.required],
    })

    this.getArticleById()
    this.loadCategories()

    this.updateForm.get('bezeichnung')?.valueChanges.subscribe(value => {
      this.showGenerateDescriptionButton = (value && value.trim().length > 0);
    });
  }

  getArticleById(){
    this.articleService.getArticleById(this.articleId).subscribe((res) => {
      console.log(res)
      this.originalArticle = res;
      this.articleName = res.bezeichnung
      this.existingImage = res.bildUrl

      this.updateForm.patchValue({
        beschreibung: res.beschreibung,
        grundpreis: res.grundpreis,
        bildUrl: '',
        categories: res.categories
      });

      this.selectedCategories = res.categories;
    })
  }



  onSelectFile(event: Event){
    const target = event.target as HTMLInputElement;
    if(target.files && target.files[0]){

      this.selectedFile = target.files[0];
      let reader = new FileReader();

      reader.readAsDataURL(target.files[0]);

      reader.onload = (event) => {
        this.existingImage = event.target?.result
      }
    }
  }


  loading = false;
  onGenerateDescription() {
    this.loading = true
    this.articleService.generateDescriptionForName(this.articleName).subscribe(
        (description: string) => {
          this.updateForm.patchValue({ beschreibung: description });
          this.loading = false;
        },
        error => {
          console.error('Fehler beim Generieren der Beschreibung', error);
          this.updateForm.patchValue({ beschreibung: '**Fehler beim Generieren der Beschreibung**' });
          this.loading = false;
        }
    );
  }

  onCategoriesChanged(categories: Category[]): void {
    this.selectedCategories = categories;
    this.updateForm.patchValue({ category: this.selectedCategories });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    }, (err: any) => {
      console.error('Error while lodaing categories', err);
    });
  }


  onSubmit() {
    if (this.updateForm.valid) {
      const formValue = this.updateForm.value;
      let patchPayload: any = {};

      if (formValue.beschreibung && formValue.beschreibung !== this.originalArticle.beschreibung) {
        patchPayload.beschreibung = formValue.beschreibung;
      }
      if (formValue.grundpreis && formValue.grundpreis !== this.originalArticle.grundpreis) {
        patchPayload.grundpreis = formValue.grundpreis;
      }

      if (formValue.categories && JSON.stringify(formValue.categories) !== JSON.stringify(this.originalArticle.categories)) {
        patchPayload.categories = formValue.categories;
      }

      // Upload Image first
      if (this.selectedFile) {
        this.fileUploadService.uploadImage(this.selectedFile).subscribe(
            (uploadResponse) => {
              patchPayload.bildUrl = uploadResponse.fileDownloadUri;
              this.sendPatchRequest(patchPayload);
            },
            (error) => {
              console.error('Error while uploading image', error);
              this._snackBar.open('Error while uploading image', '(╥﹏╥)', {
                duration: 5000,
              });
            }
        );
      } else {
        this.sendPatchRequest(patchPayload);
      }
    } else {
      console.error('Form not valid ┐( ˘ ､ ˘ )┌');
      this._snackBar.open('Form not valid ', ' ┐( ˘ ､ ˘ )┌', {
        duration: 5000,
      });
    }
  }


  sendPatchRequest(patchPayload: any) {
    this.articleService.patchArticle(this.articleId, patchPayload).subscribe(
        (response: any) => {
          this.router.navigateByUrl(`/pdp/article/${this.articleId}`);
          this._snackBar.open('Article updated successfully 🎉', '', {
            duration: 5000,
          });
        },
        (error: any) => {
          console.error('Error updating the article', error);
          this.router.navigateByUrl(`/pdp/article/${this.articleId}`);
          this._snackBar.open('Error updating the article (╥﹏╥)', '', {
            duration: 5000,
          });
        }
    );
  }


}
