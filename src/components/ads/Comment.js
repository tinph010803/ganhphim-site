"use client"

import {useAppSelector} from "@/hooks/redux";
import {memo} from "react";

const AdsComment = () => {
    const {configAds} = useAppSelector(s => s.app)

    if (configAds && configAds?.comment)
        return (
            <div className="sspp-area is-post no-swap">
                <div className="display-single is-demo">
                    <div className="sspp-logo">
                        <img src="/images/sponsor_icon.webp"/>
                    </div>
                    <div className="subject">
                        <div className="d-flex gap-5">
                            {configAds?.comment.position_1 && <div>
                                <div className="heading-xs mb-1">{configAds?.comment.position_1.title}</div>
                                <p className="mb-1">{configAds?.comment.position_1.description}</p>
                                <p className="mb-0"><a href={configAds?.comment.position_1.url} target="_blank"
                                                       className="text-primary">{configAds?.comment.position_1.text_url}</a></p>
                            </div>}
                            {configAds?.comment.position_2 && <div>
                                <div className="heading-xs mb-1">{configAds?.comment.position_2.title}</div>
                                <p className="mb-1">{configAds?.comment.position_2.description}</p>
                                <p className="mb-0"><a href={configAds?.comment.position_2.url} target="_blank"
                                                       className="text-primary">{configAds?.comment.position_2.text_url}</a></p>
                            </div>}
                            {configAds?.comment.position_3 && <div>
                                <div className="heading-xs mb-1">{configAds?.comment.position_3.title}</div>
                                <p className="mb-1">{configAds?.comment.position_3.description}</p>
                                <p className="mb-0"><a href={configAds?.comment.position_3.url} target="_blank"
                                                       className="text-primary">{configAds?.comment.position_3.text_url}</a></p>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default memo(AdsComment)