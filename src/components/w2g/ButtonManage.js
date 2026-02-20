"use client"

import {memo} from "react";
import {useRouter} from 'next/navigation'
import {useAppDispatch, useAppSelector} from "@/hooks/redux"
import {showToast} from "@/utils/helpers";

const W2gButtonManage = () => {
    const router = useRouter()
    const {loggedUser} = useAppSelector(state => state.auth)

    const handleClick = () => {
        if (!loggedUser) {
            showToast({message: "Bạn phải đăng nhập để sử dụng chức năng này.", type: "error"})
            return
        }

        router.push('/xem-chung/quan-ly')
    }

    return (
        <button className="btn btn-xl btn-rounded btn-light" type="button" onClick={() => handleClick()}>
            <i className="fa-solid fa-podcast"></i>
            <span>Quản lý</span>
        </button>
    )
}

export default memo(W2gButtonManage)