import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [SidenavComponent, HeaderComponent],
  imports: [
    BrowserModule,
    RouterModule,
    SharedModule,
    // material
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    MatTreeModule,
  ],
  exports: [SidenavComponent, HeaderComponent],
})
export class LayoutModule {}
