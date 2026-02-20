"use client"

import {memo} from "react";
import RobongHotMatches from "@/components/robong/HotMatches";

const AnchorNotice = () => {
    return (
        <div className="app-box-fix">
            <RobongHotMatches/>
        </div>
    )
}

export default memo(AnchorNotice)