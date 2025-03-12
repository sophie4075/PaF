import {Component, OnInit} from '@angular/core';
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
import {MatIcon} from "@angular/material/icon";
import {Nl2brPipe} from "../../../../../Pipes/nl2br.pipe";
import {MarkdownPipe} from "../../../../../Pipes/markdown.pipe";
import {RentalService} from "../../../../../services/rental/rental.service";

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
  templateUrl: './product-detail-page.component.html',
  styles: [':host /deep/ .mdc-text-field--filled:not(.mdc-text-field--disabled) { background-color: transparent !important; }']

})
export class ProductDetailPageComponent implements OnInit {

  articleId: number = 0
  article: Article | undefined
  statuses: string[] = [];
  instances: ArticleInstanceDto[] | undefined;
  isAdminOrStaff = false;
  isAdmin = false;
  showInstancesPanel = false;

  availabilityMessage: string = '';
  available: boolean = false;
  totalPrice: number = 0;

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,
              private statusService: StatusService,
              private instanceService: ArticleInstanceService,
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

  checkAvailability() {
    const start = this.range.get('start')?.value;
    const end = this.range.get('end')?.value;
    if (start && end && this.articleId) {
      this.articleService.checkAvailability(this.articleId, start, end).subscribe(
          result => {
            console.log(result)
            this.available = result.available;
            if (this.available) {
              this.totalPrice = result.totalPrice || 0 ;
            } else {
              this.availabilityMessage = 'Nicht verfügbar in dem ausgewählten Zeitraum';
            }
          },
          error => {
            console.error(error);
            this.availabilityMessage = 'Fehler beim Prüfen der Verfügbarkeit';
            this.available = false;
          }
      );
    } else {
      this.availabilityMessage = '';
      this.available = false;
    }
  }

  onBookArticle() {
    if (!StorageService.getToken()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.bookArticle();
  }

  bookArticle(){
    const start = this.range.get('start')?.value
    const end = this.range.get('end')?.value


    const availableInstanceId = this.instances?.find(inst => inst.status === 'AVAILABLE')?.id;
    if (!availableInstanceId) {
      return;
    }

    const rental = {
      rentalStatus: 'PENDING',
      rentalPositions: [{
        rentalStart: start?.toISOString().split('T')[0],
        rentalEnd: end?.toISOString().split('T')[0],
        //positionPrice: this.totalPrice,
        articleInstance: { id: availableInstanceId }
      }]
    };

   this.rentalService.createRental(rental).subscribe(
        res => {
          console.log('Rental created successfully:', res);
        },
        err => {
          console.error('Error creating rental', err);
        }
    );
  }


}
