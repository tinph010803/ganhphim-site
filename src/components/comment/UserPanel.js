"use client"

import {memo} from "react";
import {userAvatar} from "@/utils/image";
import {useLoginUrl} from "@/hooks/useLoginUrl";

const CommentUserPanel = ({loggedUser}) => {
  const loginUrl = useLoginUrl()

  if (loggedUser) {
    return (
      <div className="ma-user">
        <div className="user-avatar"><img src={userAvatar(loggedUser)} alt={loggedUser.name}/></div>
        <div className="info">
          <small>Bình luận với tên</small>
          <span>{loggedUser.name}</span>
        </div>
      </div>
    )
  } else {
    return (
      <div className="ma-via mb-3">
        Vui lòng <a className="text-primary" href={loginUrl}>đăng nhập</a> để tham gia
        bình luận.
      </div>
    )
  }
}

export default memo(CommentUserPanel)