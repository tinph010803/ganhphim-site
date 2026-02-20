import {memo, useRef, useState, useEffect} from "react";
import {motion} from "framer-motion"
import {useAppSelector, useAppDispatch} from "@/hooks/redux"
import {setShowSearchResult} from "@/redux/features/appSlice";
import MovieApi from "@/api/movie.api";
import CastApi from "@/api/cast.api";
import CustomLink from "@/components/shared/CustomLink";
import SearchMovieResults from "@/components/seach/MovieResults";
import SearchCastResults from "@/components/seach/CastResults";
import {usePathname, useRouter} from "next/navigation";
import LoadingElement from "@/components/loading/Element";
import {resetFilterData} from "@/redux/features/movieSlice";
import {castResetFilterData} from "@/redux/features/castSlice";

const HeaderSearch = ({mShowSearch, setMShowSearch}) => {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()
    const {showSearchResult} = useAppSelector(state => state.app)
    const searchRef = useRef(null)
    const inputRef = useRef(null)
    const searchTimeoutRef = useRef(null)

    const [movies, setMovies] = useState([])
    const [casts, setCasts] = useState([])
    const [searchHistory, setSearchHistory] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const search = async (keyword) => {
        setIsLoading(true)
        dispatch(setShowSearchResult(true))
        const [movieRes, castRes] = await Promise.all([
            MovieApi.filter({q: keyword, limit: 5}),
            CastApi.list({keyword, limit: 5}),
        ])
        setMovies(movieRes.items)
        setCasts(castRes.items)
        setIsLoading(false)
    }

    const resetSearch = () => {
        dispatch(setShowSearchResult(false))
        inputRef.current.value = ''
        inputRef.current.blur()
        setMovies([])
        setCasts([])
        setMShowSearch(false)
        dispatch(resetFilterData())
        dispatch(castResetFilterData())
    }

    const handleInputFocus = () => {
        if (inputRef.current.value) {
            dispatch(setShowSearchResult(true))
        }
    }

    const handleInputKeyup = (e) => {
        if (e.keyCode === 13 && inputRef.current.value) {
            router.push(`/tim-kiem?q=${inputRef.current.value}`)
            resetSearch()
        }
    }

    const handleInputChange = (e) => {
        clearTimeout(searchTimeoutRef.current)
        const keyword = e.target.value
        if (keyword) {
            searchTimeoutRef.current = setTimeout(() => {
                search(keyword)
            }, 500)
        } else {
            dispatch(setShowSearchResult(false))
            setMovies([])
            setCasts([])
        }
    }

    const handleClearTextClick = () => {
        resetSearch()
        inputRef.current.focus()
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target) && showSearchResult) {
                dispatch(setShowSearchResult(false))
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showSearchResult])

    useEffect(() => {
        resetSearch()
    }, [pathname]);

    useEffect(() => {
        if (mShowSearch) inputRef.current.focus()
    }, [mShowSearch]);

    return (
        <div id="search" ref={searchRef} className={`${mShowSearch ? "toggled" : ""}`}>
            <div className="search-elements">
                <div className="search-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <input id="main-search" className="search-input" placeholder="Tìm kiếm phim, diễn viên"
                       autoComplete="off"
                       onFocus={handleInputFocus} ref={inputRef} onChange={handleInputChange}
                       onKeyUp={handleInputKeyup}/>
                {inputRef.current?.value &&
                    <div id="remove-text" className="remove-icon" onClick={() => handleClearTextClick()}>
                        <i className="fa-solid fa-circle-xmark"></i>
                    </div>}
            </div>
            {showSearchResult && <motion.div
                initial={{height: 0, opacity: 0}}
                animate={{height: showSearchResult ? 'auto' : 0, opacity: showSearchResult ? 1 : 0}}
                transition={{duration: 0.5, ease: "easeInOut"}}
                style={{overflow: "hidden"}}
            >
                <div className="search-modal">
                    {isLoading && <LoadingElement height={100}/>}
                    <SearchMovieResults movies={movies}/>
                    <SearchCastResults casts={casts}/>
                    {(movies.length > 0 || casts.length > 0) &&
                        <CustomLink className="view-all" href={`/tim-kiem?q=${inputRef.current.value}`} onClick={resetSearch}>Toàn
                            bộ kết
                            quả</CustomLink>}
                    {(movies.length === 0 && casts.length === 0 && !isLoading) &&
                        <a className="view-all">Không tìm thấy kết quả nào</a>}
                </div>
            </motion.div>}
        </div>
    )
}

export default memo(HeaderSearch)