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
                <div className="row-content topics-scroll-wrap">
                    {canScrollLeft && (
                        <button className="topics-arrow topics-arrow-left" onClick={() => scroll(-1)}>
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                    )}
                    <div ref={sliderRef} className="topics-list topics-grid topics-line mt-0">
                        {topics.map((topic) => {
                            return (
                                <CustomLink href={collectionUrl(topic)} className="row-topic"
                                            key={`h-topic-${topic._id}`}>
                                    <div className="mask"
                                         style={{backgroundColor: `${topic.color || "#1d2e79"}`}}></div>
                                    <div className="intro">
                                        <div className="heading-md lim-2 mb-0">{topic.name}</div>
                                        <div className="info">
                                            <div className="btn btn-sm btn-outline">
                                                <span>Xem chủ đề</span>
                                                <i className="fa-solid fa-angle-right"></i>
                                            </div>
                                        </div>
                                    </div>
                                </CustomLink>
                            )
                        })}
                        {moreTopics > 0 && <CustomLink href="/chu-de" className="row-topic more-topic p-3">
                            <div className="mask" style={{backgroundColor: `#2e3245`}}></div>
                            <div className="intro justify-content-center align-items-center">
                                <div className="heading-md mb-0">+{moreTopics} chủ đề</div>
                            </div>
                        </CustomLink>}
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