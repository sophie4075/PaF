import {Component, OnInit,} from '@angular/core';
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
import {ActivatedRoute} from "@angular/router";
import {StatusService} from "../../../../../services/status/status.service";
import {StorageService} from "../../../../../services/storage/storage.service";
import {NgClass, NgForOf} from "@angular/common";
import {
  ArticleInstanceDto,
  ArticleInstanceService
} from "../../../../../services/article-instance/article-instance.service";

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
    NgForOf
  ],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.css'
})
export class ProductDetailPageComponent implements OnInit{

  articleId: number = 0
  article: Article | undefined
  statuses: string[] = [];
  instances: ArticleInstanceDto[] | undefined;
  isAdminOrStaff = false;
  showInstancesPanel = false;

  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,
              private statusService: StatusService,
              private instanceService: ArticleInstanceService) {

  }

  ngOnInit() {
    this.articleId = this.activatedRoute.snapshot.params["id"];
    this.isAdminOrStaff = StorageService.isAdminLoggedIn() || StorageService.isStaffLoggedIn();

    this.getArticleById();
    this.loadStatuses();
    this.loadInstances();
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

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });


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
    // Hier wird nur der Status übermittelt; ID und inventoryNumber werden vom Backend gesetzt
    const newInstance: ArticleInstanceDto = { status: 'PRE_LAUNCH' };
    this.instanceService.addInstance(this.article.id, newInstance).subscribe(
        createdInstance => {
          if(this.instances){
            this.instances.push(createdInstance);
          }

          if (this.article) {
            this.article.articleInstances.push(createdInstance);
          }
        },
        error => console.error('Fehler beim Hinzufügen der Instanz', error)
    );
  }
}
