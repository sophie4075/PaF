import {Component, OnInit} from '@angular/core';
import {Article, ArticleService} from "../../../../../core/services/article/article.service";
import {Category, CategoryService} from "../../../../../core/services/category/category.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.css'
})
export class ProductCategoryComponent implements OnInit{
  articles: Article[] = [];
  categories: Category[] = [];
  filterForm: FormGroup;

  minPrice: number = 0;
  maxPrice: number = 0;

  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      selectedCategories: [[]],
      priceRange: [[this.minPrice, this.maxPrice]],
      startDate: [''],
      endDate: ['']
    });

  }

  ngOnInit() {
    this.getAllArticles()
    this.getAllCategories()
  }

  getAllArticles(){
    this.articleService.getArticles().subscribe((res) => {
      console.log(res)
      this.articles = res;
      this.minPrice = this.findMinVal(this.articles, "grundpreis");
      this.maxPrice = this.findMaxVal(this.articles, "grundpreis");

      this.filterForm.patchValue({
        priceRange: [this.minPrice, this.maxPrice]
      });

    })
  }

  getAllCategories(){
    this.categoryService.getCategories().subscribe((cat) => {
      this.categories = cat;
    })
  }

  onCategoryChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const categoryId = target.value;
    let selected: number[] = this.filterForm.get('selectedCategories')?.value || [];
    if (target.checked) {
      selected.push(+categoryId);
    } else {
      selected = selected.filter(id => id !== +categoryId);
    }
    this.filterForm.get('selectedCategories')?.setValue(selected);
  }


  applyFilters() {
    const filters = this.filterForm.value;
    console.log(filters)
    this.articleService.getFilteredArticles(filters).subscribe((filteredArticles) => {
      console.log(filteredArticles);
      this.articles = filteredArticles;
    });
  }

  findMinVal(article: Array<Article>, property: "grundpreis" | "stueckzahl"): number{
    return article.reduce((min, obj) => {
      return obj[property] < min ? obj[property] : min;
    }, Infinity);
  }

  findMaxVal(article: Array<Article>, property: "grundpreis" | "stueckzahl"): number{
    return article.reduce((max, obj) => {
      return obj[property] > max ? obj[property] : max;
    }, -Infinity);
  }


}
