"use client"

import {useAppSelector} from "@/hooks/redux";
import {memo} from "react";

const AdsW2gChat = () => {
    const {configAds} = useAppSelector(s => s.app)

    if (configAds && configAds?.w2g?.chat)
        return (
            <div className="chat-row no-swap">
                <div className="sspp-area is-post">
                    <div className="display-single w-100">
                        <div className="sspp-logo">
                            <img src="/images/sponsor_icon.webp"/>
                        </div>
                        <div className="subject">
                            <div className="d-flex gap-5">
                                <div>
                                    <div className="heading-xs mb-1">{configAds?.w2g?.chat.title}</div>
                                    <p className="mb-1">{configAds?.w2g?.chat.description}</p>
                                    <p className="mb-0 no-swap"><a href={configAds?.w2g?.chat.url} target="_blank"
                                                           className="text-primary">Cược ngay</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default memo(AdsW2gChat)