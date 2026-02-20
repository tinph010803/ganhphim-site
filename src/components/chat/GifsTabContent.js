"use client"

import {memo, useEffect, useMemo, useRef, useState} from "react";
import TenorApi from "@/api/tenor.api";
import {debounce} from "lodash/function";
import {Spinner} from "react-bootstrap";

const ChatGifTabContent = ({onGifClick, setShowDropdown, type = "all"}) => {
    const [gifs, setGifs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pos, setPos] = useState("");
    const [query, setQuery] = useState("");        // controlled input

    const stickerListRef = useRef(null);
    const lastQueryRef = useRef("");
    const reqIdRef = useRef(0);                    // bỏ kết quả cũ

    const getFeaturedGifs = async (reset = false) => {
        const myId = ++reqIdRef.current;
        setIsLoading(true);
        try {
            const posLocal = reset ? "" : pos;
            const {results, next} = await TenorApi.getListFeatured({ type, pos: posLocal });
            if (myId !== reqIdRef.current) return;     // có request mới hơn rồi
            setGifs(results || []);
            setPos(next || "");
            lastQueryRef.current = "";                 // context: featured
        } finally {
            setIsLoading(false);
        }
    };

    const doSearch = async (kw, posLocal = "") => {
        const myId = ++reqIdRef.current;
        setIsLoading(true);
        try {
            const {results, next} = await TenorApi.search({ keyword: kw, type, pos: posLocal });
            if (myId !== reqIdRef.current) return;     // có request mới hơn rồi
            setGifs(results || []);
            setPos(next || "");
            lastQueryRef.current = kw;
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce chỉ bọc logic search, có thể truyền keyword
    const debouncedSearch = useMemo(() => debounce((kw) => doSearch(kw, ""), 700), [type]);

    useEffect(() => {
        // mount: load featured trang đầu
        getFeaturedGifs(true);
        return () => debouncedSearch.cancel();       // cleanup
    }, [type]); // đổi type -> reload

    // Khi query đổi:
    useEffect(() => {
        const kw = query.trim();
        if (!kw) {
            // keyword rỗng: HUỶ search đang hẹn giờ và reset về featured
            debouncedSearch.cancel();
            setPos("");
            getFeaturedGifs(true);
        } else {
            // keyword có nội dung: nếu khác truy vấn trước => reset pos
            if (kw !== lastQueryRef.current) setPos("");
            debouncedSearch(kw);
        }
        // huỷ lần debounce cũ mỗi khi query thay đổi
        return () => debouncedSearch.cancel();
    }, [query, debouncedSearch]);

    // Infinite scroll
    useEffect(() => {
        const list = stickerListRef.current;
        if (!list) return;

        const onScroll = debounce(() => {
            if (list.scrollTop + list.clientHeight >= list.scrollHeight - 30) {
                loadMore();
            }
        }, 400);

        list.addEventListener("scroll", onScroll);
        return () => {
            list.removeEventListener("scroll", onScroll);
            onScroll.cancel();
        };
    }, [pos, query]);

    const loadMore = async () => {
        if (isLoading || !pos) return;
        const kw = query.trim();
        const myId = ++reqIdRef.current;
        setIsLoading(true);
        try {
            const api = kw ? TenorApi.search({ keyword: kw, type, pos }) : TenorApi.getListFeatured({ type, pos });
            const {results, next} = await api;
            if (myId !== reqIdRef.current) return;
            setGifs(prev => [...prev, ...(results || [])]);
            setPos(next || "");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGifClick = (gif) => {
        onGifClick(gif);
        setShowDropdown(false);
    };

    return (
        <>
            <div className="sticker-search px-2 mb-2">
                <div className="mini-search is-dark">
                    <div className="search-icon">
                        <i className="fa-solid fa-magnifying-glass" />
                    </div>
                    <input
                        type="text"
                        className="search-input"
                        placeholder={`Tìm kiếm ${type === "sticker" ? "Stickers" : "GIFs"}`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}   // controlled input
                    />
                </div>
            </div>

            <div className="sticker-list" ref={stickerListRef}>
                {isLoading && <Spinner animation="border" variant="warning" />}
                {gifs.map(gif => (
                    <div className="sk-item" key={`gif-${gif.id}`} onClick={() => handleGifClick(gif)}>
                        <img src={gif.media_formats?.nanogif?.url} alt="" />
                    </div>
                ))}
            </div>
        </>
    );
};

export default memo(ChatGifTabContent);
