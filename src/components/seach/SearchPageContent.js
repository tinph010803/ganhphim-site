"use client"

import MovieFilter from "@/components/movie/Filter";
import {Nav, Tab} from "react-bootstrap";
import CastList from "@/components/cast/List";
import {useAppSelector} from "@/hooks/redux";
import {memo, useEffect, useState} from "react";

const SearchPageContent = ({keyword}) => {
  const {filterMovies, filterIsLoading} = useAppSelector(state => state.movie)
  const [tabActiveKey, setTabActiveKey] = useState("movies")
  useEffect(() => {
    if (filterMovies.length === 0 && !filterIsLoading) {
      setTabActiveKey("casts")
    }
  }, [filterMovies, filterIsLoading]);

  return (
    <div className="cards-row wide">
      <div className="row-header">
        <div className="inc-icon text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M4.1665 31.9141C4.1665 31.2237 4.72615 30.6641 5.4165 30.6641H17.2792C17.9695 30.6641 18.5292 31.2237 18.5292 31.9141C18.5292 32.6046 17.9695 33.1641 17.2792 33.1641H5.4165C4.72615 33.1641 4.1665 32.6046 4.1665 31.9141Z"
                  fill="currentColor"></path>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M4.1665 23.9712C4.1665 23.2809 4.72615 22.7212 5.4165 22.7212H12.8036C13.494 22.7212 14.0536 23.2809 14.0536 23.9712C14.0536 24.6615 13.494 25.2212 12.8036 25.2212H5.4165C4.72615 25.2212 4.1665 24.6615 4.1665 23.9712Z"
                  fill="currentColor"></path>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M4.1665 8.08594C4.1665 7.39559 4.72615 6.83594 5.4165 6.83594H35.4152C36.1055 6.83594 36.6652 7.39559 36.6652 8.08594C36.6652 8.7763 36.1055 9.33594 35.4152 9.33594H5.4165C4.72615 9.33594 4.1665 8.7763 4.1665 8.08594Z"
                  fill="currentColor"></path>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M4.1665 16.0288C4.1665 15.3384 4.72615 14.7788 5.4165 14.7788H17.1017C17.792 14.7788 18.3517 15.3384 18.3517 16.0288C18.3517 16.7192 17.792 17.2788 17.1017 17.2788H5.4165C4.72615 17.2788 4.1665 16.7192 4.1665 16.0288Z"
                  fill="currentColor"></path>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M27.5671 18.6035C24.7311 18.6035 22.4316 20.903 22.4316 23.739C22.4316 26.5748 24.7311 28.8743 27.5671 28.8743C30.403 28.8743 32.7025 26.5748 32.7025 23.739C32.7025 20.903 30.403 18.6035 27.5671 18.6035ZM19.9316 23.739C19.9316 19.5223 23.3505 16.1035 27.5671 16.1035C31.7836 16.1035 35.2025 19.5223 35.2025 23.739C35.2025 25.4808 34.6191 27.0867 33.637 28.3715L36.2981 31.0268C36.7868 31.5145 36.7876 32.306 36.3 32.7947C35.8123 33.2833 35.0208 33.2842 34.5321 32.7965L31.8146 30.0847C30.6001 30.8992 29.1391 31.3743 27.5671 31.3743C23.3505 31.3743 19.9316 27.9557 19.9316 23.739Z"
                  fill="currentColor"></path>
          </svg>
        </div>
        <h3 className="category-name">Kết quả tìm kiếm "{keyword}"</h3>
      </div>
      <Tab.Container activeKey={tabActiveKey} onSelect={(tab) => setTabActiveKey(tab)}>
        <div className="row-tabs">
          <Nav variant="pills" className="v-tabs">
            <Nav.Link eventKey="movies">Phim</Nav.Link>
            <Nav.Link eventKey="casts">Diễn viên</Nav.Link>
          </Nav>
        </div>
        <Tab.Content>
          <Tab.Pane eventKey="movies">
            <MovieFilter initFilter={{q: keyword}}/>
          </Tab.Pane>
          <Tab.Pane eventKey="casts">
            <CastList initFilter={{keyword}}/>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  )
}

export default memo(SearchPageContent)