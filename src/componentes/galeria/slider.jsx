import React from 'react';

/* Importação das bibliotecas padrões do SwiperJS */
import { Swiper } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/* Estilização personalizada para o SwiperJS */
import './slider.css';

const Slider = ({ settings, children }) => {
  return (
    <Swiper modules={[Navigation, Pagination, A11y]} {...settings}>
      {children}
    </Swiper>
  );
};

export default Slider;