"use client"

import {useAppSelector} from "@/hooks/redux";
import {memo, useEffect, useState} from "react";
import {adsImage} from "@/utils/image";
import _ from "lodash";

const AdsCatfish = (props) => {
    const {page, positions} = props
    const {configAds} = useAppSelector(s => s.app)
    const [display, setDisplay] = useState(true)
    const [banner, setBanner] = useState(null)

    useEffect(() => {
        if (!configAds) return
        if (positions && page) {
            const randomPosition = _.sample(positions)
            setBanner(configAds[page][randomPosition])
        } else {
            setBanner(configAds["all_pages"]["catfish"])
        }
    }, [configAds, props]);

    if (banner && display)
        return (
            <div className="sspp-area is-wide is-catfish no-swap">
                <div className="display-single is-demo">
                    <div className="close-it" onClick={() => setDisplay(false)}>
                        <i className="fa-solid fa-times"></i>
                        <span>Tắt</span>
                    </div>
                    <a href={banner.url} className="is-image" target="_blank">
                        <img src={adsImage(banner.image)} alt=""/>
                    </a>
                </div>
            </div>
        )
}

export default memo(AdsCatfish)