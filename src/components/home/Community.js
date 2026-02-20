"use client"

import {memo, useEffect} from "react";
import LatestComments from "@/components/comment/Latest";
import MostCommentedMoviesRanking from "@/components/community/MostCommentedMoviesRanking";
import MostFavoriteMoviesRanking from "@/components/community/MostFavoriteMoviesRanking";
import MostPopularGenresRanking from "@/components/community/MostPopularGenresRanking";
import TopComments from "@/components/comment/Top";

const HomeCommunity = () => {
    return (
        <div id="community" className="effect-fade-in">
            <div className="cards-row wide">
                <div className="row-content">
                    <div className="comm-wrap">
                        <TopComments/>
                        <div className="irt-table">
                            <MostCommentedMoviesRanking/>
                            <MostFavoriteMoviesRanking/>
                            <MostPopularGenresRanking/>
                            <LatestComments/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(HomeCommunity)