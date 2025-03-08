import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PostArticleComponent} from "./components/post-article/post-article.component";
import {AdminDashboardComponent} from "./components/admin-dashboard/admin-dashboard.component";
import {ProductCategoryComponent} from "../../shared/components/products/components/pcp/product-category/product-category.component";
import {UpdateArticleComponent} from "./components/update-article/update-article.component";
import {AdminGuard} from "../../shared/guards/admin/admin-guard.guard";
/**
 * Work in Progess
 * */

const routes: Routes = [
  {path: '', component: AdminDashboardComponent, canActivate: [AdminGuard]},
  {path: 'post-article', component: PostArticleComponent, canActivate: [AdminGuard]},
  {path: "update-article/:id", component: UpdateArticleComponent, canActivate: [AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
