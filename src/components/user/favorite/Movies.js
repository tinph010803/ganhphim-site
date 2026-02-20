"use client"

import MovieItemStyle1 from "@/components/movie/item/Style1";
import {memo, useEffect, useState} from "react";
import FavoriteApi from "@/api/favorite.api";
import {showToast} from "@/utils/helpers";
import Pagination from "@/components/pagination/Pagination";
import LoadingElement from "@/components/loading/Element";

const UserFavoriteMovies = ({}) => {
    const [movies, setMovies] = useState([])
    const [pageCount, setPageCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const getFavMovies = async (page = 1) => {
        if (!isLoading) {
            setIsLoading(true)
            try {
                const {result} = await FavoriteApi.list({page})
                setMovies(result.items)
                setPageCount(result.page_count)
            } catch (err) {
            }
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getFavMovies()
    }, []);

    const handleRemoveFavClick = async (movieId) => {
        const {status, msg} = await FavoriteApi.remove({movie_id: movieId})
        if (status) {
            showToast({message: msg, type: "success"})
            setMovies(prevState => prevState.filter(el => el._id !== movieId))
        }
    }

    const handlePageChange = async (page) => {
        setMovies([])
        getFavMovies(page)
    }

    return (
        <>
            {isLoading && <LoadingElement/>}
            {movies.length === 0 && <div className="v-notice">
                Bạn chưa có phim yêu thích nào
            </div>}
            <div className="cards-grid-wrapper de-suggest">
                {movies.map(item => {
                    return (
                        <MovieItemStyle1 movie={item} key={`m-fav-${item._id}`} showBtnRemove={true}
                                         handleRemoveClick={handleRemoveFavClick}/>
                    )
                })}
            </div>
            <Pagination pageCount={pageCount} handlePageChange={handlePageChange}/>
        </>
    )
}

export default memo(UserFavoriteMovies)