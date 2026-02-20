"use client"

import {memo} from "react";
import {useAppDispatch} from "@/hooks/redux"
import {toggleShowModalCreateGuide} from "@/redux/features/w2gSlice";

const W2gButtonCreateGuide = () => {
    const dispatch = useAppDispatch()

    return (
        <a className="btn btn-xl btn-rounded btn-outline" onClick={() => dispatch(toggleShowModalCreateGuide())}>
            <i className="fa-solid fa-circle-plus"></i>
            <span>Tạo mới</span>
        </a>
    )
}

export default memo(W2gButtonCreateGuide)