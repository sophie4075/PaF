import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../../shared/services/article/article.service";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit{

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.getAllCars()
  }

  getAllCars(){
    this.articleService.getArticles().subscribe((res) => {
      console.log(res)
    })
  }
}
