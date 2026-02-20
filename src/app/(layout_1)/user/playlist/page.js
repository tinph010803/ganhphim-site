"use client"

import UserSidebarMenu from "@/components/user/SidebarMenu";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import PlaylistApi from "@/api/playlist.api";
import {
    setUpdatePlaylist,
    toggleShowModalUpdate,
    toggleShowModalAdd,
    fetchPlaylist
} from "@/redux/features/playlistSlice";
import MovieItemStyle1 from "@/components/movie/item/Style1";
import {showToast} from "@/utils/helpers";
import LoadingElement from "@/components/loading/Element";
import {homeUrl} from "@/utils/url";

const UserPlaylistPage = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {loggedUser, isLoadingUserInfo} = useAppSelector(state => state.auth)
    const {playlist} = useAppSelector(state => state.playlist)
    const [currentPlaylist, setCurrentPlaylist] = useState(null)
    const [movies, setMovies] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (loggedUser === null && !isLoadingUserInfo) {
            router.push(homeUrl())
        }

        if (loggedUser && !isLoadingUserInfo) {
            dispatch(fetchPlaylist())
        }
    }, [loggedUser, isLoadingUserInfo]);

    useEffect(() => {
        if (playlist.length > 0 && currentPlaylist === null) {
            setCurrentPlaylist(playlist[0])
        } else {
            setIsLoading(false)
        }
    }, [playlist])

    useEffect(() => {
        if (currentPlaylist) getPlaylistMovies()
    }, [currentPlaylist])

    const getPlaylistMovies = async () => {
        setIsLoading(true)
        try {
            const {result} = await PlaylistApi.movies(currentPlaylist._id)
            setMovies(result)
        } catch (e) {

        }
        setIsLoading(false)
    }

    const handlePlaylistClick = async (item) => {
        setMovies([])
        setCurrentPlaylist(item)
    }

    const handleUpdatePlaylistClick = (event, item) => {
        event.preventDefault()
        dispatch(toggleShowModalUpdate())
        dispatch(setUpdatePlaylist(item))
    }

    const handleRemoveClick = async (movieId, playlistId) => {
        const {status, msg} = await PlaylistApi.removeMovie({movie_id: movieId, playlist_id: playlistId})
        if (status) {
            showToast({message: msg, type: "success"})
            setMovies(prevState => prevState.filter(el => el._id !== movieId))
        }
    }

    return (
        <div id="wrapper" className="account-wrap">
            {(loggedUser && !isLoadingUserInfo) && <div className="dashboard-container">
                <UserSidebarMenu loggedUser={loggedUser} page="playlist"/>
                <div className="dcc-main">
                    <div className="cg-body-box py-0 is-list">
                        <div className="box-header justify-content-start gap-3 mb-4">
                            <div className="heading-sm mb-0">Danh sách</div>
                            <a className="btn btn-xs btn-rounded btn-outline"
                               onClick={() => dispatch(toggleShowModalAdd())}>
                                <i className="fa-solid fa-plus small"></i>
                                Thêm mới
                            </a>
                        </div>
                        {playlist.length === 0 && <div className="v-notice">
                            Bạn chưa có danh sách nào
                        </div>}
                        <div className="dcc-playlist mb-5">
                            {playlist.map(item => {
                                return (
                                    <div className={`item ${currentPlaylist?._id === item._id ? 'active' : ''}`}
                                         onClick={() => handlePlaylistClick(item)} key={`playlist-${item._id}`}>
                                        <div className="playlist-name lim-2">{item.name}</div>
                                        <div className="pl-control line-center d-flex small">
                                            <div className="added flex-grow-1"><i
                                                className="fa-regular fa-circle-play me-1"></i>{item.total_movie} phim
                                            </div>
                                            <div className="edit"
                                                 onClick={(e) => handleUpdatePlaylistClick(e, item)}><u>Sửa</u>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="box-body">
                            <div className="tab-content">
                                <div className="tab-pane fade show active">
                                    {isLoading && <LoadingElement/>}
                                    <div className="cards-grid-wrapper de-suggest">
                                        {movies.map(item => {
                                            return (
                                                <MovieItemStyle1 movie={item} key={`m-playlist-${item._id}`}
                                                                 showBtnRemove={true}
                                                                 handleRemoveClick={handleRemoveClick}
                                                                 playlistId={currentPlaylist?._id}/>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default UserPlaylistPage