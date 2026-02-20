"use client"

import {memo, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {showMovieTooltipInfo, toggleEnableVideoPreviewSound} from "@/redux/features/appSlice";
import {movieBackdrop, movieTitle} from "@/utils/image";
import MovieTooltipGenres from "@/components/movie/TooltipGenres";
import Link from "next/link";
import {movieDetailUrl, movieWatchUrl} from "@/utils/url";
import InfoIcon from "@/components/icons/Info";
import MovieFavoriteButton from "@/components/movie/favorite/Button";
import MovieInfoTags from "@/components/movie/InfoTags";
import {usePathname} from "next/navigation";

const MovieTooltipInfo = () => {
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const {
    tooltipItem,
    hoverItemRect,
    tooltipOffsetLeft,
    tooltipOffsetTop,
    enableVideoPreviewSound
  } = useAppSelector(state => state.app)
  const [styles, setStyles] = useState({})
  const [showVideoPreview, setShowVideoPreview] = useState(false)

  useEffect(() => {
    if (!tooltipItem) return; // Không làm gì nếu tooltip chưa hiển thị

    const handleScroll = (e) => {
      const element = document.getElementById("hover-tooltip");
      if (element) {
        const rect = element.getBoundingClientRect();
        const mouseX = window.lastMouseX || 0; // Dùng giá trị cuối nếu không có sự kiện
        const mouseY = window.lastMouseY || 0;

        const isMouseOutside =
          mouseX < rect.left ||
          mouseX > rect.right ||
          mouseY < rect.top ||
          mouseY > rect.bottom;

        if (isMouseOutside) {
          handleTooltipMouseLeave();
        }
      }
    };

    const handleMouseMove = (e) => {
      window.lastMouseX = e.clientX;
      window.lastMouseY = e.clientY;
    };

    // Chỉ gắn sự kiện khi tooltip hiển thị
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    // Gỡ sự kiện khi tooltip ẩn hoặc component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [tooltipItem]); // Chỉ chạy khi tooltipItem thay đổi

  useEffect(() => {
    if (tooltipItem && tooltipItem.video_preview) {
      setShowVideoPreview(true)
    } else {
      setShowVideoPreview(false)
    }
  }, [tooltipItem]);

  useEffect(() => {
    if (tooltipItem) {
      updatePosition();
    }
  }, [tooltipItem, hoverItemRect]);

  // Ẩn tooltip khi chuyển trang
  useEffect(() => {
    dispatch(showMovieTooltipInfo({ tooltipItem: null, hoverItemRect: null }));
  }, [pathname, dispatch]);

  const handleTooltipMouseEnter = () => {

  };

  const handleTooltipMouseLeave = () => {
    dispatch(showMovieTooltipInfo({tooltipItem: null, hoverItemRect: null}));
  };

  const updatePosition = () => {
    if (hoverItemRect) {
      const tooltipWidth = 420
      const windowWidth = document.documentElement.clientWidth
      const top = hoverItemRect.top + window.scrollY - 50 + tooltipOffsetTop;
      let left = hoverItemRect.left + window.scrollX - 100 + tooltipOffsetLeft;

      // Ensure the tooltip doesn't go off-screen
      if (left + tooltipWidth > windowWidth) {
        left = window.innerWidth - tooltipWidth - 30;
      }
      if (left < 0) {
        left = 10;
      }

      setStyles({top, left, animation: "qtip-animation .3s forwards", opacity: 1})
    }
  }

  const onVideoPreviewEnded = () => {
    setShowVideoPreview(false)
  }

  if (tooltipItem)
    return (
      <div id="hover-tooltip" className="demo-tip" onMouseEnter={handleTooltipMouseEnter}
           onMouseLeave={handleTooltipMouseLeave}
           style={{
             zIndex: 99,
             position: 'absolute',
             ...styles
           }}>
        <div className="sw-tip">
          <div className="media-teaser"
               style={{backgroundImage: `url(${movieBackdrop(tooltipItem.images.backdrops, '500-0')})`}}>
            {showVideoPreview &&
              <div className={`btn btn-circle btn-outline sound-mute ${!enableVideoPreviewSound ? 'muted' : ''}`}
                   onClick={() => dispatch(toggleEnableVideoPreviewSound())}>
                <i className="fa-solid fa-volume-high"></i>
              </div>}
            <div className="info">
              {(tooltipItem.images.titles?.length > 0) && <div className="media-title-image">
                <img src={movieTitle(tooltipItem.images.titles)} alt={tooltipItem.title}/>
              </div>}
            </div>
            <div className="ratio ratio-16x9">
              {showVideoPreview &&
                <video autoPlay={true} muted={!enableVideoPreviewSound} onEnded={() => onVideoPreviewEnded()}
                       className="fade-in visible">
                  <source src={tooltipItem.video_preview} type="video/mp4"/>
                </video>}
            </div>
          </div>
          <div className="media-item">
            <div className="video-title-group">
              <div className="media-title">{tooltipItem.title}</div>
              <div className="alias-title">{tooltipItem.english_title}</div>
            </div>
            <div className="touch-group">
              <Link href={movieWatchUrl(tooltipItem)} className="btn btn-block btn-primary">
                <i className="fa-solid fa-play"></i>{tooltipItem.status === "Upcoming" ? "Xem Trailer" : "Xem ngay"}
              </Link>
              <MovieFavoriteButton position="tooltip" movieId={tooltipItem._id}/>
              <Link className="btn btn-outline" href={movieDetailUrl(tooltipItem)}>
                <div className="inc-icon icon-14">
                  <InfoIcon/>
                </div>
                <span>Chi tiết</span>
              </Link>
            </div>
            <MovieInfoTags movie={tooltipItem}/>
            <div className="hl-tags">
              <MovieTooltipGenres genres={tooltipItem.genres}/>
            </div>
          </div>
        </div>
      </div>
    )
}

export default memo(MovieTooltipInfo)