import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { HamburgerComponent } from './components/hamburger/hamburger.component';
import { TurnOverComponent } from './components/turn-over/turn-over.component';
import { IfIsBrowserDirective } from '@shared/directives/if-is-browser.directive';
import { NgZorroAntdModule } from './ng-zorro-antd/ng-zorro-antd.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {
    ApplicabilitySectionComponent,
} from '@shared/components/applicability-section/applicability-section.component';
import { SwiperDirective } from './directives/swiper.directive';
import { register } from 'swiper/element/bundle';

register();

const OWNER_MODULES_EXPORT = [CommonModule];

@NgModule({
    declarations: [
        HeaderComponent,
        HamburgerComponent,
        TurnOverComponent,

        IfIsBrowserDirective,
        ApplicabilitySectionComponent,
        SwiperDirective,
    ],
    imports: [...OWNER_MODULES_EXPORT, NgOptimizedImage, NgZorroAntdModule, FormsModule, ReactiveFormsModule],
    exports: [
        HeaderComponent,
        ApplicabilitySectionComponent,
        TurnOverComponent,

        IfIsBrowserDirective,

        ...OWNER_MODULES_EXPORT,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {
}
