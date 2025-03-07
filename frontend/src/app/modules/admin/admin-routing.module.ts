import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PostArticleComponent} from "./components/post-article/post-article.component";
import {AdminDashboardComponent} from "./components/admin-dashboard/admin-dashboard.component";
import {ProductCategoryComponent} from "../products/components/pcp/product-category/product-category.component";

const routes: Routes = [
  {path: "dashboard", component: AdminDashboardComponent},
  {path: "article", component: PostArticleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
