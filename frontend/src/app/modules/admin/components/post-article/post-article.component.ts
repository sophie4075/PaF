import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe, NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {ArticleService} from "../../../../core/services/article/article.service";
import {FileUploadService} from "../../../../core/services/file-upload/file-upload.service";
import {Category, CategoryService} from '../../../../core/services/category/category.service';
import {StatusService} from '../../../../core/services/status/status.service';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatChipGrid, MatChipInput, MatChipRow} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {CategorySelectorComponent} from "../../../../shared/category-selector/category-selector.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

//TODO implement ArticleService
/*export interface Category {
  id: number;
  name: string;
} */

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
  //imagePreview: string | ArrayBuffer | undefined;

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
      status: ['', Validators.required]
    });

    this.articleForm.get('bezeichnung')?.valueChanges.subscribe(value => {
      this.showGenerateDescriptionButton = (value && value.trim().length > 0);
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

  /*onSubmit() {
    if (this.articleForm.valid) {
      const formValue = this.articleForm.value;

      const newArticle = {
        bezeichnung: formValue.bezeichnung,
        beschreibung: formValue.beschreibung,
        stueckzahl: formValue.stueckzahl,
        grundpreis: formValue.grundpreis,
        bildUrl: formValue.bildUrl,
        category: { id: formValue.category },
        articleInstances: [{

          status: formValue.status,
          // TODO
          inventoryNumber: null
        }]
      };

      //TODO
      this.articleService.createArticle(newArticle).subscribe((response: any) => {
        console.log('Artikel erfolgreich angelegt', response);
        // Nach erfolgreicher Anlage zur Artikelübersicht navigieren
        this.router.navigate(['/articles']);
      }, (error: any) => {
        console.error('Fehler beim Anlegen des Artikels', error);
      });
    } else {
      console.error('Form not valid');
    }
  }*/

  onSubmit() {
    if (this.articleForm.valid) {
      // Wenn ein Bild ausgewählt wurde, zuerst hochladen
      if (this.selectedFile) {
        this.fileUploadService.uploadImage(this.selectedFile).subscribe(
            (uploadResponse) => {
              // Erhalte die URL aus der Upload-Antwort
              const imageUrl = uploadResponse.fileDownloadUri;

              // Erstelle den Artikel, wobei das Bild über die URL referenziert wird
              const formValue = this.articleForm.value;
              const newArticle = {
                bezeichnung: formValue.bezeichnung,
                beschreibung: formValue.beschreibung,
                stueckzahl: formValue.stueckzahl,
                grundpreis: formValue.grundpreis,
                bildUrl: imageUrl,  // Setze die hochgeladene Bild-URL
                //category: { id: formValue.category },
                categories: this.selectedCategories,
                articleInstances: [{
                  status: formValue.status,
                  inventoryNumber: null
                }]
              };
              this.articleService.createArticle(newArticle).subscribe(
                  (response: any) => {
                    console.log('Created article successfully ', response);
                  },
                  (error: any) => {
                    console.error('Error while creating the article', error);
                  }
              );
            },
            (error) => {
              console.error('Error while uploading image', error);
            }
        );
      } else {
        console.error('No Image selected');
      }
    } else {
      console.error('Form not valid');
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
