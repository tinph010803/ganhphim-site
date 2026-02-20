"use client"

import UserSidebarMenu from "@/components/user/SidebarMenu";
import {useAppSelector} from "@/hooks/redux";
import {memo, useEffect} from "react";
import {useRouter} from "next/navigation";
import {Nav, Tab} from "react-bootstrap";
import UserFavoriteMovies from "@/components/user/favorite/Movies";
import UserFavoriteCasts from "@/components/user/favorite/Casts";
import {homeUrl} from "@/utils/url";

const UserFavoritePage = () => {
    const router = useRouter()
    const {loggedUser, isLoadingUserInfo} = useAppSelector(state => state.auth)

    useEffect(() => {
        if (loggedUser === null && !isLoadingUserInfo) {
            router.push(homeUrl())
        }
    }, [loggedUser, isLoadingUserInfo]);

    return (
        <div id="wrapper" className="account-wrap">
            {(loggedUser && !isLoadingUserInfo) && <div className="dashboard-container">
                <UserSidebarMenu loggedUser={loggedUser} page="favorite"/>
                <div className="dcc-main">
                    <div className="cg-body-box py-0 is-like">
                        <Tab.Container defaultActiveKey="movies">
                            <div className="box-header flex-column align-items-start gap-3">
                                <div className="heading-sm mb-0">Yêu thích</div>
                                <div className="row-tabs">
                                    <Nav variant="pills" className="v-tabs mb-0">
                                        <Nav.Link eventKey="movies">Phim</Nav.Link>
                                        <Nav.Link eventKey="casts">Diễn viên</Nav.Link>
                                    </Nav>
                                </div>
                            </div>
                            <div className="box-body">
                                <Tab.Content>
                                    <Tab.Pane eventKey="movies">
                                        <UserFavoriteMovies/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="casts">
                                        <UserFavoriteCasts/>
                                    </Tab.Pane>
                                </Tab.Content>
                            </div>
                        </Tab.Container>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default memo(UserFavoritePage)