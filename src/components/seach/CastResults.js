"use client"

import CustomLink from "@/components/shared/CustomLink";
import {castUrl} from "@/utils/url";
import {setShowSearchResult} from "@/redux/features/appSlice";
import {peopleAvatar} from "@/utils/image";
import {memo} from "react";
import {useAppDispatch} from "@/hooks/redux";

const SearchCastResults = ({casts}) => {
  const dispatch = useAppDispatch()

  if (casts.length > 0)
    return (
      <div className="show-group effect-fade-in">
        <div className="group-title">Danh sách diễn viên</div>
        <div className="group-list">
          {casts.map(item => {
            const href = item.tmdb_id ? `/dien-vien/tmdb/${item.tmdb_id}` : castUrl(item)
            return (
              <CustomLink href={href} className="h-item s-item" key={`sr-${item._id}`}
                    onClick={() => dispatch(setShowSearchResult(false))}>
                <div className="v-actor">
                  <img src={peopleAvatar(item.profile_path)} alt={item.name}/>
                </div>
                <div className="info">
                  <h4 className="item-title lim-1">{item.name}</h4>
                </div>
              </CustomLink>
            )
          })}
        </div>
      </div>
    )
}

export default memo(SearchCastResults)