import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostListener, Inject,
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
import { DATA } from './data';
import { isPlatformBrowser } from '@angular/common';
import { Autoplay } from 'swiper/modules';

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
    public sliderDilay: any;
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
        modules: [this.currentConfig, Autoplay],
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

    @HostListener('window:resize', ['$event'])
    public onResize(): void {
        this._detectScreenSize();
    }

    @ViewChild('swiper') public swiper!: ElementRef<SwiperContainer>;

    private _detectScreenSize(): void {
        if (isPlatformBrowser(this._platformId)) {
            const windowWidth = window.innerWidth;

            if (windowWidth > 1280) {
                this.currentConfig = EffectCarouselLarge;
            } else {
                this.currentConfig = EffectCarousel;
            }
        }
    }

    public ngOnInit(): void {
        if (typeof document === 'undefined') return;
        this._getCarouselItems();
        this._detectScreenSize();
        this._getCurrentPagination(this.activeGroupIndex);
    }

    public ngAfterViewInit(): void {
        this._getActiveGroup();
        this.getRealSlideIndex(this.realIndex);
        this._setSliderInterval(3000);
        this._toggleAnimation();


        // this.swiper.nativeElement.addEventListener('realindexchange', (e): void => {
        //     // this._getActiveGroup();
        // });

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
                this._toggleAnimation();
            }

            this._getCurrentPagination(this.activeGroupIndex);
            this.cdr.detectChanges();
        });
    }

    private _setSliderInterval(delay: number): void {
        if (this.sliderDilay !== delay) {
            if (this.sliderInterval) {
                clearInterval(this.sliderInterval);
            }

            this.sliderInterval = setInterval(() => {
                this.getRealSlideIndex(this.activePadeIndex);

                const nextIndex = this.realIndex + 1;

                if (nextIndex < this.caruselItems.length - 1) {
                    this.swiper.nativeElement.swiper.slideTo(nextIndex);
                } else {
                    this.swiper.nativeElement.swiper.slideTo(0);
                }
            }, delay);

            this.sliderDilay = delay;
        }

    }


    // Function to change the animation state
    private _toggleAnimation(): void {
        const element = document.querySelector('.carusel-section');
        const keyframes = [
            { opacity: 0 },
            { opacity: 1 },
        ];

        if (element) {
            element.animate(keyframes, 600);
        }
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
        this._toggleAnimation();
    }

    public getRealSlideIndex(index: any): void {
        const swiperSlides = this.swiper.nativeElement.swiper.slides;

        this.realIndex = swiperSlides.findIndex((value: any) => {
            return index === Number(value.index);
        });
    }

    public paginate(index: any): void {
        this.getRealSlideIndex(index);
        this.swiper.nativeElement.swiper.slideTo(this.realIndex);
        this.cdr.detectChanges();
        this.sliderDilay = 0;
        this._setSliderInterval(3000);
    }


    private _getCurrentPagination(index: number): void {
        const itemsPerPage = 5;
        const startIndex = index * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        this.currentPagination = this.caruselItems.slice(startIndex, endIndex);
    }
}
