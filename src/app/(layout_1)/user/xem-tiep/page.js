"use client"

import UserSidebarMenu from "@/components/user/SidebarMenu";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {memo, useEffect} from "react";
import {useRouter} from "next/navigation";
import MovieItemContinueWatching from "@/components/movie/item/ContinueWatching";
import {fetchCwMoviesList} from "@/redux/features/movieSlice";
import Pagination from "@/components/pagination/Pagination";
import LoadingElement from "@/components/loading/Element";
import {homeUrl} from "@/utils/url";

const UserContinueWatchingPage = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {loggedUser, isLoadingUserInfo} = useAppSelector(state => state.auth)
    const {cwMoviesList, cwPageCount, cwMoviesListLoading} = useAppSelector(state => state.movie)

    useEffect(() => {
        if (loggedUser === null && !isLoadingUserInfo) {
            router.push(homeUrl())
        }

        if (loggedUser && !isLoadingUserInfo) {
            dispatch(fetchCwMoviesList({limit: 18, page: 1}))
        }
    }, [loggedUser, isLoadingUserInfo])

    const handlePageChange = (page) => {
        dispatch(fetchCwMoviesList({limit: 18, page}))
        window.scrollTo(0, 0)
    }

    return (
        <div id="wrapper" className="account-wrap">
            {(loggedUser && !isLoadingUserInfo) && <div className="dashboard-container">
                <UserSidebarMenu loggedUser={loggedUser} page="continueWatching"/>
                <div className="dcc-main">
                    <div className="cg-body-box py-0">
                        <div className="box-header flex-column align-items-start gap-3">
                            <div className="heading-sm mb-0">Danh sách xem tiếp</div>
                        </div>
                        <div className="box-body">
                            {cwMoviesListLoading && <LoadingElement/>}
                            <div className="cards-grid-wrapper de-suggest">
                                {cwMoviesList.map(item => {
                                    return (
                                        <MovieItemContinueWatching movie={item} key={`m-fav-${item._id}`}
                                                                   page={"list"}/>
                                    )
                                })}
                            </div>
                            <Pagination handlePageChange={handlePageChange} pageCount={cwPageCount}/>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default memo(UserContinueWatchingPage)