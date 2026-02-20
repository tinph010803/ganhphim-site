"use client"

import MovieInfoTags from "@/components/movie/InfoTags";
import MovieGenreTags from "@/components/movie/GenreTags";
import Link from "next/link";
import { countryUrl, directorUrl, networkUrl, productionCompanyUrl } from "@/utils/url";
import { formatDuration } from "@/utils/helpers";
import { memo, useState } from "react";
import MovieImagesPoster from "@/components/movie/images/Poster";
import MovieEpisodeStatus from "@/components/movie/EpisodeStatus";

const MovieDetailInfo = ({ movie }) => {
  const [mShowInfo, setMShowInfo] = useState(false)

  return (
    <div className="ds-info">
      <div className="v-thumb-l mb-3">
        <div className="v-thumbnail">
          <MovieImagesPoster movie={movie} />
        </div>
      </div>
      <h2 className="heading-md media-name">{movie.title}</h2>
      <div className="alias-name">{movie.english_title}</div>
      <div id="toggle-detail" className="btn btn-block btn-basic primary-text mb-2"
        onClick={() => setMShowInfo(!mShowInfo)}>
        <span>Thông tin phim</span>
        <i className="fa-solid fa-angle-down ms-2"></i>
      </div>
      <div className={`detail-more ${mShowInfo ? "show" : ""}`}>
        <MovieInfoTags movie={movie} />
        <div className="hl-tags">
          <MovieGenreTags genres={movie.genres} />
        </div>
        <MovieEpisodeStatus movie={movie} className="mb-4" />
        <div className="detail-line">
          <div className="de-title d-block mb-2">Giới thiệu:</div>
          <div className="description"
            dangerouslySetInnerHTML={{ __html: movie.overview }} />
        </div>
        <div className="detail-line d-flex">
          <div className="de-title">Thời lượng:</div>
          <div className="de-value">{formatDuration(movie.runtime)}</div>
        </div>
        {movie.countries && movie.countries.length > 0 && <div className="detail-line d-flex">
          <div className="de-title">Quốc gia:</div>
          <div className="de-value">
            {movie.countries.map((country, index) => (
              <span key={`country-${country._id}`}><Link
                href={countryUrl(country)}>{country.name}</Link>{index < movie.countries.length - 1 ? ', ' : ''}</span>
            ))}
          </div>
        </div>}
        {movie.networks?.length > 0 && <div className="detail-line d-flex">
          <div className="de-title">Networks:</div>
          <div className="de-value">
            {movie.networks.map((network, index) => (
              <span key={`network-${network._id}`}><Link href={networkUrl(network)}
                title={network.name}>{network.name}</Link>{index < movie.networks.length - 1 ? ', ' : ''}</span>
            ))}
          </div>
        </div>}
        {movie.production_companies?.length > 0 && <div className="detail-line d-flex">
          <div className="de-title">Sản xuất:</div>
          <div className="de-value">
            {movie.production_companies.map((com, index) => (
              <span key={`pc-${com._id}`}><Link
                href={productionCompanyUrl(com)}>{com.name}</Link>{index < movie.production_companies.length - 1 ? ', ' : ''}</span>
            ))}
          </div>
        </div>}
        {movie.directors?.length > 0 && <div className="detail-line d-flex">
          <div className="de-title">Đạo diễn:</div>
          <div className="de-value">
            {movie.directors.map((director, index) => (
              <span key={`director-${director._id}`}><Link href={directorUrl(director)}
                title={director.name}>{director.name}</Link>{index < movie.directors.length - 1 ? ', ' : ''}</span>
            ))}
          </div>
        </div>}
      </div>
    </div>
  )
}

export default memo(MovieDetailInfo)