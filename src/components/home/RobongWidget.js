"use client"

import {memo} from "react";

const RobongWidget = () => {
    return (
        <div className="cards-row wide">
            <div className="row-header d-none">
                <h3 className="category-name">Trận cầu hấp dẫn trên Rổ Bóng</h3>
            </div>
            <div className="row-content">
                <div className="rrb-wrap">
                    <div className="leagues-slide">
                        <div className="swiper league-swiper">
                            <div className="swiper-wrapper">
                                <div className="swiper-slide">
                                    <div className="l-icon"><img src="images/robong/leagues/championleague.png"/></div>
                                </div>
                                <div className="swiper-slide">
                                    <div className="l-icon"><img src="images/robong/leagues/europaleague.png"/></div>
                                </div>
                                <div className="swiper-slide">
                                    <div className="l-icon"><img src="images/robong/leagues/premierleague.png"/></div>
                                </div>
                                <div className="swiper-slide">
                                    <div className="l-icon"><img src="images/robong/leagues/bundesliga.png"/></div>
                                </div>
                                <div className="swiper-slide">
                                    <div className="l-icon"><img src="images/robong/leagues/laliga.png"/></div>
                                </div>
                                <div className="swiper-slide">
                                    <div className="l-icon"><img src="images/robong/leagues/league1.png"/></div>
                                </div>
                                <div className="swiper-slide">
                                    <div className="l-icon"><img src="images/robong/leagues/seriea.png"/></div>
                                </div>
                                <div className="swiper-slide">
                                    <div className="l-icon"><img src="images/robong/leagues/saudiproleague.png"/></div>
                                </div>
                                <div className="swiper-slide">
                                    <div className="l-icon"><img src="images/robong/leagues/vleague.png"/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rb-pic">
                        <img src="/images/robong/intro.webp"/>
                    </div>
                    <div className="rb-intro">
                        <div className="rb-logo">
                            <a href="#"><img src="/images/robong/logo.webp"/></a>
                        </div>
                        <div className="heading-md rb-title mb-2">
                            Đừng bỏ lỡ các trận đấu trên Rổ Bóng
                        </div>
                        <div className="rb-label">
                            <a href="#" className="line-center">
                                <span>https://robong.tv</span>
                                <i className="fa-solid fa-angle-right"></i>
                            </a>
                        </div>
                    </div>
                    <div className="match-info m-0 flex-grow-1 px-0 py-3">
                        <div className="match-list">
                            <a href="#" className="item live">
                                <div className="live-badge">
                                    <div className="text">LIVE</div>
                                    <div className="prog"><span>15'</span></div>
                                </div>
                                <div className="team-vs w-100">
                                    <div className="card-team team-home">
                                        <div className="inc-icon">
                                            <img src="images/team/che.png"/>
                                        </div>
                                        <span className="lim">Chelsea</span>
                                    </div>
                                    <div className="current">
                                        <div className="score update">
                                            <span>1</span>
                                            <span>0</span>
                                        </div>
                                    </div>
                                    <div className="card-team team-away">
                                        <div className="inc-icon">
                                            <img src="images/team/cry.png"/>
                                        </div>
                                        <span className="lim">Crystal Palace</span>
                                    </div>
                                </div>
                            </a>
                            <a href="#" className="item">
                                <div className="time-match">
                                    <strong>22:30</strong>
                                </div>
                                <div className="team-vs w-100">
                                    <div className="card-team team-home">
                                        <div className="inc-icon">
                                            <img src="images/team/mu.png"/>
                                        </div>
                                        <span className="lim">Manchester United</span>
                                    </div>
                                    <div className="current">
                                        <div className="score">
                                            <span>VS</span>
                                        </div>
                                    </div>
                                    <div className="card-team team-away">
                                        <div className="inc-icon">
                                            <img src="images/team/not.png"/>
                                        </div>
                                        <span className="lim">Nottingham Forest</span>
                                    </div>
                                </div>
                            </a>
                            <a href="#" className="item">
                                <div className="time-match">
                                    <strong>22:30</strong>
                                </div>
                                <div className="team-vs w-100">
                                    <div className="card-team team-home">
                                        <div className="inc-icon">
                                            <img src="images/team/wes.png"/>
                                        </div>
                                        <span className="lim">West Ham</span>
                                    </div>
                                    <div className="current">
                                        <div className="score">
                                            <span>VS</span>
                                        </div>
                                    </div>
                                    <div className="card-team team-away">
                                        <div className="inc-icon">
                                            <img src="images/team/wol.png"/>
                                        </div>
                                        <span className="lim">Wolverhampton</span>
                                    </div>
                                </div>
                            </a>
                            <a href="#" className="item">
                                <div className="time-match">
                                    <strong>22:30</strong>
                                </div>
                                <div className="team-vs w-100">
                                    <div className="card-team team-home">
                                        <div className="inc-icon">
                                            <img src="images/team/ast.png"/>
                                        </div>
                                        <span className="lim">Aston Villa</span>
                                    </div>
                                    <div className="current">
                                        <div className="score">
                                            <span>VS</span>
                                        </div>
                                    </div>
                                    <div className="card-team team-away">
                                        <div className="inc-icon">
                                            <img src="images/team/mc.png"/>
                                        </div>
                                        <span className="lim">Manchester City</span>
                                    </div>
                                </div>
                            </a>
                            <a href="#" className="item live">
                                <div className="live-badge">
                                    <div className="text">LIVE</div>
                                    <div className="prog"><span>15'</span></div>
                                </div>
                                <div className="team-vs w-100">
                                    <div className="card-team team-home">
                                        <div className="inc-icon">
                                            <img src="images/team/new.png"/>
                                        </div>
                                        <span className="lim">Newcastle United</span>
                                    </div>
                                    <div className="current">
                                        <div className="score update">
                                            <span>1</span>
                                            <span>0</span>
                                        </div>
                                    </div>
                                    <div className="card-team team-away">
                                        <div className="inc-icon">
                                            <img src="images/team/bri.png"/>
                                        </div>
                                        <span className="lim">Brighton</span>
                                    </div>
                                </div>
                            </a>
                            <a href="#" className="item">
                                <div className="time-match">
                                    <strong>22:30</strong>
                                </div>
                                <div className="team-vs w-100">
                                    <div className="card-team team-home">
                                        <div className="inc-icon">
                                            <img src="images/team/bre.png"/>
                                        </div>
                                        <span className="lim">Brentford</span>
                                    </div>
                                    <div className="current">
                                        <div className="score">
                                            <span>VS</span>
                                        </div>
                                    </div>
                                    <div className="card-team team-away">
                                        <div className="inc-icon">
                                            <img src="images/team/ars.png"/>
                                        </div>
                                        <span className="lim">Arsenal</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="rb-more">
                        <a href="#">
                            <div className="btn btn-circle btn-light"><i className="fa-solid fa-arrow-right"></i></div>
                            <span className="text-light">Xem lịch phát sóng</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(RobongWidget)