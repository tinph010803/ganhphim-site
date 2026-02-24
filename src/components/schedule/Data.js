"use client"

import {useEffect, useState} from "react";
import MovieApi from "@/api/movie.api";
import {useAppSelector} from "@/hooks/redux";
import MovieItemSchedule from "@/components/movie/item/Schedule";

const ScheduleData = () => {
  const {dateSelected} = useAppSelector(state => state.schedule)
  const [schedulesHasTime, setSchedulesHasTime] = useState([])
  const [schedulesNoTime, setSchedulesNoTime] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getSchedules = async () => {
      setLoading(true)
      // dateSelected is DD-MM-YYYY, convert to YYYY-MM-DD for the API
      const [day, month, year] = dateSelected.split('-')
      const apiDate = `${year}-${month}-${day}`
      const result = await MovieApi.showtimesByDate(apiDate)
      setSchedulesHasTime(result.filter(el => el.show_time))
      setSchedulesNoTime(result.filter(el => !el.show_time))
      setLoading(false)
    }

    if (dateSelected) {
      getSchedules()
    }
  }, [dateSelected])

  if (loading) return (
    <div className="v-notice">
      <p className="mb-0">Đang tải lịch chiếu...</p>
    </div>
  )

  return (
    <div className="sche-timeline">
      {schedulesHasTime.length > 0 && <div className="st-row new">
        <div className="items">
          {schedulesHasTime.map(item => (
            <MovieItemSchedule item={item} key={`s-${item.id}`}/>
          ))}
        </div>
      </div>}
      {schedulesNoTime.length > 0 && <div className="st-row new">
        <div className="items">
          {schedulesNoTime.map(item => (
            <MovieItemSchedule item={item} key={`s-${item.id}`}/>
          ))}
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