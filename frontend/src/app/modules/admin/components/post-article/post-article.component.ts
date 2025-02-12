import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';
//TODO implement ArticleService
export interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-post-article',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    MatButton,
    RouterLink
  ],
  templateUrl: './post-article.component.html',
  styleUrl: './post-article.component.css'
})
export class PostArticleComponent implements OnInit {
  articleForm!: FormGroup;
  categories: Category[] = [];
  statuses: string[] = [];

  constructor(private fb: FormBuilder,
              //private articleService: ArticleService,
              private router: Router) { }

  ngOnInit() {
    // Formular initialisieren
    this.articleForm = this.fb.group({
      bezeichnung: ['', Validators.required],
      beschreibung: ['', Validators.required],
      stueckzahl: [0, Validators.required],
      grundpreis: [0.0, Validators.required],
      bildUrl: ['', Validators.required],
      category: ['', Validators.required],
      status: ['', Validators.required]
    });

    // Get data from backend
    //this.loadCategories();
    //this.loadStatuses();
  }

  /* loadCategories() {
     this.articleService.getCategories().subscribe((data: Category[]) => {
       this.categories = data;
     }, (err: any) => {
       console.error('Fehler beim Laden der Kategorien', err);
     });
   }*/

  /*loadStatuses() {
    this.articleService.getStates().subscribe((data: string[]) => {
      this.statuses = data;
    }, (err: any) => {
      console.error('Fehler beim Laden der Status', err);
    });

  }*/

  onSubmit() {
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
      /*this.articleService.createArticle(newArticle).subscribe((response: any) => {
        console.log('Artikel erfolgreich angelegt', response);
        // Nach erfolgreicher Anlage zur Artikelübersicht navigieren
        this.router.navigate(['/articles']);
      }, (error: any) => {
        console.error('Fehler beim Anlegen des Artikels', error);
      });*/
    } else {
      console.error('Form not valid');
    }
  }

}
