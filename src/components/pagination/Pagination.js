"use client"

import {memo, useEffect, useRef} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {setCurrentPage} from "@/redux/features/paginationSlice";
import {usePathname} from "next/navigation";

const Pagination = ({pageCount, handlePageChange = null}) => {
    const dispatch = useAppDispatch()
    const pathname = usePathname()

    const pageInputRef = useRef(null);
    const {currentPage} = useAppSelector(state => state.pagination)

    useEffect(() => {
        if (pageInputRef.current) {
            pageInputRef.current.value = currentPage
        }
    }, [currentPage]);

    const changePage = (page) => {
        pageInputRef.current.value = page
        dispatch(setCurrentPage(page))
        if (!handlePageChange) return
        handlePageChange(page)
    }

    const onPageChange = (e) => {
        const value = e.target.value || 1
        const page = value <= 0 ? 1 : value
        pageInputRef.current.value = page <= pageCount ? page : pageCount
    }

    const handlePageKeyUp = (e) => {
        if (e.keyCode === 13) {
            const value = e.target.value
            dispatch(setCurrentPage(value))
            if (!handlePageChange) return
            handlePageChange(value)
        }
    }

    if (pageCount > 1)
        return (
            <div className="v-pagination line-center">
                <div className="page-control line-center">
                    <button type="button" className="btn btn-circle btn-lg btn-secondary"
                            onClick={() => changePage(currentPage - 1)} disabled={currentPage <= 1}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <div className="page-current line-center">
                        <div>Trang</div>
                        <input type="number" className="form-control v-form-control" ref={pageInputRef}
                               onKeyUp={handlePageKeyUp}
                               defaultValue={currentPage}
                               onChange={onPageChange} required max={pageCount}/>
                        <div> / {pageCount}</div>
                    </div>
                    <button type="button" className="btn btn-circle btn-lg btn-secondary"
                            onClick={() => changePage(currentPage + 1)} disabled={currentPage >= pageCount}>
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        )
}

export default memo(Pagination)