"use client"

import Link from "next/link";
import {castUrl} from "@/utils/url";
import {peopleAvatar} from "@/utils/image";
import {memo, useEffect, useState} from "react";
import FavoriteCastApi from "@/api/favoriteCast.api";
import {showToast} from "@/utils/helpers";
import LoadingElement from "@/components/loading/Element";
import Pagination from "@/components/pagination/Pagination";

const UserFavoriteCasts = ({}) => {
  const [casts, setCasts] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const getFavCasts = async (page = 1) => {
    if (!isLoading) {
      setIsLoading(true)
      try {
        const {result} = await FavoriteCastApi.list({page})
        setCasts(result.items)
        setPageCount(result.page_count)
      } catch (err) {
      }
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getFavCasts()
  }, [])

  const handleRemoveClick = async (castId) => {
    const {status, msg} = await FavoriteCastApi.remove({cast_id: castId})
    if (status) {
      showToast({message: msg, type: "success"})
      setCasts(prevState => prevState.filter(el => el._id !== castId))
    }
  }

  const handlePageChange = async (page) => {
    setCasts([])
    getFavCasts(page)
  }

  return (
    <>
      {isLoading && <LoadingElement/>}
      {casts.length === 0 && <div className="v-notice">
        Bạn chưa có diễn viên yêu thích nào
      </div>}
      <div className="de-actors">
        {casts.map(item => {
          return (
            <div className="item-actor" key={`casts-${item._id}`}>
              <div className="v-item">
                <Link href={castUrl(item)} className="v-actor">
                  <img src={peopleAvatar(item.profile_path)} alt={item.name}/>
                </Link>
                <div className="info">
                  <h4 className="item-title">
                    <Link href={castUrl(item)}>{item.name}</Link>
                  </h4>
                  <a className="small line-center text-danger mt-1" onClick={() => handleRemoveClick(item._id)}>
                    <i className="fa-solid fa-trash"></i>
                    <span>Xoá</span>
                  </a>
                </div>
              </div>
              <div className="ro-play"></div>
            </div>
          )
        })}
      </div>
      <Pagination handlePageChange={handlePageChange} pageCount={pageCount}/>
    </>
  )
}

export default memo(UserFavoriteCasts)