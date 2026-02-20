"use client"

import {useSearchParams} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {useEffect, useState} from "react";
import {updateFilterCast} from "@/redux/features/appSlice";

const CastFilter = () => {
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const {filterCast} = useAppSelector(state => state.app)
  const [showFilter, setShowFilter] = useState(false)
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState({
    countries: searchParams.get('countries') ? searchParams.get('countries').split(',') : [],
    gender: searchParams.get('type') || "",
    sort: searchParams.get('sort') || "",
    page: Number(searchParams.get('page')) || 1,
  })

  useEffect(() => {
    dispatch(updateFilterCast(filter))
  }, [])

  useEffect(() => {
    if (filterCast) {
      const queryString = Object.keys(filterCast).map(key => key + '=' + filterCast[key]).join('&')
      window.history.replaceState({}, '', `/dien-vien?${queryString}`)
    }
  }, [filterCast]);

  const handleFilterClick = () => {
    dispatch(updateFilterCast(filter))
  }

  return (
    <div id="filter-actors" className="v-filter">
      <div className={`filter-toggle line-center ${showFilter ? "toggled" : ""}`}
           onClick={() => setShowFilter(!showFilter)}>
        <i className="fa-solid fa-filter"></i>
        <span>Mở bộ lọc</span>
      </div>
      <div className={`filter-elements ${!showFilter ? "d-none" : ""}`}>
        <div className="fe-row">
          <div className="fe-name">
            Quốc gia:
          </div>
          <div className="fe-results">
            <div className="item active">Tất cả</div>
            <div className="item">Hàn Quốc</div>
            <div className="item">Trung Quốc</div>
            <div className="item">Âu - Mỹ</div>
            <div className="item">Thái Lan</div>
            <div className="item">Việt Nam</div>
            <div className="item">Nhật Bản</div>
            <div className="item">Đài Loan</div>
            <div className="item">khác</div>
          </div>
        </div>
        <div className="fe-row">
          <div className="fe-name">
            Giới tính
          </div>
          <div className="fe-results">
            <div className="item active">Tất cả</div>
            <div className="item">Nam</div>
            <div className="item">Nữ</div>
            <div className="item">Không xác định</div>
          </div>
        </div>
        <div className="fe-row">
          <div className="fe-name">
            Sắp xếp:
          </div>
          <div className="fe-results">
            <div className="item active">Lượt xem</div>
            <div className="item">Mới nhất</div>
          </div>
        </div>
        <div className="fe-row fe-row-end">
          <div className="fe-name">
            &nbsp;
          </div>
          <div className="fe-buttons flex-grow-1">
            <button type="button" className="btn btn-rounded btn-primary" onClick={() => handleFilterClick()}>
              Lọc kết quả <i className="fa-solid fa-arrow-right"></i>
            </button>
            <button type="button" id="close-filter" className="btn btn-rounded btn-outline ms-2 px-4"
                    onClick={() => setShowFilter(false)}>Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CastFilter