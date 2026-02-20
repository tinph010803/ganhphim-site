"use client"

import "@/styles/template.css"
import "@/styles/events/quockhanh.css"
import "@/styles/premium.css"
import "@/styles/live.css"
import "@/styles/datetimepicker.css"
import "@/styles/device.css"
import "@/styles/custom.css"

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MovieTooltipInfo from "@/components/movie/TooltipInfo";
import ModalLogin from "@/components/auth/ModalLogin";
import ModalRegister from "@/components/auth/ModalRegister";
import ModalForgotPassword from "@/components/auth/ModalForgotPassword";
import ModalAddPlaylist from "@/components/playlist/ModalAdd";
import ModalUpdatePlaylist from "@/components/playlist/ModalUpdate";
import {ToastContainer} from "react-toastify";
import {useEffect} from "react";
import LoadingFullPage from "@/components/loading/FullPage";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {fetchConfigList, fetchCountries, fetchGenres} from "@/redux/features/appSlice";
import BackToTopButton from "@/components/layout/BackToTopButton";
import AnchorNotice from "@/components/layout/AnchorNotice";
import Cookies from "js-cookie";
import _ from "lodash";
import {ALLOW_POPUNDER, POPUNDER_OPENED} from "@/constants/cookieName";
import {robongMatchUrl} from "@/utils/url";
import AdsPopup from "@/components/ads/Popup";
import AdsCatfish from "@/components/ads/Catfish";

const Layout_1 = ({children}) => {
    const dispatch = useAppDispatch()
    const {loggedUser, isLoadingUserInfo} = useAppSelector(state => state.auth)

    useEffect(() => {
        if (loggedUser?.is_vip) {
            document.body.classList.add("for-rox")
        } else {
            document.body.classList.remove("for-rox")
        }
    }, [loggedUser])

    useEffect(() => {
        document.body.classList.remove("homepage")

        Promise.all([
            dispatch(fetchCountries()),
            dispatch(fetchGenres()),
            dispatch(fetchConfigList()),
        ])
    }, []);

    return (
        <>
            <LoadingFullPage/>
            <div id="app">
                <Header/>
                {children}
                <Footer/>
            </div>
            <div className="focus-backdrop"></div>
            <MovieTooltipInfo/>
            <ModalLogin/>
            <ModalRegister/>
            <ModalForgotPassword/>
            <ModalAddPlaylist/>
            <ModalUpdatePlaylist/>
            <ToastContainer/>
            <AnchorNotice/>
            <AdsPopup/>
            <AdsCatfish page="all_pages" positions={["catfish", "catfish_2"]}/>
            {/*<ChatWidget/>*/}
            <BackToTopButton/>
        </>
    )
}

export default Layout_1