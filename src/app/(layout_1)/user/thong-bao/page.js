"use client"

import UserSidebarMenu from "@/components/user/SidebarMenu";
import {useAppSelector} from "@/hooks/redux";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import NotificationItem from "@/components/notification/Item";
import NotificationApi from "@/api/notification.api";
import {Spinner} from "react-bootstrap";
import {homeUrl} from "@/utils/url";

const UserNotificationPage = () => {
    const router = useRouter()
    const {loggedUser, isLoadingUserInfo} = useAppSelector(state => state.auth)
    const [type, setType] = useState(1)
    const [notifications, setNotifications] = useState([])
    const [lastTime, setLastTime] = useState(0)
    const [loading, setLoading] = useState(false)

    const {
        totalNewMovie,
        totalNewCommunity,
    } = useAppSelector(state => state.user)

    const getNotifications = async () => {
        try {
            setLoading(true)
            const {result} = await NotificationApi.list({type, after_time: lastTime})
            if (lastTime > 0) {
                setNotifications([...notifications, ...result])
            } else {
                setNotifications(result)
            }
            setLoading(false)
        } catch (error) {
        }
    }

    const handleSeenAllClick = async () => {
        try {
            await NotificationApi.seenAll()
            window.location.reload()
        } catch (err) {
        }
    }

    const handleTypeClick = (type) => {
        setType(type)
        setLastTime(0)
        setNotifications([])
    }

    const handleLoadMore = async () => {
        setLastTime(notifications[notifications.length - 1].created_at)
    }

    useEffect(() => {
        if (loggedUser === null && !isLoadingUserInfo) {
            router.push(homeUrl())
        }
    }, [loggedUser, isLoadingUserInfo])

    useEffect(() => {
        if (loggedUser) {
            getNotifications()
        }
    }, [loggedUser, type, lastTime])

    return (
        <div id="wrapper" className="account-wrap">
            {(loggedUser && !isLoadingUserInfo) && <div className="dashboard-container">
                <UserSidebarMenu loggedUser={loggedUser} page="notification"/>
                <div className="dcc-main">
                    <div className="cg-body-box py-0 is-like">
                        <div className="box-header flex-column align-items-start gap-3">
                            <div className="line-head line-center gap-3">
                                <div className="heading-sm mb-0">Thông báo</div>
                                <div className="mark-all">
                                    <a className="btn btn-xs btn-outline btn-rounded" onClick={handleSeenAllClick}>
                                        <i className="fa-solid fa-check-double"></i>Đã đọc
                                    </a>
                                </div>
                            </div>
                            <div className="row-tabs">
                                <ul className="nav nav-pills v-tabs mb-0" role="tablist">
                                    <li className="nav-item" role="presentation" onClick={() => handleTypeClick(1)}>
                                        <button className={`nav-link ${type === 1 ? 'active' : ''}`}>
                                            Phim {totalNewMovie > 0 ? `(${totalNewMovie})` : ``}
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation" onClick={() => handleTypeClick(2)}>
                                        <button className={`nav-link ${type === 2 ? 'active' : ''}`}>
                                            Cộng đồng {totalNewCommunity > 0 ? `(${totalNewCommunity})` : ``}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="box-body">
                            <div className="noti-wrap">
                                {notifications.length === 0 && <div className="v-notice">
                                    Không có thông báo nào
                                </div>}
                                {notifications.length > 0 && notifications.map(item => {
                                    return (
                                        <NotificationItem item={item} key={`ln-${item._id}`}/>
                                    )
                                })}
                            </div>
                            {notifications.length > 0 && <div className="pt-4 more">
                                <a className="primary-text" onClick={() => handleLoadMore()}>
                                    Tải thêm...
                                    {loading && <Spinner
                                        className="ms-2"
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />}
                                </a>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default UserNotificationPage