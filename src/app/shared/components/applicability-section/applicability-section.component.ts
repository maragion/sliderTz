import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    ViewEncapsulation,
    PLATFORM_ID,
} from '@angular/core';
import { BaseComponent } from '@core/classes/base-component';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import EffectCarousel from './effect-carousel.esm.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import EffectCarouselLarge from './effect-carousel-large.esm.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import EffectCarouselSmall from './effect-carousel-small.esm.js';
import { DATA } from './data';
import { isPlatformBrowser } from '@angular/common';

import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';


@Component({
    selector: 'owner-applicability-section',
    templateUrl: './applicability-section.component.html',
    styleUrls: ['./applicability-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,

})
export class ApplicabilitySectionComponent extends BaseComponent implements OnInit, AfterViewInit {

    public groups: any = DATA;
    public sliderDelay: any;
    public sliderInterval: any;
    public activeGroupIndex = 0;
    public activePadeIndex = 0;
    public currentConfig: any = EffectCarouselLarge;
    public caruselItems: any = [];
    public currentPagination: any = [];
    public realIndex = 0;

    // Swiper
    public swiperConfig: SwiperOptions = {
        loop: true,
        effect: 'carousel',
        slidesPerView: 'auto',
        shortSwipes: true,
        centeredSlides: true,
        grabCursor: false,
        speed: 500,
        resizeObserver: true,
        slideToClickedSlide: true,
    };

    public constructor(public cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) private _platformId: string) {
        super();
        this._detectScreenSize();
    }

    @ViewChild('swiper') public swiper!: ElementRef<SwiperContainer>;

    private _detectScreenSize(): void {
        if (isPlatformBrowser(this._platformId)) {
            const windowWidth = window.innerWidth;

            if (windowWidth > 1280) {
                this.currentConfig = EffectCarouselLarge;
            } else if (windowWidth < 481) {
                this.currentConfig = EffectCarouselSmall;
            } else {
                this.currentConfig = EffectCarousel;
            }
        }
    }

    public ngOnInit(): void {
        if (typeof document === 'undefined') return;
        this._detectScreenSize();
        this.swiperConfig.modules = [this.currentConfig];
        this._getCarouselItems();
        this._getCurrentPagination(this.activeGroupIndex);
    }

    public ngAfterViewInit(): void {
        if (isPlatformBrowser(this._platformId)) {
            this._getActiveGroup();
            this._getRealSlideIndex(this.realIndex);
            this._setSliderInterval(3000);
            this._stopOnInteraction();
            this._resumeSlideScroll();
        }

    }

    private _getCarouselItems(): void {
        let counter = 0;

        for (let i = 0; i < this.groups.length; i++) {
            const groupIndex = i;

            for (let j = 0; j < this.groups[groupIndex].items.length; j++) {
                this.caruselItems.push({ ...this.groups[groupIndex].items[j], ...{ groupIndex }, id: counter });
                counter++;
            }
        }
    }

    private _getActiveGroup(): void {
        this.swiper.nativeElement.swiper.on('slideChange', (e: any): void => {
            this.activePadeIndex = e.realIndex;

            if (this.caruselItems[this.activePadeIndex].groupIndex !== this.activeGroupIndex) {
                this.activeGroupIndex = this.caruselItems[this.activePadeIndex].groupIndex;
            }

            this._getCurrentPagination(this.activeGroupIndex);
            this.cdr.detectChanges();
        });
    }

    private _setSliderInterval(delay: number): void {
        if (this.sliderDelay !== delay) {
            if (this.sliderInterval) {
                clearInterval(this.sliderInterval);
            }

            this.sliderInterval = setInterval(() => {
                this._getRealSlideIndex(this.activePadeIndex);

                const nextIndex = this.realIndex + 1;

                if (nextIndex < this.caruselItems.length - 1) {
                    this.swiper.nativeElement.swiper.slideTo(nextIndex);
                } else {
                    this.swiper.nativeElement.swiper.slideTo(0);
                }
            }, delay);

            this.sliderDelay = delay;
        }
    }

    private _stopOnInteraction(): void {
        this.swiper.nativeElement.addEventListener('touchstart', ev => {
            clearInterval(this.sliderInterval);
            this.sliderDelay = 0;
        });
    }

    private _resumeSlideScroll(): void {
        this.swiper.nativeElement.addEventListener('touchend', ev => {
            this._setSliderInterval(6000);
        });
    }

    public mouseEnter(): void {
        this._setSliderInterval(6000);
    }

    public mouseLeave(): void {
        this._setSliderInterval(3000);
    }

    public changeActiveSlider(index: number): void {
        if (index === this.activeGroupIndex) {
            return;
        }

        this.activeGroupIndex = index;
        this._getCurrentPagination(this.activeGroupIndex);

        const itemIndex = this.caruselItems.findIndex((x: any) => x.groupIndex === this.activeGroupIndex);

        this.paginate(itemIndex);
    }

    // Pagination
    private _getRealSlideIndex(index: any): void {
        const swiperSlides = this.swiper.nativeElement.swiper.slides;

        this.realIndex = swiperSlides.findIndex((value: any) => {
            return index === Number(value.index);
        });
    }

    public paginate(index: any): void {
        this._getRealSlideIndex(index);
        this.swiper.nativeElement.swiper.slideTo(this.realIndex);
        this.cdr.detectChanges();
        this.sliderDelay = 0;
        this._setSliderInterval(3000);
    }

    private _getCurrentPagination(index: number): void {
        const itemsPerPage = 5;
        const startIndex = index * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        this.currentPagination = this.caruselItems.slice(startIndex, endIndex);
    }
}
