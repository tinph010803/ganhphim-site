"use client"

import {memo, useMemo, useState} from "react";
import Link from "next/link";
import {TMDB_IMG} from "@/api/tmdb.api";

const TmdbMovieList = ({credits}) => {
    const [tab, setTab] = useState("all")

    const byYear = useMemo(() => {
        const map = {}
        credits.forEach(item => {
            const year = (item.release_date || item.first_air_date || '').slice(0, 4) || '?'
            if (!map[year]) map[year] = []
            map[year].push(item)
        })
        return Object.keys(map)
            .sort((a, b) => b - a)
            .map(year => ({year, items: map[year]}))
    }, [credits])

    const renderCard = (item) => {
        const poster = item.poster_path
            ? `${TMDB_IMG}/w300${item.poster_path}`
            : '/images/thumbs/default.jpg'
        const title = item.title || item.name || 'Không rõ'
        const year = (item.release_date || item.first_air_date || '').slice(0, 4)
        const searchUrl = `/tim-kiem?q=${encodeURIComponent(title)}`
        return (
            <div className="sw-item" key={`tmdb-credit-${item.id}-${item.media_type}`}>
                <Link href={searchUrl} className="v-thumbnail">
                    <img src={poster} alt={title} loading="lazy"/>
                </Link>
                <div className="info">
                    <h4 className="item-title lim-1">
                        <Link href={searchUrl} title={title}>{title}</Link>
                    </h4>
                    {year && <div className="alias-title lim-1">{year}</div>}
                </div>
            </div>
        )
    }

    return (
        <div className="actor-film">
            <div className="cg-body-box pt-0 is-suggest">
                <div className="box-header">
                    <div className="heading-sm mb-0">Các phim đã tham gia</div>
                    <div className="model-tabs actor-tabs">
                        <div
                            className={`item${tab === "all" ? " active" : ""}`}
                            onClick={() => setTab("all")}
                        >Tất cả</div>
                        <div
                            className={`item${tab === "byYear" ? " active" : ""}`}
                            onClick={() => setTab("byYear")}
                        >Thời gian</div>
                    </div>
                </div>
                <div className="box-body">
                    {tab === "all" && (
                        <div className="cards-grid-wrapper de-suggest">
                            {credits.map(item => renderCard(item))}
                        </div>
                    )}
                    {tab === "byYear" && (
                        <div>
                            {byYear.map(group => (
                                <div className="time-row" key={`year-${group.year}`}>
                                    <div className="time-point">
                                        <span>{group.year}</span>
                                    </div>
                                    <div className="time-row-cards">
                                        {group.items.map(item => renderCard(item))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default memo(TmdbMovieList)
