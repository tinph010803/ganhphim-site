"use client"

import {memo} from "react";
import {useAppSelector} from "@/hooks/redux";
import {adsImage} from "@/utils/image";

const AdsBannerPoster = (props) => {
    const {configAds} = useAppSelector(s => s.app)

    if (configAds && configAds[props.page])
        return (
            <div className="sspp-area is-poster no-swap">
                <div className="display-single">
                    <a href={configAds[props.page][props.position].url} className="is-image auto-res" target="_blank">
                        <img src={adsImage(configAds[props.page][props.position].image)} alt=""/>
                    </a>
                </div>
                <div className="display-text line-center">
                    <i className="fa-solid fa-info-circle"></i>
                    <span>Được tài trợ</span>
                </div>
            </div>
        )
}

export default memo(AdsBannerPoster);