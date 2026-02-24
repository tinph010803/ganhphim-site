"use client"

import {usePathname, useSearchParams} from 'next/navigation'
import {memo, useEffect, useMemo, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {fetchFilterMovies} from "@/redux/features/movieSlice";
import MovieItemStyle1 from "@/components/movie/item/Style1";
import Pagination from "@/components/pagination/Pagination";
import {listType} from "@/constants/episodeVersion";
import LoadingElement from "@/components/loading/Element";
import {movieRatingList} from "@/constants/movieRating";
import {setCurrentPage} from "@/redux/features/paginationSlice";
import CollectionApi from "@/api/collection.api";

const MovieFilter = ({initFilter = null, initShowFilter = false, allowFilter = true, customClass = ""}) => {
    const searchParams = useSearchParams()
    const dispatch = useAppDispatch()
    const pathname = usePathname()

    const {filterMovies, filterPageCount, filterIsLoading} = useAppSelector(state => state.movie)
    const {countries, genres} = useAppSelector(state => state.app)

    const [showFilter, setShowFilter] = useState(initShowFilter)

    const initialPage = Number(searchParams.get('page')) || 1

    const [years, setYears] = useState([])
    const [inputYear, setInputYear] = useState(null)
    const yearInputRef = useRef(null)
    const actorInputRef = useRef(null)
    const [topics, setTopics] = useState([])

    const filterValue = useMemo(() => {
        const parseArray = (key, toInt = false) => {
            const raw = searchParams.get(key)
            if (!raw) {
                const init = initFilter?.[key]
                if (!init) return []
                // Wrap plain string in array
                return Array.isArray(init) ? init : [init]
            }
            const items = raw.split(',')
            return toInt ? items.map(v => parseInt(v)).filter(v => !isNaN(v)) : items
        }

        return {
            q: searchParams.get('q') || initFilter?.q || "",
            actor: searchParams.get('actor') || initFilter?.actor || "",
            countries: parseArray('countries'),
            genres: parseArray('genres'),
            subjects: parseArray('subjects'),
            years: parseArray('years'),
            custom_year: searchParams.get('custom_year') || "",
            quality: parseArray('quality'),
            type: searchParams.get('type') || initFilter?.type || "",
            status: searchParams.get('status') || initFilter?.status || "",
            exclude_status: searchParams.get('exclude_status') || initFilter?.exclude_status || "",
            versions: parseArray('versions', true),
            rating: parseArray('rating', true),
            networks: parseArray('networks'),
            productions: parseArray('productions'),
            sort: searchParams.get('sort') || initFilter?.sort || "release_date",
            page: initialPage,
        }
    }, [searchParams, initFilter])

    const [selectedFilter, setSelectedFilter] = useState(filterValue)
    const [filter, setFilter] = useState(null)

    const sortList = [
        {value: "year", title: "Năm phát hành"},
        {value: "release_date", title: "Mới nhất"},
        {value: "updated_at", title: "Mới cập nhật"},
        {value: "imdb_rating", title: "Điểm IMDb"},
        {value: "total_views", title: "Lượt xem"},
    ]

    useEffect(() => {
        dispatch(setCurrentPage(initialPage))
        setFilter(filterValue)
        dispatch(fetchFilterMovies(filterValue))
    }, [])

    useEffect(() => {
        const curYear = new Date().getFullYear()
        const yearsArr = []
        for (let i = curYear; i > curYear - 16; i--) {
            yearsArr.push(i.toString())
        }
        setYears(yearsArr)
    }, [])

    useEffect(() => {
        CollectionApi.allTopics().then(res => {
            if (res?.result?.items?.length > 0) setTopics(res.result.items)
        })
    }, [])

    const handleActorInputChange = () => {
        setSelectedFilter(prev => ({...prev, actor: actorInputRef.current?.value || ''}))
    }

    const handleUpdateFilterArray = (key, value, isInt = false) => {
        let list = [...selectedFilter[key]]
        if (value) {
            if (list.includes(value)) {
                list = list.filter(v => v !== value)
            } else {
                list.push(isInt ? parseInt(value) : value)
            }
        } else {
            list = []
        }
        setSelectedFilter(prev => ({...prev, [key]: list}))
    }

    const handleFilterClick = () => {
        const newFilter = {...selectedFilter, page: 1}
        setFilter(newFilter)
        dispatch(setCurrentPage(1))
        dispatch(fetchFilterMovies(newFilter))

        const queryString = Object.entries(newFilter)
            .map(([key, val]) => `${key}=${Array.isArray(val) ? val.join(',') : val}`)
            .join('&')

        window.location.href = `/duyet-tim?${queryString}`
    }

    const handlePageChange = (page) => {
        const newFilter = {...filter, page}
        setFilter(newFilter)
        dispatch(fetchFilterMovies(newFilter))
        window.scrollTo(0, 0)

        if (pathname === "/tim-kiem") {
            const query = newFilter.page > 1 ? `?q=${newFilter.q}&page=${newFilter.page}` : `?q=${newFilter.q}`
            window.history.replaceState({}, '', `${pathname}${query}`)
        } else if (pathname !== "/duyet-tim") {
            const query = newFilter.page > 1 ? `?page=${newFilter.page}` : ''
            window.history.replaceState({}, '', `${pathname}${query}`)
        } else {
            const queryString = Object.entries(newFilter)
                .map(([key, val]) => `${key}=${Array.isArray(val) ? val.join(',') : val}`)
                .join('&')
            window.history.replaceState({}, '', `${pathname}?${queryString}`)
        }
    }

    const handleInputYearChange = () => {
        const year = yearInputRef.current.value
        if (year.length === 4) {
            setSelectedFilter(prev => ({...prev, custom_year: year}))
        } else {
            setSelectedFilter(prev => ({...prev, custom_year: ''}))
        }
    }

    return (
        <>
            {allowFilter && <div className="v-filter">
                <div className={`filter-toggle line-center ${showFilter ? "toggled" : ""}`}
                     onClick={() => setShowFilter(!showFilter)}>
                    <i className="fa-solid fa-filter"></i>
                    <span>Bộ lọc</span>
                </div>
                <div className={`filter-elements ${!showFilter ? "d-none" : ""}`}>
                    <div className="fe-row">
                        <div className="fe-name">Quốc gia:</div>
                        <div className="fe-results">
                            <div className={`item ${selectedFilter.countries.length === 0 ? 'active' : ''}`}
                                 onClick={() => handleUpdateFilterArray('countries', null)}>Tất cả
                            </div>
                            {countries.map(item => (
                                <div key={`f-c-${item._id}`}
                                     onClick={() => handleUpdateFilterArray('countries', item.code)}
                                     className={`item ${selectedFilter.countries.includes(item.code) ? 'active' : ''}`}>{item.name}</div>
                            ))}
                        </div>
                    </div>

                    <div className="fe-row">
                        <div className="fe-name">Loại phim:</div>
                        <div className="fe-results">
                            {["", "1", "2"].map(val => (
                                <div key={val} className={`item ${selectedFilter.type === val ? 'active' : ''}`}
                                     onClick={() => setSelectedFilter(prev => ({...prev, type: val}))}>
                                    {val === "" ? "Tất cả" : val === "1" ? "Phim lẻ" : "Phim bộ"}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fe-row">
                        <div className="fe-name">Xếp hạng:</div>
                        <div className="fe-results">
                            <div className={`item ${selectedFilter.rating.length === 0 ? 'active' : ''}`}
                                 onClick={() => handleUpdateFilterArray('rating', null)}>
                                Tất cả
                            </div>
                            {movieRatingList().map(item => (
                                <div key={`f-rating-${item.id}`}
                                     className={`item ${selectedFilter.rating.includes(item.id) ? 'active' : ''}`}
                                     onClick={() => handleUpdateFilterArray('rating', item.id, true)}>
                                    <strong>{item.title}</strong> ({item.note})
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fe-row">
                        <div className="fe-name">Diễn viên:</div>
                        <div className="fe-results">
                            <div className="year-input">
                                <div className="search-icon"><i className="fa-solid fa-search"></i></div>
                                <input className="form-control v-form-control v-form-control-sm" type="text"
                                       ref={actorInputRef}
                                       defaultValue={selectedFilter.actor}
                                       onChange={handleActorInputChange}
                                       placeholder="Tên diễn viên..."/>
                            </div>
                        </div>
                    </div>

                    <div className="fe-row">
                        <div className="fe-name">Thể loại:</div>
                        <div className="fe-results">
                            <div className={`item ${selectedFilter.genres.length === 0 ? 'active' : ''}`}
                                 onClick={() => handleUpdateFilterArray('genres', null)}>
                                Tất cả
                            </div>
                            {genres.map(item => (
                                <div key={`f-g-${item._id}`} onClick={() => handleUpdateFilterArray('genres', item.slug || item._id)}
                                     className={`item ${selectedFilter.genres.includes(item.slug || item._id) ? 'active' : ''}`}>{item.name}</div>
                            ))}
                        </div>
                    </div>

                    {topics.length > 0 && (
                        <div className="fe-row">
                            <div className="fe-name">Chủ đề:</div>
                            <div className="fe-results">
                                <div className={`item ${selectedFilter.subjects.length === 0 ? 'active' : ''}`}
                                     onClick={() => handleUpdateFilterArray('subjects', null)}>Tất cả</div>
                                {topics.map(item => (
                                    <div key={`f-sub-${item._id}`}
                                         onClick={() => handleUpdateFilterArray('subjects', item._id)}
                                         className={`item ${selectedFilter.subjects.includes(item._id) ? 'active' : ''}`}>{item.name}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="fe-row">
                        <div className="fe-name">Phiên bản:</div>
                        <div className="fe-results">
                            <div className={`item ${selectedFilter.versions.length === 0 ? 'active' : ''}`}
                                 onClick={() => handleUpdateFilterArray('versions', null)}>
                                Tất cả
                            </div>
                            {listType().map(item => (
                                <div key={`f-ver-${item.id}`}
                                     className={`item ${selectedFilter.versions.includes(item.id) ? 'active' : ''}`}
                                     onClick={() => handleUpdateFilterArray('versions', item.id, true)}>{item.name}</div>
                            ))}
                        </div>
                    </div>

                    <div className="fe-row">
                        <div className="fe-name">Năm sản xuất:</div>
                        <div className="fe-results">
                            <div className={`item ${selectedFilter.years.length === 0 && !yearInputRef.current?.value ? 'active' : ''}`}
                                 onClick={() => handleUpdateFilterArray('years', null)}>
                                Tất cả
                            </div>
                            {years.map(year => (
                                <div key={`y-${year}`} onClick={() => handleUpdateFilterArray('years', year)}
                                     className={`item ${selectedFilter.years.includes(year) ? 'active' : ''}`}>{year}</div>
                            ))}
                            <div className="year-input">
                                <div className="search-icon">
                                    <i className="fa-solid fa-search"></i>
                                </div>
                                <input className="form-control v-form-control v-form-control-sm" type="text"
                                       ref={yearInputRef} defaultValue={selectedFilter.custom_year} maxLength={4}
                                       onChange={handleInputYearChange}
                                       placeholder="Nhập năm"/>
                            </div>
                        </div>
                    </div>

                    <div className="fe-row">
                        <div className="fe-name">Sắp xếp:</div>
                        <div className="fe-results">
                            {sortList.map(item => (
                                <div key={`sort-${item.value}`}
                                     className={`item ${selectedFilter.sort === item.value ? 'active' : ''}`}
                                     onClick={() => setSelectedFilter(prev => ({...prev, sort: item.value}))}>
                                    {item.title}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fe-row fe-row-end">
                        <div className="fe-name">&nbsp;</div>
                        <div className="fe-buttons flex-grow-1">
                            <button type="button" className="btn btn-rounded btn-primary" onClick={handleFilterClick}>
                                Lọc kết quả <i className="fa-solid fa-arrow-right"></i>
                            </button>
                            <button type="button" id="close-filter" className="btn btn-rounded btn-outline ms-2 px-4"
                                    onClick={() => setShowFilter(false)}>Đóng
                            </button>
                        </div>
                    </div>
                </div>
            </div>}

            <div className="row-content">
                {filterIsLoading && <LoadingElement/>}
                <div className={`cards-grid-wrapper ${customClass}`}>
                    {filterMovies.map(item => (
                        <MovieItemStyle1 movie={item} key={`movie-${item._id}`}/>
                    ))}
                </div>
            </div>

            <Pagination pageCount={filterPageCount} handlePageChange={handlePageChange}/>
        </>
    )
}

export default memo(MovieFilter)
