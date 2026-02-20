"use client"

import 'swiper/css'
import {Navigation} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import dayjs from "@/utils/dayjs";
import SwiperNextIcon from "@/components/icons/SwiperNext";
import SwiperPrevIcon from "@/components/icons/SwiperPrev";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {useEffect, useState} from "react";
import {setDateSelected} from "@/redux/features/scheduleSlice";

const ScheduleDateSlide = () => {
  const dispatch = useAppDispatch()
  const {dateSelected} = useAppSelector(state => state.schedule)

  const dates = []
  const currentDate = dayjs()
  for (let i = 2; i > 0; i--) {
    dates.push(currentDate.subtract(i, 'day'))
  }
  dates.push(currentDate)
  for (let i = 1; i < 10; i++) {
    dates.push(currentDate.add(i, 'day'))
  }

  useEffect(() => {
    dispatch(setDateSelected(currentDate.format("DD-MM-YYYY")))
  }, [])

  return (
    <div className="sche-slide">
      <div id="schedule-slide" className="cards-slide-wrapper">
        <div className="sw-navigation sche-navigation">
          <button type="button" className="sw-button sw-next">
            <SwiperNextIcon/>
          </button>
          <button type="button" className="sw-button sw-prev">
            <SwiperPrevIcon/>
          </button>
        </div>

        <Swiper className="sche-time"
                modules={[Navigation]}
                pagination={false}
                navigation={{
                  nextEl: `#schedule-slide .sw-next`,
                  prevEl: `#schedule-slide .sw-prev`
                }}
                slidesPerView={3}
                spaceBetween={6}
                breakpoints={{
                  520: {
                    slidesPerView: 3,
                    spaceBetween: 6,
                  },
                  768: {
                    slidesPerView: 4,
                    spaceBetween: 6,
                  },
                  1280: {
                    slidesPerView: 6,
                    spaceBetween: 6,
                  },
                  1400: {
                    slidesPerView: 7,
                    spaceBetween: 6,
                  },
                }}>
          {dates.map((item, index) => (
            <SwiperSlide key={`date-${index}`} onClick={() => dispatch(setDateSelected(item.format("DD-MM-YYYY")))}>
              <div className={`item-time ${dateSelected === item.format("DD-MM-YYYY") ? 'active' : ''}`}>
                <div className="day">{item.format("dddd")}</div>
                <div className="time">{item.format("DD/MM")}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ScheduleDateSlide