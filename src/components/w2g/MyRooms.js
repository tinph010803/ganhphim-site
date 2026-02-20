"use client"

import {forwardRef, memo, useEffect, useState} from "react";
import RoomNormal from "@/components/w2g/room/Normal";
import LoadingElement from "@/components/loading/Element";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {fetchMyRooms, toggleShowModalCreateGuide} from "@/redux/features/w2gSlice";
import Link from "next/link";
import {Dropdown} from "react-bootstrap";

const CustomToggle = forwardRef(({children, onClick}, ref) => (
    <a className="btn btn-sm btn-circle btn-outline" ref={ref} onClick={(e) => {
        e.preventDefault();
        onClick(e);
    }}><i className="fa-solid fa-ellipsis-v"></i></a>
))

const W2gMyRooms = ({}) => {
    const dispatch = useAppDispatch()
    const rooms = useAppSelector(s => s.w2g.myRooms)
    const isLoading = useAppSelector(s => s.w2g.isLoading)
    const hasMore = useAppSelector(s => s.w2g.hasMore)
    const [filter, setFilter] = useState({status: ''})
    const [page, setPage] = useState(1)

    useEffect(() => {
        dispatch(fetchMyRooms({page, ...filter}));
    }, [filter, page]);

    const handleStatusChange = (newStatus) => {
        setFilter(prev => ({...prev, status: newStatus, page: 1}));
    };

    return (
        <>
            <div className="row-header mb-4">
                <Link className="btn btn-circle btn-outline" href="/xem-chung">
                    <i className="fa-solid fa-angle-left"></i>
                </Link>
                <h3 className="category-name me-2">Quản lý</h3>
                <a className="btn btn-sm btn-light btn-rounded"
                   onClick={() => dispatch(toggleShowModalCreateGuide())}>
                    <i className="fa-solid fa-plus"></i>
                    <span>Tạo mới</span>
                </a>
                <Dropdown className="is-option">
                    <Dropdown.Toggle as={CustomToggle}/>
                    <Dropdown.Menu className="v-dropdown-menu" as="ul">
                        <a className={`dropdown-item ${filter?.status === '' ? 'active' : ''}`}
                           onClick={() => handleStatusChange('')}><span
                            className="flex-grow-1">Tất cả</span></a>
                        <a className={`dropdown-item ${filter?.status === 1 ? 'active' : ''}`}
                           onClick={() => handleStatusChange(1)}><span
                            className="flex-grow-1">Đang chiếu</span></a>
                        <a className={`dropdown-item ${filter?.status === 0 ? 'active' : ''}`}
                           onClick={() => handleStatusChange(0)}><span
                            className="flex-grow-1">Đã lên lịch</span></a>
                        <a className={`dropdown-item ${filter?.status === 2 ? 'active' : ''}`}
                           onClick={() => handleStatusChange(2)}>Đã kết thúc</a>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="row-content">
                {isLoading && <LoadingElement/>}
                {(rooms.length > 0 && !isLoading) && <div className="w2g-live">
                    <div className="live-grid live-grid-small">
                        {rooms.map(room => {
                            return (
                                <RoomNormal room={room} key={room._id} isOwner={true}/>
                            )
                        })}
                    </div>
                </div>}
            </div>
            {(rooms.length === 0 && !isLoading) && <div className="v-notice" style={{margin: "3rem 0"}}>
                <div className="inc-icon icon-notice">
                    <img src="/images/icons/live.svg" alt="live icon"/>
                </div>
                <p className="mb-0">Không có phòng xem chung nào</p>
            </div>}
            {hasMore && (<div className="buttons-loadmore text-center mt-5 pt-4">
                <a className="btn btn-xl btn-outline btn-rounded" onClick={() => setPage(page + 1)}>
                    <span>Tải thêm</span>
                    <i className="fa-solid fa-angle-down"></i>
                </a>
            </div>)}
        </>
    )
}

export default memo(W2gMyRooms)