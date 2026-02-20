"use client"

import {memo} from "react";
import CollectionMovieList from "@/components/collection/MovieList";
import MovieFilter from "@/components/movie/Filter";

const CollectionDetailContentEvent304 = ({collection}) => {
  const initFilter = {}
  if (collection.type === 2) {
    if (collection.filter.type) initFilter.type = collection.filter.type
    if (collection.filter.status) initFilter.status = collection.filter.status
    if (collection.filter.country_code) initFilter.countries = collection.filter.country_code
    if (collection.filter.genre_ids) initFilter.genres = collection.filter.genre_ids
    if (collection.filter.years) initFilter.years = collection.filter.years
    if (collection.filter.versions) initFilter.versions = collection.filter.versions
    if (collection.filter.rating) initFilter.rating = collection.filter.rating
    if (collection.filter.sort_by) initFilter.sort = collection.filter.sort_by
  }

  return (
    <div id="wrapper" className="wrapper-topic gpmn-topic">
      <div className="topic-background" style={{backgroundColor: `${collection.color}`}}></div>
      <div className="fluid-gap">
        <div className="cards-row fixed">
          <div className="d-flex justify-content-between gpmn-topic-head">
            <div className="flex-shink-0">
              <div className="object-fit">
                <img src="/images/event_304/page-vn-flag.jpg"/>
              </div>
            </div>
            <div className="flex-grow-1">
              <div className="row-header mb-2">
                <h3 className="category-name">Kỷ niệm 50 Năm Ngày Giải Phóng Miền Nam - Thống Nhất Đất Nước</h3>
              </div>
              <div className="row-content">
                <h4 className="heading-md text-primary mb-4">30/04/1975 - 30/04/2025</h4>
                <div className="article-body">
                  <p>11 giờ 30 phút trưa 30/4/1975, cổng Dinh Độc Lập đã bị húc đổ, lá cờ của Quân Giải phóng tung bay
                    ngay tại tổng hành dinh của chính quyền Sài Gòn trong niềm hân hoan, chờ đón của cả dân tộc. Từ đây,
                    miền Nam đã hoàn toàn giải phóng, non sông Việt Nam thống nhất một dải. Đây là thắng lợi vĩ đại
                    nhất, kết thúc 30 năm chiến tranh lâu dài, gian khổ chống ngoại xâm của dân tộc Việt Nam, mở ra một
                    kỷ nguyên mới - kỷ nguyên độc lập dân tộc và chủ nghĩa xã hội trên toàn bộ Tổ quốc Việt Nam.</p>
                  <p>Chiến dịch Hồ Chí Minh đánh dấu bước ngoặt lớn trong lịch sử dân tộc, đã hoàn thành trọn vẹn mục
                    tiêu “Đánh cho Mỹ cút, đánh cho ngụy nhào” như Chủ tịch Hồ Chí Minh đề ra; giải phóng toàn bộ miền
                    Nam, chấm dứt 21 năm chia cắt đất nước, đưa đến sự thống nhất, độc lập, chủ quyền toàn vẹn lãnh thổ
                    của Việt Nam trên đất liền, vùng trời, vùng biển; đưa dân tộc ta bước vào kỷ nguyên mới.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="cards-row fixed">
          <div className="row-header">
            <h3 className="category-name">Phim Lịch Sử</h3>
          </div>
          <MovieFilter initFilter={initFilter} allowFilter={false} customClass="grid-6or"/>
        </div>
      </div>
    </div>
  )
}

export default memo(CollectionDetailContentEvent304)