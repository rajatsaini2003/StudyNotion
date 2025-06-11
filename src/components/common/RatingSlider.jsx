import React, { useEffect, useState } from 'react'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import {Swiper , SwiperSlide} from "swiper/react"
import { Autoplay,FreeMode,Navigation, Pagination } from 'swiper/modules'
import ReactStars from "react-rating-stars-component"
import { apiConnector } from '../../services/apiconnector'
import { ratingsEndpoints } from '../../services/apis'
import { FaStar } from 'react-icons/fa'


const RatingSlider = () => {
    const [reviews, setReviews] = useState([]);
    const truncateWords = 30;
    const [slidesPerView, setSlidesPerView] = useState(3);

    const updateSlidesPerView = () => {
        if (window.innerWidth < 750) {
        setSlidesPerView(1);
        } else if (window.innerWidth < 1100) {
        setSlidesPerView(2);
        } else {
        setSlidesPerView(3);
        }
    };


    useEffect(() => {
        updateSlidesPerView();
        window.addEventListener('resize', updateSlidesPerView);
        return () => {
        window.removeEventListener('resize', updateSlidesPerView);
    };})
    const fetchReviews = async()=>{
        const res = await apiConnector("GET",ratingsEndpoints.REVIEWS_DETAILS_API);
        console.log("rating : ",res);
        const data = res.data.data;
        console.log(data)
        if(res?.data?.success){
           setReviews(data);
            console.log("printing reviews:", reviews);
        }

    }
    useEffect(()=>{
        fetchReviews();
    },[])
  return (
    <div className="text-lg">
      <div className="my-[50px] border-2 border-white p-4 h-fitContent max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          slidesPerView={slidesPerView} 
          spaceBetween={30}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay, Navigation]} // Include Navigation module
          navigation={true} // Enable navigation
          className="w-11/12 h-fitContent"
        >
          {reviews.map((review, i) => {
            return (
              <SwiperSlide key={i}>
                <div className="flex flex-col gap-1  bg-richblack-800 rounded-xl p-3 text-[14px] text-richblack-25 ">
                  <div className="flex items-center gap-2 text-2xl">
                    <img 
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt=""
                      className="h-12 w-12 rounded-full object-cover mx-5 my-2"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                      <h2 className="text-[12px] font-medium text-richblack-500">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>
                  <p className="font-medium text-richblack-5 italic p-8 text-center">
                    {review?.review.split(" ").length > truncateWords
                      ? `"${review?.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ..."`
                      : `"${review?.review}"`}
                  </p>
                  <div className="mx-auto">
                  <div className="flex items-center gap-2">
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={20}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                      />
                  </div>
                    <h3 className="font-semibold text-yellow-100 text-center">
                      {review.rating.toFixed(1)}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default RatingSlider;
