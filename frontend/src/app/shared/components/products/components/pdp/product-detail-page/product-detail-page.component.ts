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
  templateUrl: './product-detail-page.component.html',
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


      this._snackBar.open('Article(s) added to cart! ', '🛍️', {
        duration: 5000,
      });


    }else {
      this._snackBar.open('Error while adding articles to cart ', ':/', {
        duration: 5000,
      });
    }
  }


}

/*onBookArticle() {
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
      rental: {
        rentalStatus: 'PENDING'
      },
      rentalPositions: [{
        rentalStart: start?.toISOString().split('T')[0],
        rentalEnd: end?.toISOString().split('T')[0],
        articleInstance: { id: availableInstanceId }
      }]
    };

   this.rentalService.createRental(rental).subscribe(
        res => {
          console.log('Rental created successfully:', res);
          console.log(rental)
        },
        err => {
          console.error('Error creating rental', err);
          console.log(rental)
        }
    );
  }*/
