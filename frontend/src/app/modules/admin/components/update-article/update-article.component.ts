import {Component, inject, OnInit} from '@angular/core';
import {Article, ArticleService} from "../../../../shared/services/article/article.service";
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
  templateUrl: './update-article.component.html',
  styleUrl: './update-article.component.css'
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
