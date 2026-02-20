"use client";
import {useEffect, useRef} from "react";
import Script from "next/script";
import AuthApi from "@/api/auth.api";
import {showToast} from "@/utils/helpers";
import {setLoggedUser, toggleShowModalLogin} from "@/redux/features/authSlice";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";

export default function GoogleSignIn() {
    const dispatch = useAppDispatch()
    const {showModalLogin} = useAppSelector(state => state.auth)
    const btnRef = useRef(null);
    const retryRef = useRef(null);

    const renderGoogleButton = () => {
        if (!btnRef.current) return;

        if (window.google?.accounts?.id) {
            google.accounts.id.initialize({
                client_id: process.env.GOOGLE_CLIENT_ID,
                callback: async ({credential}) => {
                    const {result, status, msg} = await AuthApi.loginGoogle({idToken: credential})
                    if (status) {
                        showToast({message: msg, type: 'success'})
                        dispatch(toggleShowModalLogin())
                        dispatch(setLoggedUser(result.user))
                    }
                },
            });

            // Hiện nút "Sign in with Google"
            if (btnRef.current) {
                google.accounts.id.renderButton(btnRef.current, {
                    type: "standard",
                    shape: "rectangular",
                    size: "large",
                    text: "signin_with",
                });
            }
        } else {
            // script chưa sẵn sàng, thử lại sau 100ms
            retryRef.current = setTimeout(renderGoogleButton, 100);
        }
    };

    useEffect(() => {
        if (showModalLogin) renderGoogleButton();

        return () => {
            if (retryRef.current) clearTimeout(retryRef.current);
            if (btnRef.current) btnRef.current.innerHTML = "";
        };
    }, [showModalLogin]);

    return (
        <>
            <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive"/>
            <div ref={btnRef}/>
        </>
    );
}
