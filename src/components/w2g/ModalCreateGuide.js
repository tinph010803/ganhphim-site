"use client"

import {memo} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {Modal} from "react-bootstrap";
import {toggleShowModalCreateGuide} from "@/redux/features/w2gSlice";

const W2gModalCreateGuide = () => {
    const dispatch = useAppDispatch()
    const {showModalCreateGuide} = useAppSelector(s => s.w2g)

    return (
        <Modal className="v-modal modal-createlive" centered={true} show={showModalCreateGuide} id="toggle-createlive"
               onHide={() => dispatch(toggleShowModalCreateGuide())}>
            <button className="btn modal-close" aria-label="Close"
                    onClick={() => dispatch(toggleShowModalCreateGuide())}>
                <i className="fa-solid fa-times"></i>
            </button>
            <div className="is-header mb-2">
                <h4 className="heading-sm mb-0 ">Tạo phòng xem chung</h4>
            </div>
            <div className="is-body mb-4">
                <p>Hướng dẫn nhanh cách tạo phòng xem chung</p>
                <div className="create-live-steps">
                    <div className="step">
                        <div className="number">1</div>
                        <div className="text">
                            Tìm phim bạn muốn xem chung.
                        </div>
                    </div>
                    <div className="step">
                        <div className="number">2</div>
                        <div className="text">
                            Chuyển tới trang xem của tập phim đó, chọn biểu tượng <span className="btn btn-sm btn-dark"><i
                            className="fa-solid fa-podcast"></i>Xem chung</span> trên thanh công cụ phía dưới player.
                        </div>
                    </div>
                    <div className="step">
                        <div className="number">3</div>
                        <div className="text">
                            Điền thông tin và cài đặt thời gian chiếu.
                        </div>
                    </div>
                    <div className="step">
                        <div className="number">4</div>
                        <div className="text">
                            Hoàn thành và chia sẻ cho bạn bè.
                        </div>
                    </div>
                </div>
            </div>
            <div className="is-footer">
                <button type="button" className="btn btn-light px-5" aria-label="Close"
                        onClick={() => dispatch(toggleShowModalCreateGuide())}>
                    Đã hiểu
                </button>
            </div>
        </Modal>
    )
}

export default memo(W2gModalCreateGuide)