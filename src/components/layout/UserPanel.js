"use client"

import {
    setIsLoadingUserInfo, fetchUserInfo,
} from "@/redux/features/authSlice";
import {memo, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {usePathname} from "next/navigation";
import FavoriteApi from "@/api/favorite.api";
import {addFavoriteIds} from "@/redux/features/appSlice";
import HeaderNotification from "@/components/layout/HeaderNotification";
import {getAuthTokens} from "@/utils/auth";
import UserHeaderMenu from "@/components/user/HeaderMenu";
import {setAccessToken} from "@/redux/features/authSlice";
import {tokenEmitter} from "@/utils/tokenEvents";
import {socketActions} from "@/redux/middlewares/socketMiddleware";
import {toggleShowModalLogin} from "@/redux/features/authSlice";

const UserPanel = () => {
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const {loggedUser, isLoadingUserInfo} = useAppSelector(state => state.auth)

    const getFavoriteIds = async () => {
        try {
            const {result} = await FavoriteApi.listIds()
            dispatch(addFavoriteIds(result))
        } catch (err) {
        }
    }

    useEffect(() => {
        const {refreshToken, accessToken} = getAuthTokens()
        if (refreshToken)
            dispatch(fetchUserInfo())
        else dispatch(setIsLoadingUserInfo(false))

        if (accessToken) dispatch(setAccessToken(accessToken))
    }, [pathname]);

    useEffect(() => {
        if (loggedUser) {
            getFavoriteIds()
        }
    }, [loggedUser, isLoadingUserInfo]);

    useEffect(() => {
        const handler = ({accessToken}) => {
            dispatch(setAccessToken(accessToken))
            dispatch({type: socketActions.tokenUpdated})
        }
        tokenEmitter.on('tokensChanged', handler)
        return () => tokenEmitter.off('tokensChanged', handler)
    }, [dispatch])

    if (loggedUser && !isLoadingUserInfo) {
        return (
            <div id="main_user" className="user-logged">
                <HeaderNotification/>
                <UserHeaderMenu/>
            </div>
        )
    }

    if (loggedUser === null && !isLoadingUserInfo) {
        return (
            <div id="main_user">
                <a className="button-user button-login" style={{cursor:'pointer'}} onClick={() => dispatch(toggleShowModalLogin())}>
                    <div className="line-center">
                        <i className="fa-solid fa-user ms-1"></i>
                        <span>Thành viên</span>
                    </div>
                </a>
            </div>
        )
    }
}

export default memo(UserPanel)