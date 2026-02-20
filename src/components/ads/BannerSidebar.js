"use client"

import {memo} from "react";
import {useAppSelector} from "@/hooks/redux";
import {adsImage} from "@/utils/image";

const AdsBannerSidebar = (props) => {
    const {configAds} = useAppSelector(s => s.app)

    if (configAds && configAds[props.page])
        return (
            <div className="sspp-area is-3x2 no-swap" style={{...props.style}}>
                <div className="display-single is-demo">
                    <a href={configAds[props.page][props.position].url} className="is-image auto-res" target="_blank">
                        <img src={adsImage(configAds[props.page][props.position].image)} alt=""/>
                    </a>
                </div>
            </div>
        )
}

export default memo(AdsBannerSidebar);