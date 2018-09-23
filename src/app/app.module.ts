import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpModule  } from '@angular/http';
import { GatewayModel } from '../gateway/gateway.model';
import { GatewayService } from '../gateway/gateway.service';
import { GatewayStatusComponent} from '../component/gateway.status.component';
import { GatewayCommandsComponent} from '../component/gateway.commands.component';
import { GatewayScenarioComponent} from '../component/gateway.scenario.component';
import { GatewayTitleComponent} from '../component/gateway.title.component';
import { GatewayMsgPlainComponent} from '../component/gateway.msg.plain.component';
import { GatewayMsgConcComponent} from '../component/gateway.msg.conc.component';
import { GatewayMsgContainerComponent} from '../component/gateway.msg.container.component';
import { GatewayMessageListComponent} from '../component/gateway.message.list.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {A11yModule} from '@angular/cdk/a11y';
import {BidiModule} from '@angular/cdk/bidi';
import {ObserversModule} from '@angular/cdk/observers';
import {OverlayModule} from '@angular/cdk/overlay';
import {PlatformModule} from '@angular/cdk/platform';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';


import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import {AppComponent} from './app.component';

/**
 * NgModule that includes all Material modules that are required to serve.
 * the Plunker.
 */
@NgModule({
  exports: [
    // CDK
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    ScrollDispatchModule,
    CdkStepperModule,
    CdkTableModule,

    // Material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule
  ]
})
export class MaterialModule {}

@NgModule({
  declarations: [
    AppComponent,
    GatewayCommandsComponent,
    GatewayScenarioComponent,
    GatewayStatusComponent,
    GatewayTitleComponent,
    GatewayMsgPlainComponent,
    GatewayMsgConcComponent,
    GatewayMsgContainerComponent,
    GatewayMessageListComponent
   // WebGlComponent,
   // ZoomDirectionComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MaterialModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    GatewayService,
    GatewayModel
   // StlService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [

  ]
})
export class AppModule { }
