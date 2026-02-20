"use client"

import FavoriteIcon from "@/components/icons/Favorite";
import {showToast} from "@/utils/helpers";
import {useAppSelector} from "@/hooks/redux";
import FavoriteCastApi from "@/api/favoriteCast.api";
import {useEffect, useState} from "react";

const CastButtonFavorite = ({castId}) => {
  const {loggedUser} = useAppSelector(state => state.auth)
  const [info, setInfo] = useState(null)

  useEffect(() => {
    if (loggedUser)
      getInfo()
  }, [castId, loggedUser]);

  const getInfo = async () => {
    const {result} = await FavoriteCastApi.info(castId)
    setInfo(result)
  }

  const handleFavClick = async () => {
    if (loggedUser === null) {
      showToast({message: "Bạn phải đăng nhập để sử dụng tính năng này.", type: "error"})
      return
    }
    if (info) {
      setInfo(null)
      const {status, msg} = await FavoriteCastApi.remove({cast_id: castId})
      if (status) {
        showToast({message: msg, type: 'success'})
      }
    } else {
      const {status, msg, result} = await FavoriteCastApi.add({cast_id: castId})
      if (status) {
        setInfo(result)
        showToast({message: msg, type: 'success'})
      }
    }

  }

  return (
    <div className={`item item-like ${info ? 'active' : ''}`} onClick={handleFavClick}>
      <div className="inc-icon icon-12">
        <FavoriteIcon/>
      </div>
      <span>Yêu thích</span>
    </div>
  )
}

export default CastButtonFavorite