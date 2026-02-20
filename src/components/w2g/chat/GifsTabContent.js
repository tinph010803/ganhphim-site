"use client"

import {memo, useEffect, useMemo, useRef, useState} from "react";
import TenorApi from "@/api/tenor.api";
import {debounce} from "lodash/function";
import {Spinner} from "react-bootstrap";

const ChatGifTabContent = ({onGifClick, setShowDropdown, type = "all"}) => {
    const [gifs, setGifs] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [pos, setPos] = useState("")
    const searchInputRef = useRef('')
    const stickerListRef = useRef(null);

    const getFeaturedGifs = async () => {
        setIsLoading(true)
        const {results, next} = await TenorApi.getListFeatured({type, pos})
        setGifs(results)
        setPos(next)
        setIsLoading(false)
    }

    const searchGifs = async () => {
        setIsLoading(true)
        try {
            const keyword = searchInputRef.current.value
            const {results, next} = await TenorApi.search({keyword, type, pos})
            setGifs(results)
            setPos(next)
        } catch (e) {

        }
        setIsLoading(false)
    }

    useEffect(() => {
        getFeaturedGifs()
    }, []);

    useEffect(() => {
        const handleScroll = debounce(() => {
            const list = stickerListRef.current;
            if (list.scrollTop + list.clientHeight >= list.scrollHeight - 30) {
                loadMoreData();
            }
        }, 1000); // Chờ 300ms sau lần cuộn cuối cùng

        const list = stickerListRef.current;
        list.addEventListener('scroll', handleScroll);

        return () => {
            list.removeEventListener('scroll', handleScroll);
        };
    }, [pos]);

    const handleGifClick = (gif) => {
        onGifClick(gif)
        setShowDropdown(false)
    }

    const debouncedSearchGifs = useMemo(() => {
        return debounce(searchGifs, 1000);
    }, []);

    const handleChangeSearchGifs = () => {
        const keyword = searchInputRef.current.value
        if (keyword) {
            debouncedSearchGifs()
        } else {
            getFeaturedGifs()
        }
    }

    const loadMoreData = async () => {
        if (isLoading || !pos) return

        setIsLoading(true)
        try {
            const keyword = searchInputRef.current.value;
            if (keyword) {
                const {results, next} = await TenorApi.search({keyword, type, pos})
                setGifs(prevGifs => [...prevGifs, ...results])
                setPos(next)
            } else {
                const {results, next} = await TenorApi.getListFeatured({type, pos})
                setGifs(prevGifs => [...prevGifs, ...results])
                setPos(next)
            }
        } catch (e) {
            console.error('Lỗi khi tải thêm GIF:', e)
        }
        setIsLoading(false)
    };

    return (
        <>
            <div className="sticker-search px-2 mb-2">
                <div className="mini-search is-dark">
                    <div className="search-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <input type="text" className="search-input"
                           placeholder={`Tìm kiếm ${type === 'sticker' ? 'Stickers' : 'GIFs'}`} ref={searchInputRef}
                           onChange={handleChangeSearchGifs}/>
                </div>
            </div>
            <div className="sticker-list" ref={stickerListRef}>
                {isLoading && <Spinner animation="border" variant="warning"/>}
                {gifs.map((gif, i) => (
                    <div className="sk-item" key={`gif-${gif.id}`} onClick={() => handleGifClick(gif)}>
                        <img src={gif.media_formats.nanogif.url}/>
                    </div>
                ))}
            </div>
        </>
    )
}

export default memo(ChatGifTabContent)