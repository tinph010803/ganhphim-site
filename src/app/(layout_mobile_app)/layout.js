"use client"

import "@/styles/mobile-app.css"
import "@/styles/mobile-app-media.css"

import {useEffect} from "react";

const LayoutMobileApp = ({children}) => {
    useEffect(() => {
        document.body.classList.remove("base-load")
    }, []);

    return (
        children
    )
}

export default LayoutMobileApp