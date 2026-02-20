"use client"

import {memo} from "react";
import CollectionMovieList from "@/components/collection/MovieList";
import MovieFilter from "@/components/movie/Filter";

const CollectionDetailContent = ({collection}) => {
  const initFilter = {}
  if (collection.type === 2) {
    if (collection.filter.q) initFilter.q = collection.filter.q
    if (collection.filter.type) initFilter.type = collection.filter.type
    if (collection.filter.status) initFilter.status = collection.filter.status
    if (collection.filter.country_code) initFilter.countries = collection.filter.country_code
    if (collection.filter.genre_ids) initFilter.genres = collection.filter.genre_ids
    if (collection.filter.years) initFilter.years = collection.filter.years
    if (collection.filter.versions) initFilter.versions = collection.filter.versions
    if (collection.filter.quality) initFilter.quality = collection.filter.quality
    if (collection.filter.rating) initFilter.rating = collection.filter.rating
    if (collection.filter.sort_by) initFilter.sort = collection.filter.sort_by
  }

  return (
    <div id="wrapper" className="wrapper-topic">
      <div className="topic-background" style={{backgroundColor: `${collection.color}`}}></div>
      <div className="fluid-gap">
        <div className="cards-row wide">
          <div className="row-header">
            {<h3 className="category-name heading-topic"
                 style={{background: `linear-gradient(235deg, rgb(255, 255, 255) 30%, ${collection.color} 130%)`}}>Phim {collection.name}</h3>}
          </div>
          {collection.type === 1 && <CollectionMovieList collectionId={collection._id}/>}
          {collection.type === 2 && <MovieFilter initFilter={initFilter}/>}
        </div>
      </div>
    </div>
  )
}

export default memo(CollectionDetailContent)