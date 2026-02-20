"use client"

import {memo, useEffect, useRef, useState} from "react";
import RoomPremiere from "@/components/w2g/room/Premiere";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {fetchLatestPremiereRooms, fetchRemindRoomIds} from "@/redux/features/w2gSlice";
import W2gListNormalRooms from "@/components/w2g/ListNormalRooms";
import BannerCenter from "@/components/ads/BannerCenter";
import {socketActions} from "@/redux/middlewares/socketMiddleware";

const W2gRooms = () => {
    const dispatch = useAppDispatch();
    const remindRoomIds = useAppSelector(s => s.w2g.remindRoomIds)
    const premiereRooms = useAppSelector(s => s.w2g.premiereRooms)
    const loggedUser = useAppSelector(s => s.auth.loggedUser)

    useEffect(() => {
        dispatch(fetchLatestPremiereRooms())
    }, []);

    useEffect(() => {
        if (remindRoomIds === null && loggedUser) {
            dispatch(fetchRemindRoomIds())
        }
    }, [loggedUser]);

    useEffect(() => {
        dispatch({type: socketActions.init});
    }, [dispatch])

    return (
        <>
            {premiereRooms.length > 0 && <div className="cards-row wide">
                <div className="row-header">
                    <h3 className="category-name me-3">Công Chiếu</h3>
                </div>
                <div className="row-content">
                    <div className="w2g-live">
                        <div className="live-grid live-grid-big">
                            {premiereRooms.map(room => {
                                return (
                                    <RoomPremiere room={room} key={room._id}/>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>}
            <BannerCenter page="w2g" position="center_1"/>
            <W2gListNormalRooms/>
            <BannerCenter page="w2g" position="center_2"/>
        </>
    )
}

export default memo(W2gRooms)