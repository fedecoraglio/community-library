import { NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslocoCoreModule } from '../modules/transloco/transloco.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  imports: [AuthModule, TranslocoCoreModule],
  exports: [AuthModule, TranslocoCoreModule],
})
export class CoreModule {
  /**
   * Constructor
   */
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    // Do not allow multiple injections
    if (parentModule) {
      throw new Error(
        'CoreModule has already been loaded. Import this module in the AppModule only.'
      );
    }
  }
}
