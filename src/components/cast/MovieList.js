"use client"

import MovieItemStyle1 from "@/components/movie/item/Style1";
import { memo, useEffect, useState } from "react";
import { Nav, Tab } from "react-bootstrap";

const MovieList = ({ movies, heading }) => {
  const [moviesGroupByYear, setMoviesGroupByYear] = useState([]);

  useEffect(() => {
    // Nhóm phim theo năm sử dụng một object tạm thời
    const data = {};
    movies.forEach(movie => {
      if (data[movie.year]) {
        data[movie.year].push(movie);
      } else {
        data[movie.year] = [movie];
      }
    });

    // Chuyển object thành mảng với cấu trúc { year, movies } và sắp xếp giảm dần theo năm
    const sortedData = Object.keys(data)
      .map(year => ({ year: Number(year), movies: data[year] }))
      .sort((a, b) => b.year - a.year);

    setMoviesGroupByYear(sortedData);
  }, [movies]);

  return (
    <div className="actor-film">
      <div className="cg-body-box pt-0 is-suggest">
        <Tab.Container defaultActiveKey="all">
          <div className="box-header">
            <div className="heading-sm mb-0">{heading}</div>
            <Nav variant="pills" className="model-tabs actor-tabs">
              <Nav.Link eventKey="all" className="item">Tất cả</Nav.Link>
              <Nav.Link eventKey="byYear" className="item">Thời gian</Nav.Link>
            </Nav>
          </div>
          <div className="box-body">
            <Tab.Content>
              <Tab.Pane eventKey="all">
                <div className="cards-grid-wrapper de-suggest">
                  {movies.map(item => (
                    <MovieItemStyle1 movie={item} key={`all-${item._id}`} />
                  ))}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="byYear">
                {moviesGroupByYear.map(group => (
                  <div className="time-row" key={`year-${group.year}`}>
                    <div className="time-point">
                      <span>{group.year}</span>
                    </div>
                    <div className="time-row-cards">
                      {group.movies.map(item => (
                        <MovieItemStyle1 movie={item} key={`byYear-${item._id}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Tab.Container>
      </div>
    </div>
  );
}

export default memo(MovieList);