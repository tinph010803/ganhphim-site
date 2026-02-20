"use client"

import {memo} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {toggleShowReportModal} from "@/redux/features/movieSlice";
import MovieReportModal from "@/components/movie/report/Modal";
import {showToast} from "@/utils/helpers";

const MovieReportButton = ({movie}) => {
    const dispatch = useAppDispatch()
    const {loggedUser} = useAppSelector(state => state.auth)

    const handleReportClick = () => {
        if (!loggedUser) {
            showToast({message: "Bạn phải đăng nhập để sử dụng tính năng này.", type: "error"})
            return
        }

        dispatch(toggleShowReportModal())
    }

    return (
        <>
            <div className="item item-report" onClick={handleReportClick}>
                <i className="fa-solid fa-flag"></i>
                <span>Báo lỗi</span>
            </div>
            <MovieReportModal movie={movie}/>
        </>
    )
}

export default memo(MovieReportButton)