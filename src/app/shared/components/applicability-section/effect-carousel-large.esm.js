export default function CarouselSlider({ swiper, on }) {
    on('beforeInit', () => {
        if (swiper.params.effect !== 'carousel') return;
        swiper.classNames.push(`${swiper.params.containerModifierClass}carousel`);
        const overwriteParams = {
            watchSlidesProgress: true,

        };

        Object.assign(swiper.params, overwriteParams);
        Object.assign(swiper.originalParams, overwriteParams);
    });

    on('afterInit', () => {
        swiper.loopFix();
    })

    on('progress', () => {
        if (swiper.params.effect !== 'carousel') return;
        const scaleStep = 0.2;
        const zIndexMax = swiper.slides.length;
        for (let i = 0; i < swiper.slides.length; i += 1) {
            const slideEl = swiper.slides[i];
            const slideProgress = swiper.slides[i].progress;
            const absProgress = Math.abs(slideProgress);
            let modify = 1;
            const zIndex = zIndexMax - Math.abs(Math.round(slideProgress));
            let translateMultiplayer;

            if (zIndex === 38) {
                translateMultiplayer = 73.3;
            } else {
                translateMultiplayer = 79.5;
            }
            if (absProgress > 1) {
                modify = (absProgress - 1) * 0.1 + 1;
            }

            const opacityEls = slideEl.querySelectorAll(
                '.swiper-carousel-animate-opacity',
            );
            const translate =

                slideProgress * modify * translateMultiplayer * (swiper.rtlTranslate ? -1 : 1)
            ;

            const scale = 1 - absProgress * scaleStep;
            slideEl.style.transform = `translateX(${translate}%) scale(${scale})`;
            slideEl.style.zIndex = zIndex;
            if (absProgress > 3.1) {
                slideEl.style.opacity = 0;
            } else {
                slideEl.style.opacity = 1;
            }

            opacityEls.forEach((opacityEl) => {
                opacityEl.style.opacity = 1 - absProgress / 3;
            });
        }
    });

    on('setTransition', (s, duration) => {
        if (swiper.params.effect !== 'carousel') return;
        for (let i = 0; i < swiper.slides.length; i += 1) {
            const slideEl = swiper.slides[i];
            const opacityEls = slideEl.querySelectorAll(
                '.swiper-carousel-animate-opacity',
            );
            slideEl.style.transitionDuration = `${duration}ms`;
            opacityEls.forEach((opacityEl) => {
                opacityEl.style.transitionDuration = `${duration}ms`;
            });
        }
        swiper.loopFix()
    });
}
