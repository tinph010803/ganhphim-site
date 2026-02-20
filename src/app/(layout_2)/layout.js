"use client"

import "@/styles/template.css"
import "@/styles/device.css"

import {useEffect} from "react";
import {fetchConfigList} from "@/redux/features/appSlice";
import {useAppDispatch} from "@/hooks/redux";
import {getAuthTokens} from "@/utils/auth";
import {fetchUserInfo, setAccessToken, setIsLoadingUserInfo} from "@/redux/features/authSlice";
import AdsCatfish from "@/components/ads/Catfish";

const Layout_2 = ({children}) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        document.body.classList.add("homepage")

        dispatch(fetchConfigList())
    }, []);

    useEffect(() => {
        const {refreshToken, accessToken} = getAuthTokens()
        if (refreshToken)
            dispatch(fetchUserInfo())
        else dispatch(setIsLoadingUserInfo(false))

        if (accessToken) dispatch(setAccessToken(accessToken))
    }, []);

    return (
        <>
            <div id="app">
                {children}
            </div>
            <AdsCatfish page="index" positions={["catfish_1", "catfish_2", "catfish_3"]}/>
        </>
    )
}

export default Layout_2