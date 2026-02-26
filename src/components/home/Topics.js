"use client"

import {memo, useEffect, useRef, useState} from "react";
import CustomLink from "@/components/shared/CustomLink";
import {collectionUrl} from "@/utils/url";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {fetchTopics} from "@/redux/features/collectionSlice";

const HomeTopics = () => {
    const dispatch = useAppDispatch()
    const sliderRef = useRef(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const {topics, moreTopics} = useAppSelector((state) => state.collection)

    useEffect(() => {
        if (topics.length === 0) {
            dispatch(fetchTopics())
        }
    }, [])

    const checkScroll = () => {
        const el = sliderRef.current
        if (!el) return
        setCanScrollLeft(el.scrollLeft > 0)
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
    }

    useEffect(() => {
        const el = sliderRef.current
        if (!el) return
        checkScroll()
        el.addEventListener('scroll', checkScroll)
        window.addEventListener('resize', checkScroll)
        return () => {
            el.removeEventListener('scroll', checkScroll)
            window.removeEventListener('resize', checkScroll)
        }
    }, [topics])

    const scroll = (dir) => {
        const el = sliderRef.current
        if (!el) return
        el.scrollBy({left: dir * (el.clientWidth * 0.8), behavior: 'smooth'})
    }

    if (topics.length > 0)
        return (
            <div className="cards-row wide">
                <div className="row-header">
                    <h3 className="category-name">Bạn đang quan tâm gì?</h3>
                </div>
                <div className="row-content ht-scroll-wrap">
                    {canScrollLeft && (
                        <button className="topics-arrow topics-arrow-left" onClick={() => scroll(-1)}>
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                    )}
                    <div ref={sliderRef} className="ht-slider">
                        {topics.map((topic) => {
                            const c = topic.color || '#1d2e79'
                            const thumb = topic.thumbnail || topic.thumb || null
                            return (
                                <CustomLink href={collectionUrl(topic)} className="ht-card" key={`h-topic-${topic._id}`}>
                                    <div className="ht-overlay" style={{backgroundColor: c}} />
                                    <div className="ht-glow" style={{backgroundColor: c}} />
                                    {thumb && (
                                        <div className="ht-thumb">
                                            <img src={thumb} alt={topic.name} className="ht-thumb__img" />
                                        </div>
                                    )}
                                    <div className="ht-body">
                                        <h3 className="ht-title">{topic.name}</h3>
                                        <div className="ht-link">Xem chủ đề <i className="fa-solid fa-angle-right"></i></div>
                                    </div>
                                </CustomLink>
                            )
                        })}
                        {moreTopics > 0 && (
                            <CustomLink href="/chu-de" className="ht-card ht-card--more">
                                <div className="ht-overlay" style={{backgroundColor: '#2e3245'}} />
                                <div className="ht-body">
                                    <h3 className="ht-title">+{moreTopics}<br/>chủ đề</h3>
                                    <div className="ht-link">Xem tất cả <i className="fa-solid fa-angle-right"></i></div>
                                </div>
                            </CustomLink>
                        )}
                    </div>
                    {canScrollRight && (
                        <button className="topics-arrow topics-arrow-right" onClick={() => scroll(1)}>
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    )}
                </div>
            </div>
        )
}

export default memo(HomeTopics)