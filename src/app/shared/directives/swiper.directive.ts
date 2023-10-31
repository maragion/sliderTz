import { AfterViewInit, Directive, ElementRef, Input, PLATFORM_ID } from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';
import { Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
    selector: '[ownerSwiper]'
})
export class SwiperDirective implements AfterViewInit {
    @Input() public config?: SwiperOptions;

    public constructor(
        private _el: ElementRef<SwiperContainer>,
        @Inject(PLATFORM_ID) private _platformId: any,
    ) {
    }

    public ngAfterViewInit(): void {
        if (isPlatformBrowser(this._platformId)) {
            Object.assign(this._el.nativeElement, this.config);
            this._el.nativeElement.initialize();
        }
    }
}
