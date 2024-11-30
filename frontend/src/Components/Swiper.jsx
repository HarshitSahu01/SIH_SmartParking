import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'; // Import Swiper React components
import { Navigation, Pagination } from 'swiper/modules'; // Import modules from 'swiper/modules'
import 'swiper/css'; // Import Swiper styles
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RandomSlider = () => {
  // Generate random slides
  const slides = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    content: `Slide ${i + 1} - ${Math.random().toString(36).substr(2, 5)}`,
  }));

  return (
    <div style={{ padding: '10px', maxWidth: '100%', overflowX: 'hidden' }}>
      <h2 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '10px' }}>
        Random Swiper Slider
      </h2>
      <Swiper
        direction="horizontal"
        loop={true}
        pagination={{ clickable: true }}
        // navigation={true}
        spaceBetween={20} // Space between slides
        slidesPerView={1.2} // Display 1 full slide and part of the next
        centeredSlides={true} // Center the current slide
        modules={[Navigation, Pagination]}
        style={{
          paddingBottom: '30px',
        }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '150px',
                backgroundColor: '#e0f7fa',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                fontSize: '1rem',
                fontWeight: 'bold',
                padding: '10px',
              }}
            >
              {slide.content}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RandomSlider;
