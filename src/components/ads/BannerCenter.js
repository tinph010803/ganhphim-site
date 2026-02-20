"use client"

import {memo, useEffect, useState} from "react";
import {useAppSelector} from "@/hooks/redux";
import {adsImage} from "@/utils/image";
import _ from "lodash";

const AdsBannerCenter = (props) => {
    const {configAds} = useAppSelector(s => s.app)
    const [banner, setBanner] = useState(null)

    useEffect(() => {
        if (!configAds) return
        const {page, position, positions} = props
        if (positions) {
            const randomPosition = _.sample(positions)
            setBanner(configAds[page][randomPosition])
        } else {
            setBanner(configAds[page][position])
        }
    }, [configAds, props]);

    if (banner)
        return (
            <div className="sspp-area is-wide no-swap" style={{...props.style}}>
                <div className="display-single is-demo">
                    <a href={banner?.url} className="is-image" target="_blank">
                        <img src={adsImage(banner?.image)} alt=""/>
                    </a>
                </div>
            </div>
        )
}

export default memo(AdsBannerCenter);