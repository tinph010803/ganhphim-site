"use client"

import {forwardRef, memo, useState} from "react";
import {Dropdown} from "react-bootstrap";
import AddIcon from "@/components/icons/Add";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {showToast} from "@/utils/helpers";
import PlaylistApi from "@/api/playlist.api";
import {fetchPlaylist, toggleShowModalAdd} from "@/redux/features/playlistSlice";
import useOnceWhen from "@/hooks/useOnceWhen";

const CustomToggle = forwardRef(({children, onClick}, ref) => {
    const {loggedUser} = useAppSelector((state) => state.auth)

    const handleOnclick = (e) => {
        e.preventDefault()
        if (loggedUser === null) {
            showToast({message: "Bạn phải đăng nhập để sử dụng tính năng này.", type: "error"})
            return
        }

        onClick(e)
    }
    return (
        <div ref={ref} onClick={handleOnclick}>
            {children}
        </div>
    )
})

const MoviePlaylistButton = ({movieId, position}) => {
    const dispatch = useAppDispatch()
    const {loggedUser} = useAppSelector((state) => state.auth)
    const {playlist} = useAppSelector((state) => state.playlist)
    const [playlistIds, setPlaylistIds] = useState([])

    const getPlaylistByMovie = async () => {
        try {
            const {result} = await PlaylistApi.listByMovie(movieId)
            if (result) {
                setPlaylistIds(result)
            }
        } catch (e) {
        }
    }

    useOnceWhen(loggedUser, () => {
        dispatch(fetchPlaylist())
        getPlaylistByMovie()
    })

    const handleToggleMovieToPlaylist = async (e) => {
        const playlistId = e.target.value
        const data = {movie_id: movieId, playlist_id: playlistId}
        if (e.target.checked) {
            setPlaylistIds(prevState => [...prevState, playlistId])
            const {msg, status} = await PlaylistApi.addMovie(data)
            if (status) showToast({message: msg, type: 'success'})
        } else {
            setPlaylistIds(prevState => prevState.filter(id => id !== playlistId))
            const {msg, status} = await PlaylistApi.removeMovie(data)
            if (status) showToast({message: msg, type: 'success'})
        }
    }

    return (
        <Dropdown>
            <Dropdown.Toggle as={CustomToggle}>
                {position === "detail" && <div className="item item-playlist">
                    <a className="item-v">
                        <div className="inc-icon icon-16">
                            <AddIcon/>
                        </div>
                        <span>Thêm vào</span>
                    </a>
                </div>}
                {position === "watch" && <div className="item-playlist">
                    <div className="item">
                        <div className="inc-icon icon-12">
                            <AddIcon/>
                        </div>
                        <span>Thêm vào</span>
                    </div>
                </div>}
            </Dropdown.Toggle>

            <Dropdown.Menu className="v-dropdown-menu">
                <div className="dropdown-blank w-100">
                    <span className="flex-grow-1">Danh sách</span>
                    <small>{playlist.length}/5</small>
                </div>
                {playlist.map(item => {
                    return (
                        <li key={`playlist-${item._id}`}>
                            <div className="dropdown-checkbox">
                                <input className="form-check-input" type="checkbox" value={item._id}
                                       id={`playlist-${item._id}`}
                                       checked={playlistIds.indexOf(item._id.toString()) >= 0}
                                       onChange={(e) => handleToggleMovieToPlaylist(e)}/>
                                <label className="form-check-label" htmlFor={`playlist-${item._id}`}>
                                    {item.name}
                                </label>
                            </div>
                        </li>
                    )
                })}
                <li>
                    <div className="dropdown-blank mt-1">
                        <a className="btn btn-sm btn-primary w-100" onClick={() => dispatch(toggleShowModalAdd())}>
                            <i className="fa-solid fa-plus small"></i>
                            <span>Thêm mới</span>
                        </a>
                    </div>
                </li>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default memo(MoviePlaylistButton)