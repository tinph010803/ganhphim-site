"use client"

import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {setCwInfo, setCwInfoLoading} from "@/redux/features/movieSlice";
import ContinueWatchingApi from "@/api/continueWatching.api";
import {useEffect, useRef} from "react";

const useGetCwInfo = ({movie}) => {
    const dispatch = useAppDispatch()
    const {loggedUser, isLoadingUserInfo} = useAppSelector((state) => state.auth)
    const getCwInfoRef = useRef(false)

    const getCwInfo = async () => {
        if (!getCwInfoRef.current) {
            getCwInfoRef.current = true
            try {
                dispatch(setCwInfoLoading(true))
                const {result} = await ContinueWatchingApi.info(movie._id)
                dispatch(setCwInfo(result))
                dispatch(setCwInfoLoading(false))
            } catch (e) {

            }
        }
    }

    useEffect(() => {
        if (!isLoadingUserInfo) {
            if (loggedUser) {
                getCwInfo()
            } else {
                dispatch(setCwInfoLoading(false))
            }
        }
    }, [loggedUser, isLoadingUserInfo])
};

export default useGetCwInfo
