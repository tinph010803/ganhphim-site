"use client"

import {Modal} from "react-bootstrap";
import {memo} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {setShowModalShare} from "@/redux/features/appSlice";
import InlineShareButtons from "@/components/sharethis/InlineShareButtons";

const ShareModal = () => {
  const dispatch = useAppDispatch()
  const {showModalShare} = useAppSelector(state => state.app)

  return (
    <Modal className="v-modal modal-sm" centered={true} show={showModalShare}
           onHide={(isOpen) => dispatch(setShowModalShare(isOpen))}>
      <button className="btn modal-close" aria-label="Close" onClick={() => dispatch(setShowModalShare(false))}>
        <i className="fa-solid fa-times"></i>
      </button>
      <div className="is-header mb-3">
        <h4 className="heading-sm text-center mb-0 ">Chia sẻ</h4>
      </div>
      <div className="is-body">
        <InlineShareButtons/>
      </div>
    </Modal>
  )
}

export default memo(ShareModal)