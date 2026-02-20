"use client"

import {useEffect, useState} from "react";
import MovieApi from "@/api/movie.api";
import {useAppSelector} from "@/hooks/redux";
import MovieItemSchedule from "@/components/movie/item/Schedule";

const ScheduleData = () => {
  const {dateSelected} = useAppSelector(state => state.schedule)
  const [schedulesHasTime, setSchedulesHasTime] = useState([])
  const [schedulesNoTime, setSchedulesNoTime] = useState([])

  useEffect(() => {
    const getSchedules = async () => {
      const result = await MovieApi.scheduledEpisodes(dateSelected)
      setSchedulesNoTime(result.filter(el => el.air_time === ""))
      setSchedulesHasTime(result.filter(el => el.air_time))
    }

    if (dateSelected) {
      getSchedules()
    }
  }, [dateSelected])

  return (
    <div className="sche-timeline">
      {schedulesHasTime.length > 0 && <div className="st-row new">
        <div className="items">
          {schedulesHasTime.map(item => {
            return (
              <MovieItemSchedule item={item} key={`s-${item._id}`}/>
            )
          })}
        </div>
      </div>}
      {schedulesNoTime.length > 0 && <div className="st-row new">
        <div className="items">
          {schedulesNoTime.map(item => {
            return (
              <MovieItemSchedule item={item} key={`s-${item._id}`}/>
            )
          })}
        </div>
      </div>}
      {(schedulesHasTime.length === 0 && schedulesNoTime.length === 0) && <div className="v-notice">
        <div className="inc-icon icon-notice">
          <img src="/images/icons/empty-box.svg"/>
        </div>
        <p className="mb-0">Không có lịch chiếu nào</p>
      </div>}
    </div>
  )
}

export default ScheduleData