import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './auth/components/register/register.component';
import {LoginComponent} from './auth/components/login/login.component';
import {NgModule} from '@angular/core';
import {HomeComponent} from './shared/components/home/home.component';
import {ProductCategoryComponent} from "./shared/components/products/components/pcp/product-category/product-category.component";
import {AuthGuard} from "./shared/guards/auth/auth-guard.guard";
import {AdminGuard} from "./shared/guards/admin/admin-guard.guard";
import {
  ProductDetailPageComponent
} from "./shared/components/products/components/pdp/product-detail-page/product-detail-page.component";
import {ShoppingCartComponent} from "./shared/components/shopping-cart/shopping-cart.component";
import {MagicLoginComponent} from "./auth/components/magic-login/magic-login.component";

export const routes: Routes = [
  {path: "register", component: RegisterComponent},
  {path: "login", component: LoginComponent},
  { path: 'magic-login', component: MagicLoginComponent },
  { path: "", component: HomeComponent },
  { path: "products", component: ProductCategoryComponent},
  { path: "pdp/article/:id", component: ProductDetailPageComponent},
  { path: "cart", component: ShoppingCartComponent, canActivate: [AuthGuard]},

  { path: "admin", canActivate: [AdminGuard],  loadChildren: () => import("./modules/admin/admin.module").then(m => m.AdminModule)},
  { path: "customer", canActivate: [AuthGuard], loadChildren: () => import("./modules/customer/customer.module").then(m => m.CustomerModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRoutes {}
