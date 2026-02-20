"use client"

import {useAppSelector} from "@/hooks/redux";
import {memo, useEffect, useState} from "react";
import {Modal} from "react-bootstrap";
import Cookies from "js-cookie";
import {adsImage} from "@/utils/image";

const AdsPopup = () => {
    const {configAds} = useAppSelector(s => s.app)
    const [showModal, setShowModal] = useState(false)
    const [currentAd, setCurrentAd] = useState(null);

    useEffect(() => {
        const COOKIE_NAME = `a_popup_lastView`
        const TTL = 60 * 60 * 1000
        const now = Date.now()

        const last = parseInt(Cookies.get(COOKIE_NAME) || '0', 10)

        if (now - last > TTL) {
            setTimeout(() => {
                setShowModal(true)
            }, 3000)

            Cookies.set(COOKIE_NAME, now.toString(), {expires: 1})
        }
    }, [])

    useEffect(() => {
        const ads = [];
        if (configAds?.all_pages?.popup_1?.url && configAds.all_pages.popup_1.image) {
            ads.push(configAds.all_pages.popup_1);
        }
        if (configAds?.all_pages?.popup_2?.url && configAds.all_pages.popup_2.image) {
            ads.push(configAds.all_pages.popup_2);
        }
        if (ads.length > 0) {
            const idx = Math.floor(Math.random() * ads.length);
            setCurrentAd(ads[idx]);
        }
    }, [configAds]);

    if (configAds && currentAd)
        return (
            <Modal className="v-modal d-modal sspp-modal no-swap" centered={true} show={showModal} contentClassName="p-0"
                   onHide={() => setShowModal(!showModal)}>
                <div className="sspp-area is-square-400">
                    <div className="display-single is-demo">
                        <div className="close-it" onClick={() => setShowModal(false)}>
                            <i className="fa-solid fa-times"></i>
                            <span>Tắt</span>
                        </div>
                        <a href={currentAd.url} className="is-image" target="_blank">
                            <img src={adsImage(currentAd.image)} alt=""/>
                        </a>
                    </div>
                </div>
            </Modal>
        )
}

export default memo(AdsPopup)