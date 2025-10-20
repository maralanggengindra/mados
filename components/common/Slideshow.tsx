import React, { useState, useEffect, useRef } from 'react';
import { Promo, View } from '../../types';

interface SlideshowProps {
    slides: Promo[];
    setView: (view: View) => void;
}

export const Slideshow: React.FC<SlideshowProps> = ({ slides, setView }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<number | null>(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = window.setTimeout(
            () =>
                setCurrentIndex((prevIndex) =>
                    prevIndex === slides.length - 1 ? 0 : prevIndex + 1
                ),
            5000 // Change slide every 5 seconds
        );

        return () => {
            resetTimeout();
        };
    }, [currentIndex, slides.length]);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };
    
    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    }

    const handleSlideClick = (storeId?: string) => {
        if (storeId) {
            setView({ page: 'home', detailId: storeId });
        }
    };

    if (!slides || slides.length === 0) {
        return null;
    }

    return (
        <div className="h-48 w-full relative group">
            <div className="w-full h-full rounded-b-lg overflow-hidden">
                 <div
                    className="whitespace-nowrap h-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(${-currentIndex * 100}%)` }}
                >
                    {slides.map((slide) => (
                        <button
                            key={slide.id}
                            onClick={() => handleSlideClick(slide.storeId)}
                            disabled={!slide.storeId}
                            className="w-full h-full inline-block bg-cover bg-center align-top disabled:cursor-default cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 rounded-b-lg"
                            style={{ backgroundImage: `url(${slide.imageUrl})` }}
                            aria-label={`Lihat promo: ${slide.caption}`}
                        >
                            {/* The content is the background image */}
                        </button>
                    ))}
                </div>
            </div>

            {/* Left Arrow */}
            <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-2 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                <button onClick={goToPrevious}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>
            {/* Right Arrow */}
            <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-2 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                <button onClick={goToNext}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((slide, slideIndex) => (
                    <button
                        key={slide.id}
                        onClick={() => goToSlide(slideIndex)}
                        className={`w-2 h-2 rounded-full transition-colors ${currentIndex === slideIndex ? 'bg-white' : 'bg-white/50'}`}
                        aria-label={`Buka slide ${slideIndex + 1}`}
                    ></button>
                ))}
            </div>
        </div>
    );
};