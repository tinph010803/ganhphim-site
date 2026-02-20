"use client"

import {forwardRef, memo, useState} from "react";
import {Dropdown} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {setReply} from "@/redux/features/socketSlice";
import {socketActions} from "@/redux/middlewares/socketMiddleware";

const CustomToggle = forwardRef(({children, onClick}, ref) => (
    <div className="opt" ref={ref} onClick={(e) => {
        e.preventDefault();
        onClick(e);
    }}>
        <i className="fa-solid fa-ellipsis-vertical"></i>
    </div>
))

const ChatMessageActions = ({item, roomId}) => {
    const dispatch = useAppDispatch()
    const loggedUser = useAppSelector(s => s.auth.loggedUser)
    const [showDropdown, setShowDropdown] = useState(false)
    const isOwner = false

    const handleActionClick = (action) => {
        setShowDropdown(false)
        switch (action) {
            case "reply":
                dispatch(setReply({roomId: roomId, reply: item}))
                break
            case "pin":
                dispatch({
                    type: socketActions.pinMessage,
                    payload: {roomId: roomId, messageId: item.message.id}
                })
                break
            case "delete":
                dispatch({
                    type: socketActions.deleteMessage,
                    payload: {roomId: roomId, messageId: item.message.id}
                })
                break
            case "ban":
                dispatch({
                    type: socketActions.banUser,
                    payload: {roomId: roomId, userId: item.message.user._id}
                })
                break
        }
    }

    return (
        <div className="opt-menu">
            <Dropdown show={showDropdown} onToggle={(isOpen) => setShowDropdown(isOpen)}>
                <Dropdown.Toggle as={CustomToggle}/>
                <Dropdown.Menu className="v-dropdown-menu w-icon" as="ul">
                    <li onClick={() => handleActionClick('reply')}>
                        <a className="dropdown-item">
                            <i className="fa-solid fa-reply"></i>
                            <span>Trả lời</span>
                        </a>
                    </li>
                    {((loggedUser && loggedUser.role === "admin") || isOwner) && <>
                        <li onClick={() => handleActionClick('delete')}>
                            <a className="dropdown-item">
                                <i className="fa-solid fa-trash"></i>
                                <span>Xóa</span>
                            </a>
                        </li>
                        <li onClick={() => handleActionClick('pin')}>
                            <a className="dropdown-item">
                                <i className="fa-solid fa-thumbtack"></i>
                                <span>Ghim</span>
                            </a>
                        </li>
                        {(((isOwner || ["admin", "mod"].includes(loggedUser.role)) && item.message.user.role === "member")) &&
                            <li onClick={() => handleActionClick('ban')}>
                                <a className="dropdown-item">
                                    <i className="fa-solid fa-ban"></i>
                                    <span>Cấm chat</span>
                                </a>
                            </li>}
                    </>}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default memo(ChatMessageActions);