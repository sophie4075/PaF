import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../../shared/services/article/article.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-update-article',
  standalone: true,
  imports: [],
  templateUrl: './update-article.component.html',
  styleUrl: './update-article.component.css'
})
export class UpdateArticleComponent implements OnInit{

  articleId: number = 0

  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.articleId = this.activatedRoute.snapshot.params["id"]
    this.getArticleById()
  }

  getArticleById(){
    this.articleService.getArticleById(this.articleId).subscribe((res) => {
      console.log(res)
    })
  }





}
