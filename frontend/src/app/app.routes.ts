import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './auth/components/register/register.component';
import {LoginComponent} from './auth/components/login/login.component';
import {NgModule} from '@angular/core';
import {HomeComponent} from './modules/home/home/home.component';
import {ProductCategoryComponent} from "./modules/products/components/pcp/product-category/product-category.component";

export const routes: Routes = [
  {path: "register", component: RegisterComponent},
  {path: "login", component: LoginComponent},
  { path: "admin", loadChildren: () => import("./modules/admin/admin.module").then(m => m.AdminModule)},
  { path: "customer", loadChildren: () => import("./modules/customer/customer.module").then(m => m.CustomerModule)},
  { path: '', component: HomeComponent },
  { path: "products", component: ProductCategoryComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRoutes {}
