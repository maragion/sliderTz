import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';

@Directive({
    selector: '[ownerSwiper]'
})
export class SwiperDirective implements AfterViewInit {
    @Input() public config?: SwiperOptions;

    public constructor(private _el: ElementRef<SwiperContainer>) { }

    public ngAfterViewInit(): void {
        Object.assign(this._el.nativeElement, this.config);
        this._el.nativeElement.initialize();
    }
}
