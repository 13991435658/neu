import React, { useRef } from "react";
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import stys from './myswiper.module.scss'
import classNames from "classnames";

function SampleNextArrow(props: any) {
  return (
    <div className={classNames(stys.arrow, stys.right)} onClick={props.next}>＞</div>
  );
}

function SamplePrevArrow(props: any) {
  return (
    <div className={classNames(stys.arrow, stys.left)} onClick={props.next}>＜</div>
  );
}
function MyCarousel() {
  let sliderRef = useRef<any>(null);
  const next = () => {
    (sliderRef as any).slickNext();
  };
  const previous = () => {
    (sliderRef as any).slickPrev();
  };
  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    nextArrow: <SampleNextArrow next={next} />,
    prevArrow: <SamplePrevArrow previous={previous} />,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true
  };
  return (
    <div className={stys.swiperBox}>
      <div className={stys.carousel}>
        <Slider ref={(slider: any) => {
          sliderRef = slider;
        }} {...settings}>
          <div>
            <img src={"/images/j1.jpg"} alt="" />
          </div>
          <div>
            <img src={"/images/j2.jpg"} alt="" />
          </div>
          <div>
            <img src={"/images/j3.jpg"} alt="" />
          </div>
          <div>
            <img src={"/images/j4.jpg"} alt="" />
          </div>
          <div>
            <img src={"/images/j5.jpg"} alt="" />
          </div>
        </Slider>
      </div>
      <div style={{ textAlign: "center" }}>

      </div>
    </div>
  );
}

export default MyCarousel;
