"use client"

import {forwardRef, memo, useEffect, useState} from "react";
import RoomNormal from "@/components/w2g/room/Normal";
import LoadingElement from "@/components/loading/Element";
import {Dropdown} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {fetchNormalRooms} from "@/redux/features/w2gSlice";

const CustomToggle = forwardRef(({children, onClick}, ref) => (
    <a className="btn btn-sm btn-circle btn-outline" ref={ref} onClick={(e) => {
        e.preventDefault();
        onClick(e);
    }}><i className="fa-solid fa-ellipsis-v"></i></a>
))

const W2gListNormalRooms = ({}) => {
    const dispatch = useAppDispatch();

    const rooms = useAppSelector(s => s.w2g.normalRooms)
    const isLoading = useAppSelector(s => s.w2g.isLoading)
    const hasMore = useAppSelector(s => s.w2g.hasMore)
    const [filter, setFilter] = useState({sort_by: 'latest', status: ''})
    const [page, setPage] = useState(1)

    useEffect(() => {
        dispatch(fetchNormalRooms({page, ...filter}));
    }, [filter, page]);

    // Hàm thay đổi sort trong filter
    const handleSortChange = (newSort) => {
        setFilter(prev => ({...prev, sort_by: newSort, page: 1}));
    };

    // Hàm thay đổi status trong filter
    const handleStatusChange = (newStatus) => {
        setFilter(prev => ({...prev, status: newStatus, page: 1}));
    };

    return (
        <div className="cards-row wide">
            <div className="row-header">
                <h3 className="category-name me-3">Xem Chung</h3>
                <div className="model-tabs">
                    <a className={`item ${filter.sort_by === 'latest' ? 'active' : ''}`}
                       onClick={() => handleSortChange('latest')}>Mới
                        nhất</a>
                    <a className={`item ${filter.sort_by === 'popular' ? 'active' : ''}`}
                       onClick={() => handleSortChange('popular')}>Phổ
                        biến</a>
                </div>
                <Dropdown className="is-option">
                    <Dropdown.Toggle as={CustomToggle}/>
                    <Dropdown.Menu className="v-dropdown-menu" as="ul">
                        <a className={`dropdown-item ${filter.status === '' ? 'active' : ''}`}
                           onClick={() => handleStatusChange('')}><span
                            className="flex-grow-1">Tất cả</span></a>
                        <a className={`dropdown-item ${filter.status === 1 ? 'active' : ''}`}
                           onClick={() => handleStatusChange(1)}><span
                            className="flex-grow-1">Đang chiếu</span></a>
                        <a className={`dropdown-item ${filter.status === 0 ? 'active' : ''}`}
                           onClick={() => handleStatusChange(0)}><span
                            className="flex-grow-1">Đã lên lịch</span></a>
                        <a className={`dropdown-item ${filter.status === 2 ? 'active' : ''}`}
                           onClick={() => handleStatusChange(2)}>Đã kết thúc</a>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="row-content">
                {(rooms.length === 0 && !isLoading) && <div className="v-notice" style={{margin: "3rem 0"}}>
                    <div className="inc-icon icon-notice">
                        <img src="/images/icons/live.svg" alt="live icon"/>
                    </div>
                    <p className="mb-0">Không có phòng xem chung nào</p>
                </div>}
                {rooms.length > 0 && <div className="w2g-live">
                    <div className="live-grid live-grid-small">
                        {rooms.map(room => {
                            return (
                                <RoomNormal room={room} key={room._id}/>
                            )
                        })}
                    </div>
                </div>}
                {isLoading && <LoadingElement/>}
                {hasMore && (<div className="buttons-loadmore text-center mt-5 pt-4">
                    <a className="btn btn-xl btn-outline btn-rounded" onClick={() => setPage(page + 1)}>
                        <span>Tải thêm</span>
                        <i className="fa-solid fa-angle-down"></i>
                    </a>
                </div>)}
            </div>
        </div>
    )
}

export default memo(W2gListNormalRooms)