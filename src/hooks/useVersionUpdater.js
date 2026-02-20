"use client"

import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {setCurVersion, setCurVersionPlayer} from "@/redux/features/movieSlice";
import {useSearchParams} from "next/navigation";

const useVersionUpdater = ({movie, page}) => {
    const searchParams = useSearchParams()

    const dispatch = useAppDispatch()
    const {
        cwInfo
    } = useAppSelector(state => state.movie)

    useEffect(() => {
        let version = movie.latest_episode ? Object.keys(movie.latest_episode)[0] : null
        if (page === "watch") {
            const ver = searchParams.get("ver") || (cwInfo ? cwInfo.version : null)
            if (ver) {
                if (Object.keys(movie.latest_episode).indexOf(ver.toString()) >= 0) version = ver
            }

            if (version) {
                dispatch(setCurVersion(version.toString()));
                dispatch(setCurVersionPlayer(version.toString()))
            }
        } else {
            if (movie.type !== 1) {
                if (version) {
                    dispatch(setCurVersion(version.toString()));
                    dispatch(setCurVersionPlayer(version.toString()))
                }
            }
        }
    }, [movie, searchParams, cwInfo, dispatch])
};

export default useVersionUpdater;
