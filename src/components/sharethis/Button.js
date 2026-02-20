"use client"

import ShareIcon from "@/components/icons/Share";
import {useAppDispatch} from "@/hooks/redux";
import {setShowModalShare} from "@/redux/features/appSlice";
import {memo} from "react";

const ShareButton = () => {
  const dispatch = useAppDispatch()

  return (
    <div className="item item-share" onClick={() => dispatch(setShowModalShare(true))}>
      <div className="inc-icon icon-12">
        <ShareIcon/>
      </div>
      <span>Chia sẻ</span>
    </div>
  )
}

export default memo(ShareButton)