"use client"

import {memo} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import useOnceWhen from "@/hooks/useOnceWhen";
import {fetchKoreanMovies, fetchChineseMovies, fetchUsUkMovies} from "@/redux/features/movieSlice";
import CollectionStyle6 from "@/components/collection/Style6";

const ROWS = [
    {key: 'koreanMovies',  name: 'Phim Hàn Quốc mới',  color: '#f4a724', slug: 'han-quoc',   url: '/quoc-gia/han-quoc',   thunk: fetchKoreanMovies},
    {key: 'chineseMovies', name: 'Phim Trung Quốc mới', color: '#f4724a', slug: 'trung-quoc', url: '/quoc-gia/trung-quoc',  thunk: fetchChineseMovies},
    {key: 'usUkMovies',    name: 'Phim US-UK mới',      color: '#e84393', slug: 'au-my',      url: '/quoc-gia/au-my',      thunk: fetchUsUkMovies},
]

const HomeCountryRows = () => {
    const dispatch = useAppDispatch()
    const movieState = useAppSelector(state => state.movie)

    useOnceWhen(true, () => {
        ROWS.forEach(row => {
            if (movieState[row.key].length === 0) dispatch(row.thunk())
        })
    })

    const hasAny = ROWS.some(row => movieState[row.key].length > 0)
    if (!hasAny) return null

    return (
        <div className="cards-row cards-slide wide effect-fade-in">
            <div className="topics-list single mt-0">
                {ROWS.map(row => {
                    const movies = movieState[row.key]
                    if (movies.length === 0) return null
                    const fakeCollection = {
                        _id: `country-${row.slug}`,
                        name: row.name,
                        color: row.color,
                        slug: row.slug,
                        url: row.url,
                        type: 2,
                        movies,
                        random_data: false,
                    }
                    return <CollectionStyle6 key={row.key} collection={fakeCollection}/>
                })}
            </div>
        </div>
    )
}

export default memo(HomeCountryRows)
