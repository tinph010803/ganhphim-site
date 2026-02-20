"use client"

import {memo, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {peopleAvatar} from "@/utils/image";
import Pagination from "@/components/pagination/Pagination";
import Link from "next/link";
import {castUrl} from "@/utils/url";
import {fetchFilterCasts, setFilter} from "@/redux/features/castSlice";
import LoadingElement from "@/components/loading/Element";
import {usePathname} from "next/navigation";

const CastList = ({initFilter = null}) => {
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const {filter, filterCasts, filterPageCount, filterIsLoading} = useAppSelector(state => state.cast)

  useEffect(() => {
    dispatch(setFilter(initFilter))
  }, []);

  useEffect(() => {
    if (filter) {
      dispatch(fetchFilterCasts(filter))

      if (pathname === "/dien-vien") {
        const queryParams = []

        Object.keys(filter).forEach(key => {
          if (filter[key]) {
            if (key === "page") {
              if (filter[key] > 1)
                queryParams.push(`${key}=${filter[key]}`)
            } else {
              queryParams.push(`${key}=${filter[key]}`)
            }
          }
        })
        window.history.replaceState({}, '', `/dien-vien?${queryParams.join('&')}`)
      }
    }
  }, [filter]);

  const handlePageChange = (page) => {
    dispatch(setFilter({...filter, page}))
    window.scrollTo(0, 0)
  }

  return (
    <>
      <div className="row-content">
        {filterIsLoading && <LoadingElement/>}
        <div className="actors-grid-wrapper">
          {filterCasts.map(item => {
            const href = item.tmdb_id ? `/dien-vien/tmdb/${item.tmdb_id}` : castUrl(item)
            return (
              <div className="item-actor" key={`actor-${item._id}`}>
                <div className="v-item">
                  <Link href={href} className="v-actor v-actor-large">
                    <img src={peopleAvatar(item.profile_path)} alt={item.name}/>
                  </Link>
                  <div className="info">
                    <h4 className="item-title lim-2"><Link href={href} title={item.name}>{item.name}</Link>
                    </h4>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <Pagination pageCount={filterPageCount} handlePageChange={handlePageChange}/>
    </>
  )
}

export default memo(CastList)