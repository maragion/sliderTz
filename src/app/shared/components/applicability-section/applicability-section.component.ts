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
import Swiper from 'swiper';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import EffectCarousel from './effect-carousel.esm.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import EffectCarouselLarge from './effect-carousel-large.esm.js';
import { DATA } from './data';
import { isPlatformBrowser } from '@angular/common';
import { Autoplay } from 'swiper/modules';

@Component({
    selector: 'owner-applicability-section',
    templateUrl: './applicability-section.component.html',
    styleUrls: ['./applicability-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,

})
export class ApplicabilitySectionComponent extends BaseComponent implements OnInit {


    public groups: any = DATA;

    public slider: any;
    public sliderDilay: any;
    public sliderInterval: any;

    public activeGroupIndex = 0;
    public activePadeIndex = 0;
    public currentConfig: any;
    public caruselItems: any = [];

    public constructor(public cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) private _platformId: string) {
        super();
        this._detectScreenSize();
    }

    @HostListener('window:resize', ['$event'])
    public onResize(): void {
        this._detectScreenSize();
    }

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
        this._initSwiper();
    }

    private _initSwiper(): void {
        for (let i = 0; i < this.groups.length; i++) {
            const groupIndex = i;
            for (let j = 0; j < this.groups[groupIndex].items.length; j++) {
                this.caruselItems.push({ ...this.groups[groupIndex].items[j], ...{ groupIndex } });
            }
        }
        this.slider = new Swiper('.swiper', {
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
        });


        this.slider.on('slideChange', (e: any): void => {
            this.activePadeIndex = e.realIndex;
            if (this.caruselItems[this.activePadeIndex].groupIndex !== this.activeGroupIndex) {
                this.activeGroupIndex = this.caruselItems[this.activePadeIndex].groupIndex;
                this._toggleAnimation();
            }
            this.cdr.detectChanges();
        });

        this._setSliderInterval(3000);

    }


    private _setSliderInterval(delay: number): void {
        if (this.sliderDilay !== delay) {
            if (this.sliderInterval) {
                clearInterval(this.sliderInterval);
            }

            this.sliderInterval = setInterval(() => {
                const nextIndex = this.activePadeIndex + 1;
                if (nextIndex < this.caruselItems.length) {
                    this.slider.slideTo(nextIndex);
                } else {
                    this.slider.slideTo(0);
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
            element.animate(keyframes, 1000);
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
        const itemIndex = this.caruselItems.findIndex((x: any) => x.groupIndex === this.activeGroupIndex);
        this.paginate(itemIndex);
        this._toggleAnimation();
    }

    public paginate(index: any): void {
        this.slider.slideTo(index);
        this.cdr.detectChanges();
        this.sliderDilay = 0;
        this._setSliderInterval(3000);
    }


}
