"use client"

import FavoriteIcon from "@/components/icons/Favorite";
import {memo} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import FavoriteApi from "@/api/favorite.api";
import {showToast} from "@/utils/helpers";
import {addFavoriteIds, removeFavoriteIds} from "@/redux/features/appSlice";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import RemindIcon from "@/components/icons/Remind";

const TooltipInfo = ({children}) => {
  const renderTooltip = (props) => (
    <Tooltip className="custom-tooltip" {...props}>
      Nhận thông báo khi phim khởi chiếu.
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="top"
      delay={{show: 200, hide: 200}}
      overlay={renderTooltip}
    >
      {children}
    </OverlayTrigger>
  );
}

const MovieRemindButton = ({position, movieId}) => {
  const dispatch = useAppDispatch()
  const {favoriteIds} = useAppSelector(state => state.app)
  const {loggedUser} = useAppSelector(state => state.auth)

  const handleFavClick = async () => {
    if (loggedUser === null) {
      showToast({message: "Bạn phải đăng nhập để sử dụng tính năng này.", type: "error"})
      return
    }
    if (favoriteIds.indexOf(movieId) >= 0) {
      dispatch(removeFavoriteIds(movieId))
      const {status, msg} = await FavoriteApi.remove({movie_id: movieId})
      if (status) {
        showToast({message: msg, type: 'success'})
      }
    } else {
      dispatch(addFavoriteIds([movieId]))
      const {status, msg} = await FavoriteApi.add({movie_id: movieId})
      if (status) {
        showToast({message: msg, type: 'success'})
      }
    }
  }

  if (position === "detail") {
    return (
      <TooltipInfo>
        <div className={`item item-remind ${favoriteIds.indexOf(movieId) >= 0 ? 'active' : ''}`} onClick={() => handleFavClick()}>
          <a className="item-v">
            <div className="inc-icon icon-16">
              <RemindIcon/>
            </div>
            <span>Nhắc tôi</span>
          </a>
        </div>
      </TooltipInfo>
    )
  }

  if (position === "watch") {
    return (
      <TooltipInfo>
        <div className={`item item-like ${favoriteIds.indexOf(movieId) >= 0 ? 'active' : ''}`}
             onClick={() => handleFavClick()}>
          <div className="inc-icon icon-12">
            <FavoriteIcon/>
          </div>
          <span>Yêu thích</span>
        </div>
      </TooltipInfo>
    )
  }

  if (position === "tooltip") {
    return (
      <a className={`btn btn-outline ${favoriteIds.indexOf(movieId) >= 0 ? 'active' : ''}`}
         onClick={() => handleFavClick()}>
        <div className="inc-icon icon-14">
          <FavoriteIcon/>
        </div>
        <span>Thích</span>
      </a>
    )
  }

  if (position === "swiper") {
    return (
      <a className={`item ${favoriteIds.indexOf(movieId) >= 0 ? 'active' : ''}`} onClick={() => handleFavClick()}>
        <div className="inc-icon icon-20">
          <FavoriteIcon/>
        </div>
      </a>
    )
  }
}

export default memo(MovieRemindButton)