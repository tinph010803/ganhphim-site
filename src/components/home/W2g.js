"use client"

import {memo, useEffect, useState} from "react";
import Link from "next/link";
import W2gApi from "@/api/w2g.api";
import RoomPremiere from "@/components/w2g/room/Premiere";
import RoomNormalHome from "@/components/w2g/room/NormalHome";
import {fetchRemindRoomIds} from "@/redux/features/w2gSlice";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";

const HomeW2g = () => {
    const dispatch = useAppDispatch();
    const remindRoomIds = useAppSelector(s => s.w2g.remindRoomIds)
    const loggedUser = useAppSelector(s => s.auth.loggedUser)
    const [premiereRooms, setPremiereRooms] = useState([])
    const [normalRooms, setNormalRooms] = useState([])

    const getRooms = async () => {
        const {result} = await W2gApi.homeData()
        if (result) {
            setPremiereRooms(result.premiereRooms.slice(0, 3))
            setNormalRooms(result.normalRooms)
        }
    }

    useEffect(() => {
        getRooms()
    }, []);

    useEffect(() => {
        if (remindRoomIds === null && loggedUser) {
            dispatch(fetchRemindRoomIds())
        }
    }, [loggedUser]);

    return (
        <div id="row-live">
            <div className="cards-row wide cards-live">
                <div className="boxed">
                    <div className="row-header">
                        <h3 className="category-name">Công chiếu &amp; Xem chung</h3>
                        <div className="cat-more">
                            <Link href="/xem-chung" className="line-center" title="Xem chung">
                                <span>Xem thêm</span>
                                <i className="fa-solid fa-angle-right"></i>
                            </Link>
                        </div>
                    </div>
                    <div className="row-content">
                        <div className="home-live">
                            <div className="live-grid live-grid-big">
                                {premiereRooms.map(room => (
                                    <RoomPremiere room={room} key={`w2g-${room._id}`}/>
                                ))}
                            </div>
                            <div className="live-grid live-grid-small">
                                {normalRooms.map(room => (
                                    <RoomNormalHome room={room} key={`w2g-${room._id}`}/>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(HomeW2g)