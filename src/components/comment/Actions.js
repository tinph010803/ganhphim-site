import {Dropdown} from "react-bootstrap";
import {forwardRef, memo, useState} from "react";
import {useAppSelector} from "@/hooks/redux";
import {showToast} from "@/utils/helpers";
import CommentApi from "@/api/comment.api";

const CustomToggle = forwardRef(({children, onClick}, ref) => {
  const {loggedUser} = useAppSelector((state) => state.auth)

  const handleOnclick = (e) => {
    e.preventDefault()
    if (loggedUser === null) {
      showToast({message: "Bạn phải đăng nhập để sử dụng tính năng này.", type: "error"})
      return
    }

    onClick(e)
  }
  return (
    <button ref={ref} onClick={handleOnclick} type="button" className="btn btn-xs btn-basic btn-menu">
      <i className="fa-solid fa-ellipsis"></i>
      <span>Thêm</span>
    </button>
  )
})

const CommentActions = ({id, isPinned}) => {
  const {loggedUser} = useAppSelector((state) => state.auth)
  const [showBanOptions, setShowBanOptions] = useState(false)

  const handleActionClick = async (action, info = null) => {
    try {
      const {status, msg} = await CommentApi.action({id, action, info})

      if (status) {
        showToast({message: msg, type: "success"})
      } else {
        showToast({message: msg, type: "error"})
      }
    } catch (err) {
    }
  }

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle}/>
        {loggedUser && <Dropdown.Menu className="dropdown-menu v-dropdown-menu min-dropdown">
          {loggedUser.role === "member" && <>
            <a className="dropdown-item" onClick={() => handleActionClick("spoil-report")}>
              <i className="fa-solid fa-eye"></i>
              <span>Tiết lộ nội dung</span>
            </a>
            <a className="dropdown-item" onClick={() => handleActionClick("bad-report")}>
              <i className="fa-solid fa-flag"></i>
              <span>Báo xấu</span>
            </a>
          </>}
          {(loggedUser.role === "mod" || loggedUser.role === "admin") && <>
            {!isPinned && <a className="dropdown-item" onClick={() => handleActionClick("pin")}>
              <i className="fa-solid fa-thumbtack"></i>
              <span>Ghim</span>
            </a>}
            {isPinned && <a className="dropdown-item" onClick={() => handleActionClick("unpin")}>
              <i className="fas fa-thumbtack"></i>
              <span>Bỏ ghim</span>
            </a>}
            <a className="dropdown-item" onClick={() => handleActionClick("delete")}>
              <i className="fa-solid fa-trash"></i>
              <span>Xóa</span>
            </a>
            <a className={`dropdown-item open-limit ${showBanOptions ? "highlight" : ""}`}
               onClick={() => setShowBanOptions(!showBanOptions)}>
              <i className="fa-solid fa-comment-slash"></i>
              <span>Cấm bình luận</span>
            </a>
            {showBanOptions && <div className="limit-wrap">
              <a className="lw-item" onClick={() => handleActionClick("ban", {duration: 24})}>1 ngày</a>
              <a className="lw-item" onClick={() => handleActionClick("ban", {duration: 24 * 3})}>3 ngày</a>
              <a className="lw-item" onClick={() => handleActionClick("ban", {duration: 24 * 7})}>1 tuần</a>
              {loggedUser.role === "admin" &&
                <a className="lw-item" onClick={() => handleActionClick("ban")}>Vĩnh viễn</a>}
            </div>}
          </>}
        </Dropdown.Menu>}
      </Dropdown>
    </>
  )
}

export default memo(CommentActions)