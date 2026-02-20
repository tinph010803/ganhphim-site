"use client"

import W2gMyRooms from "@/components/w2g/MyRooms";
import {memo} from "react";
import W2gModalCreateGuide from "@/components/w2g/ModalCreateGuide";

const W2gPageRoomsManage = () => {
    return (
        <>
            <div id="wrapper" className="live-category is-manager">
                <div className="fluid-gap">
                    <div className="cards-row wide">
                        <W2gMyRooms/>
                    </div>
                </div>
            </div>
            <W2gModalCreateGuide/>
        </>
    )
}

export default memo(W2gPageRoomsManage)