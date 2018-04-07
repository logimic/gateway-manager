import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpModule  } from '@angular/http';
// import { CobaltProgressComponent } from '../component/cobalt.progress';
// import { CobaltPanelComponent } from '../component/cobalt.panel';
// import { CobaltCanvasComponent, Cobalt3dComponent } from '../cobalt/cobalt.component';
import { GatewayModel } from '../gateway/gateway.model';
import { GatewayService, ConfigService } from '../gateway/gateway.service';
// import { CobaltDirectionButtonComponent } from '../component/cobalt.direction.button';
// import { CobaltControlModeComponent } from '../component/cobalt.control.mode.panel';
// import { CobaltSwitchModeComponent } from '../component/cobalt.switch.mode';
// import { CobaltLearningPlistComponent } from '../component/cobalt.learning.plist';
import { GatewayStatusComponent} from '../component/gateway.status.component';
import { GatewayCommandsComponent} from '../component/gateway.commands.component';
// import { CobaltSlider} from '../component/cobalt.slider';
// import { CobaltFileDialog} from '../component/cobalt.file.dialog';
import { ZoomDirectionComponent } from '../component/zoom.direction.component';
// import { WebGlComponent } from '../webgl/webgl.component';
// import { StlService } from '../webgl/stl.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
/*
import {FileNameDialogComponent} from '../component/file.name.dialog.component';
import {WorkpointDialogComponent} from '../component/workpoint.dialog.component';
import {ConfirmDialogComponent} from '../component/confirm.dialog.component';
import {EndgrabDialogComponent} from '../component/endgrab.dialog.component';
import {SaveDialogComponent} from '../component/save.dialog.component';
import {MessagePanelComponent} from '../component/message.panel.component';
*/

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
  GatewayStatusComponent,
   // WebGlComponent,
    ZoomDirectionComponent
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
    ConfigService,
    GatewayService,
    GatewayModel
   // StlService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [

  ]
})
export class AppModule { }
