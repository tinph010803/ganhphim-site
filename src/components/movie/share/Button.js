"use client"

import ShareIcon from "@/components/icons/Share";
import {useAppDispatch} from "@/hooks/redux";
import {setShowModalShare} from "@/redux/features/appSlice";

const MovieShareButton = ({page = "detail"}) => {
  const dispatch = useAppDispatch()

  if (page === "detail")
    return (
      <div className="item item-share">
        <a className="item-v" title="Chia sẻ" onClick={() => dispatch(setShowModalShare(true))}>
          <div className="inc-icon icon-16">
            <ShareIcon/>
          </div>
          <span>Chia sẻ</span>
        </a>
      </div>
    )

  if (page === "watch")
    return (
      <div className="item item-share" onClick={() => dispatch(setShowModalShare(true))}>
        <div className="inc-icon icon-12">
          <ShareIcon/>
        </div>
        <span>Chia sẻ</span>
      </div>
    )
}

export default MovieShareButton