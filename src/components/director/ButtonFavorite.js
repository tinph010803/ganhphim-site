"use client"

import FavoriteIcon from "@/components/icons/Favorite";
import {showToast} from "@/utils/helpers";
import {useAppSelector} from "@/hooks/redux";
import FavoriteDirectorApi from "@/api/favoriteDirector.api";
import {useEffect, useState} from "react";

const DirectorButtonFavorite = ({directorId}) => {
  const {loggedUser} = useAppSelector(state => state.auth)
  const [info, setInfo] = useState(null)

  useEffect(() => {
    if (loggedUser)
      getInfo()
  }, [directorId, loggedUser]);

  const getInfo = async () => {
    const {result} = await FavoriteDirectorApi.info(directorId)
    setInfo(result)
  }

  const handleFavClick = async () => {
    if (loggedUser === null) {
      showToast({message: "Bạn phải đăng nhập để sử dụng tính năng này.", type: "error"})
      return
    }
    if (info) {
      setInfo(null)
      const {status, msg} = await FavoriteDirectorApi.remove({director_id: directorId})
      if (status) {
        showToast({message: msg, type: 'success'})
      }
    } else {
      const {status, msg, result} = await FavoriteDirectorApi.add({director_id: directorId})
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

export default DirectorButtonFavorite