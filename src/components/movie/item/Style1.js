"use client"

import CustomLink from "@/components/shared/CustomLink";
import {movieDetailUrl} from "@/utils/url";
import MovieTooltipItem from "@/components/movie/TooltipItem";
import {memo} from "react";
import MovieItemLatestEpisode from "@/components/movie/item/LatestEpisode";
import MovieImagesPoster from "@/components/movie/images/Poster";

const MovieItemStyle1 = ({movie, showBtnRemove = false, handleRemoveClick, playlistId}) => {
    return (
        <div className="sw-item">
            {showBtnRemove && <div className="pin-remove" onClick={() => handleRemoveClick(movie._id, playlistId)}>
                <i className="fa-solid fa-times"></i>
            </div>}
            <CustomLink href={movieDetailUrl(movie)} className="v-thumbnail">
                {movie.quality === "cam" && <div className="pin-tag-quality tag-cam">CAM</div>}
                <MovieItemLatestEpisode movie={movie}/>
                <MovieTooltipItem movie={movie}>
                    <MovieImagesPoster movie={movie}/>
                </MovieTooltipItem>
            </CustomLink>
            <div className="info">
                <h4 className="item-title lim-1">
                    <CustomLink href={movieDetailUrl(movie)} title={movie.title}>
                        {movie.title}
                    </CustomLink>
                </h4>
                <h4 className="alias-title lim-1">
                    <CustomLink href={movieDetailUrl(movie)}
                                title={movie.english_title}>{movie.english_title}</CustomLink>
                </h4>
            </div>
        </div>
    )
}

export default memo(MovieItemStyle1)