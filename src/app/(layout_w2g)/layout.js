"use client"

import "@/styles/template.css"
import "@/styles/events/quockhanh.css"
import "@/styles/live.css"
import "@/styles/device.css"
import "@/styles/custom.css"

import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {fetchConfigList, fetchCountries, fetchGenres} from "@/redux/features/appSlice";
import LoadingFullPage from "@/components/loading/FullPage";
import Header from "@/components/layout/Header";
import ModalLogin from "@/components/auth/ModalLogin";
import ModalRegister from "@/components/auth/ModalRegister";
import ModalForgotPassword from "@/components/auth/ModalForgotPassword";
import {ToastContainer} from "react-toastify";
import {socketActions} from "@/redux/middlewares/socketMiddleware";

const Layout_W2g = ({children}) => {
    const dispatch = useAppDispatch()

    const {loggedUser} = useAppSelector(state => state.auth)

    useEffect(() => {
        if (loggedUser?.is_vip) {
            document.body.classList.add("for-rox")
        } else {
            document.body.classList.remove("for-rox")
        }
    }, [loggedUser])


    useEffect(() => {
        document.body.classList.add("body_live")
        document.body.classList.remove("homepage")

        Promise.all([
            dispatch(fetchCountries()),
            dispatch(fetchGenres()),
            dispatch(fetchConfigList()),
        ])
    }, []);

    useEffect(() => {
        dispatch({type: socketActions.init});
    }, [dispatch])

    return (
        <>
            <LoadingFullPage/>
            <div id="app">
                <Header/>
                {children}
            </div>
            <ModalLogin/>
            <ModalRegister/>
            <ModalForgotPassword/>
            <ToastContainer/>
        </>
    )
}

export default Layout_W2g