"use client"

import {Nav, Tab} from "react-bootstrap";
import MovieCastsFull from "@/components/movie/CastsFull";
import MovieSuggestion from "@/components/movie/Suggestion";
import {memo} from "react";
import MovieVersions from "@/components/movie/Versions";
import MovieEpisodes from "@/components/movie/Episodes";
import useVersionUpdater from "@/hooks/useVersionUpdater";
import MovieGallery from "@/components/movie/Gallery";
import MovieOst from "@/components/movie/Ost";
import GtavnServers from "@/components/movie/watch/GtavnServers";

const MovieDetailContent = ({movie}) => {
    useVersionUpdater({movie, page: "detail"})

    return (
        <Tab.Container defaultActiveKey={movie.is_upcoming ? "gallery" : "episodes"}>
            <div className="cg-tabs">
                <Nav variant="tabs" className="v-tabs mb-0">
                    {!movie.is_upcoming && (<Nav.Link eventKey="episodes">Tập phim</Nav.Link>)}
                    <Nav.Link eventKey="gallery">Gallery</Nav.Link>
                    <Nav.Link eventKey="ost">OST</Nav.Link>
                    <Nav.Link eventKey="casts">Diễn viên</Nav.Link>
                    <Nav.Link eventKey="suggestion">Đề xuất</Nav.Link>
                </Nav>
            </div>
            <Tab.Content>
                {!movie.is_upcoming && (<Tab.Pane eventKey="episodes">
                    {movie.gtavn_servers
                        ? <GtavnServers movie={movie} page="detail"/>
                        : (movie.type === 1
                            ? <MovieVersions movie={movie} page={`detail`}/>
                            : <MovieEpisodes movie={movie} page={`detail`}/>)
                    }
                </Tab.Pane>)}
                <Tab.Pane eventKey="gallery">
                    <MovieGallery movieId={movie._id}/>
                </Tab.Pane>
                <Tab.Pane eventKey="ost">
                    <MovieOst movieId={movie._id}/>
                </Tab.Pane>
                <Tab.Pane eventKey="casts">
                    <MovieCastsFull movieId={movie._id} movie={movie}/>
                </Tab.Pane>
                <Tab.Pane eventKey="suggestion">
                    <MovieSuggestion movieId={movie._id} movie={movie}/>
                </Tab.Pane>
            </Tab.Content>
        </Tab.Container>
    )
}

export default memo(MovieDetailContent)