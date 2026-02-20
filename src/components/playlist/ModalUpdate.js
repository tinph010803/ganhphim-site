"use client"

import {Modal, Spinner} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {fetchPlaylist, toggleShowModalUpdate} from "@/redux/features/playlistSlice";
import {memo, useRef, useState} from "react";
import PlaylistApi from "@/api/playlist.api";
import {showToast} from "@/utils/helpers";

const ModalUpdatePlaylist = () => {
  const dispatch = useAppDispatch()
  const {showModalUpdate, updatePlaylist} = useAppSelector(state => state.playlist)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [isUpdateLoading, setIsUpdateLoading] = useState(false)
  const playlistNameRef = useRef(null)

  const handleUpdatePlaylist = async () => {
    const name = playlistNameRef.current.value
    if (name && !isUpdateLoading) {
      setIsUpdateLoading(true)
      const {msg, status} = await PlaylistApi.update({id: updatePlaylist._id, data: {name}})
      if (status) {
        showToast({message: msg, type: "success"})
        dispatch(toggleShowModalUpdate())
        dispatch(fetchPlaylist())
      }
      setIsUpdateLoading(false)
    } else {
      showToast({message: "Vui lòng nhập tên danh sách", type: "error"})
    }
  }

  const handleDeletePlaylist = async () => {
    const conf = confirm("Bạn có chắc chắn muốn xóa playlist này?")
    if (conf) {
      if (!isDeleteLoading) {
        setIsDeleteLoading(true)
        const {msg, status} = await PlaylistApi.delete(updatePlaylist._id)
        setIsDeleteLoading(false)
        if (status) {
          showToast({message: msg, type: "success"})
          window.location.reload()
        } else {
          showToast({message: msg, type: "error"})
        }
      }
    }
  }

  return (
    <Modal className="v-modal modal-xs" centered={true} show={showModalUpdate}
           onHide={() => dispatch(toggleShowModalUpdate())}>
      <button className="btn modal-close" onClick={() => dispatch(toggleShowModalUpdate())}>
        <i className="fa-solid fa-times"></i>
      </button>
      <div className="is-header mb-3">
        <h4 className="heading-xs mb-0 ">Cập nhật Playlist</h4>
      </div>
      <div className="is-body mb-4">
        <div className="form-w-icon">
          <div className="fa-solid fa-pen icon"></div>
          <input className="form-control v-form-control" type="text" placeholder="Tên danh sách" ref={playlistNameRef}
                 autoFocus={true}
                 maxLength={20} defaultValue={updatePlaylist?.name}/>
        </div>
      </div>
      <div className="is-footer">
        <button type="button" className="btn btn-sm btn-primary" onClick={() => handleUpdatePlaylist()}>
          <i className="fa-solid fa-check small"></i>Lưu
          {isUpdateLoading && <Spinner
            className="ms-2"
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />}
        </button>
        <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDeletePlaylist()}>
          <i className="fa-solid fa-trash small"></i>Xóa
          {isDeleteLoading && <Spinner
            className="ms-2"
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />}
        </button>
      </div>
    </Modal>
  )
}

export default memo(ModalUpdatePlaylist)