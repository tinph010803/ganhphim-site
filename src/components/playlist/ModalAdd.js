"use client"

import {Modal, Spinner} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {memo, useRef, useState} from "react";
import PlaylistApi from "@/api/playlist.api";
import {showToast} from "@/utils/helpers";
import {toggleShowModalAdd, fetchPlaylist} from "@/redux/features/playlistSlice";

const ModalAddPlaylist = () => {
    const dispatch = useAppDispatch()
    const {showModalAdd} = useAppSelector(state => state.playlist)
    const [isLoading, setIsLoading] = useState(false)
    const playlistNameRef = useRef(null)

    const handleAddPlaylist = async () => {
        const name = playlistNameRef.current.value
        if (name) {
            setIsLoading(true)
            const {msg, status} = await PlaylistApi.add({name})
            if (status) {
                showToast({message: msg, type: "success"})
                dispatch(toggleShowModalAdd())
                dispatch(fetchPlaylist())
            } else {
                showToast({message: msg, type: "error"})
            }
            setIsLoading(false)
        } else {
            showToast({message: "Vui lòng nhập tên danh sách", type: "error"})
        }
    }
    return (
        <Modal className="v-modal modal-xs" centered={true} show={showModalAdd}>
            <button className="btn modal-close" onClick={() => dispatch(toggleShowModalAdd())}>
                <i className="fa-solid fa-times"></i>
            </button>
            <div className="is-header mb-3">
                <h4 className="heading-xs mb-0 ">Thêm danh sách mới</h4>
            </div>
            <div className="is-body mb-4">
                <input className="form-control v-form-control" type="text" placeholder="Tên danh sách"
                       ref={playlistNameRef}
                       maxLength={20}/>
            </div>
            <div className="is-footer">
                <button type="button" className="btn btn-sm btn-primary" onClick={() => handleAddPlaylist()}>
                    <i className="fa-solid fa-plus small"></i>Thêm
                    {isLoading && <Spinner
                        className="ms-2"
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />}
                </button>
                <button type="button" className="btn btn-sm btn-light px-4"
                        onClick={() => dispatch(toggleShowModalAdd())}>
                    Đóng
                </button>
            </div>
        </Modal>
    )
}

export default memo(ModalAddPlaylist)