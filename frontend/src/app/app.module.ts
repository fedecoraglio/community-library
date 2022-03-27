import {
  CUSTOM_ELEMENTS_SCHEMA,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/es-AR';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './core/layout/layout.module';

registerLocaleData(localeAr);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSidenavModule,
    MatProgressBarModule,
    CoreModule,
    SharedModule,
    LayoutModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'es-AR',
    },
    { provide: DEFAULT_CURRENCY_CODE, useValue: '$' },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
