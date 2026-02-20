"use client"

import {forwardRef, memo, useEffect, useState} from "react";
import {Dropdown} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "@/hooks/redux"
import {setCurSeason} from "@/redux/features/movieSlice";
import {useSearchParams} from "next/navigation";

const CustomToggle = forwardRef(({children, onClick}, ref) => {
  return (
    <div className="line-center" ref={ref} onClick={onClick}>
      <i className="fa-solid fa-bars-staggered text-primary"></i>
      {children}
      <i className="fa-solid fa-caret-down"></i>
    </div>
  )
})

const MovieSeasons = ({seasons = [], page = "detail"}) => {
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()

  const {curSeason, cwInfo} = useAppSelector((state) => state.movie)

  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (seasons.length > 0) {
      let season = seasons[seasons.length - 1]
      const ss = searchParams.get('ss') || (cwInfo ? cwInfo.season_number : null)
      if (ss) {
        const foundSS = seasons.find(el => el.season_number === parseInt(ss))
        if (foundSS) season = foundSS
      }

      dispatch(setCurSeason(season))
    }
  }, [seasons, cwInfo]);

  const handleToggleDropdown = (isOpen) => {
    setShowDropdown(isOpen);
  }

  const handleSeasonClick = (season) => {
    dispatch(setCurSeason(season))
    setShowDropdown(false)
  }

  return (
    <Dropdown className="season-dropdown" show={showDropdown} onToggle={handleToggleDropdown}>
      <Dropdown.Toggle as={CustomToggle}>
        Phần {curSeason?.season_number}
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu v-dropdown-menu">
        <div className="dropdown-blank w-100">
          <span>Danh sách phần</span>
        </div>
        <div className="droplist">
          {seasons.map(season => {
            return (
              <a onClick={() => handleSeasonClick(season)} key={`ss-${season._id}`}
                 className={`dropdown-item ${season.season_number === curSeason?.season_number ? 'active' : ''}`}><strong>Phần {season.season_number}</strong></a>
            )
          })}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default memo(MovieSeasons)