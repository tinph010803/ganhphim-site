"use client"

import {useEffect} from 'react'
import {usePathname} from "next/navigation"

const GA_TRACKING_ID = 'G-SD3VEJNRF5'

function AnalyticsGoogle() {
  const pathname = usePathname()

  useEffect(() => {
    const loadGA = () => {
      window.dataLayer = window.dataLayer || [];

      function gtag() {
        dataLayer.push(arguments);
      }

      gtag('js', new Date());
      gtag('config', GA_TRACKING_ID, {
        page_path: pathname,
      });
    };

    if (!window.gtag) {
      const script = document.createElement('script')
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
      script.async = true
      script.onload = loadGA
      document.head.appendChild(script)
    } else {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: pathname,
      })
    }
  }, [pathname])

  return null
}

export default AnalyticsGoogle
