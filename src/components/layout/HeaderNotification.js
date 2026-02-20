"use client"

import {forwardRef, memo, useEffect, useMemo, useState} from "react";
import {Dropdown, Nav, Tab} from "react-bootstrap";
import NotificationApi from "@/api/notification.api";
import {userNotificationUrl} from "@/utils/url";
import NotificationItem from "@/components/notification/Item";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {
  fetchLatestNotifications, seenAll, setLatestCommunityNotifications, setLatestMovieNotifications,
  setShowDropdownNotification
} from "@/redux/features/userSlice";
import {usePathname} from "next/navigation";
import useOnceWhen from "@/hooks/useOnceWhen";
import CustomLink from "@/components/shared/CustomLink";

const CustomToggle = forwardRef(({children, onClick}, ref) => {
  return (
    <a className="btn btn-circle btn-outline btn-bell" ref={ref} onClick={onClick}>
      {children}
    </a>
  )
})

const HeaderNotification = () => {
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const {
    showDropdownNotification,
    latestMovieNotifications,
    latestCommunityNotifications,
    totalNewMovie,
    totalNewCommunity,
    totalNew,
  } = useAppSelector(state => state.user)
  const {loggedUser} = useAppSelector(state => state.auth)

  const handleSeenAllClick = async () => {
    try {
      await NotificationApi.seenAll()
      dispatch(setLatestMovieNotifications(latestMovieNotifications.map(item => {
        return {...item, status: 1}
      })))
      dispatch(setLatestCommunityNotifications(latestCommunityNotifications.map(item => {
        return {...item, status: 1}
      })))
      dispatch(seenAll())
    } catch (err) {
    }
  }

  useOnceWhen(loggedUser && pathname, () => {
    dispatch(fetchLatestNotifications())
  })

  return (
    <Dropdown className="head-noti" drop="down" align="end" show={showDropdownNotification}
              onToggle={(isOpen) => dispatch(setShowDropdownNotification(isOpen))}>
      <Dropdown.Toggle as={CustomToggle}>
        {totalNew > 0 && <span className="noti-number">{totalNew}</span>}
        <i className="fa-solid fa-bell"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu as="ul" className="dropdown-menu v-dropdown-menu noti-dropdown bg-dark">
        <Tab.Container defaultActiveKey="movie">
          <div className="dropdown-blank dropdown-top">
            <Nav variant="pills" className="nav nav-pills v-tabs v-tabs-xs mb-0 flex-grow-1">
              <Nav.Link eventKey="movie">
                Phim {totalNewMovie > 0 ? `(${totalNewMovie})` : ``}
                {totalNewMovie > 0 && <span className="new-dot"></span>}
              </Nav.Link>
              <Nav.Link eventKey="community">
                Cộng đồng {totalNewCommunity > 0 ? `(${totalNewCommunity})` : ``}
                {totalNewCommunity > 0 && <span className="new-dot"></span>}
              </Nav.Link>
            </Nav>
            <div className="mark-all">
              <a className="btn btn-xs btn-basic" onClick={() => handleSeenAllClick()}>
                <i className="fa-solid fa-check-double"></i> Đã đọc
              </a>
            </div>
          </div>
          <div className="box-body">
            <Tab.Content>
              <Tab.Pane eventKey="movie">
                <div className="noti-wrap">
                  {latestMovieNotifications.length === 0 && <div className="v-notice">
                    Không có thông báo nào
                  </div>}
                  {latestMovieNotifications.length > 0 && latestMovieNotifications.map(item => {
                    return (
                      <NotificationItem item={item} key={`n-${item._id}`}/>
                    )
                  })}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="community">
                <div className="noti-wrap">
                  {latestCommunityNotifications.length === 0 && <div className="v-notice">
                    Không có thông báo nào
                  </div>}
                  {latestCommunityNotifications.length > 0 && latestCommunityNotifications.map(item => {
                    return (
                      <NotificationItem item={item} key={`n-${item._id}`}/>
                    )
                  })}
                </div>
              </Tab.Pane>
            </Tab.Content>
            <div className="dropdown-blank dropdown-bottom">
              <CustomLink href={userNotificationUrl()} className="btn btn-sm btn-block btn-basic">Xem toàn bộ</CustomLink>
            </div>
          </div>
        </Tab.Container>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default memo(HeaderNotification)