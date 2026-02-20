"use client"

import "@/styles/android-app.css"
import "@/styles/android-app-media.css"

import {useEffect} from "react";

const Layout_3 = ({children}) => {
  useEffect(() => {
    document.body.classList.remove("base-load")
  }, []);

  return (
    <div id="fullwide">
      {children}
    </div>
  )
}

export default Layout_3