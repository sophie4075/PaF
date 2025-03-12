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
  templateUrl: './post-article.component.html',
  styleUrl: './post-article.component.css'
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
    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    }, (err: any) => {
      console.error('Fehler beim Laden der Kategorien', err);
    });
  }

  loadStatuses() {
    this.statusService.getStatuses().subscribe(
        (data: string[]) => {this.statuses = data;},
        (error: any) => { console.error('Fehler beim Laden der Status', error); }
    );
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
        this.fileUploadService.uploadImage(this.selectedFile).subscribe(
            (uploadResponse) => {
              // Get URL from Upload response
              const imageUrl = uploadResponse.fileDownloadUri;

              // Erstelle den Artikel, wobei das Bild über die URL referenziert wird
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
              //TODO: remove deprecated implementation
              this.articleService.createArticle(newArticle).subscribe(
                  (response: any) => {
                    this.router.navigateByUrl('/admin')
                    this._snackBar.open('Created article successfully ', '🎉', {
                      duration: 5000,
                    });
                  },
                  (error: any) => {
                    console.error('Error while creating the article', error);
                    this.router.navigateByUrl("/admin/post-article")
                    this._snackBar.open('Error while creating the article ', '(╥﹏╥)', {
                      duration: 5000,
                    });
                  }
              );
            },
            (error) => {
              console.error('Error while uploading image', error);
              this._snackBar.open('Error while uploading image ', '(╥﹏╥)', {
                duration: 5000,
              });
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
            console.error('Fehler beim Generieren der Beschreibung', error);
            this.articleForm.patchValue({ beschreibung: '**Fehler beim Generieren der Beschreibung**' });
            this.loading = false;
          }
      );
    }
  }


}
