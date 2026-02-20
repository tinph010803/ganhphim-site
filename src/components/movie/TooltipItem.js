import {useRef, useEffect, memo} from 'react';
import {showMovieTooltipInfo} from "@/redux/features/appSlice";
import {useAppDispatch} from "@/hooks/redux";

const MovieTooltipItem = ({children, movie, offsetLeft = 0, offsetTop = 0}) => {
  const dispatch = useAppDispatch()

  const timeoutId = useRef(null);

  const handleMouseEnter = (e) => {
    // Clear any existing timeout
    clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(() => {
      const rect = JSON.parse(JSON.stringify(e.target.getBoundingClientRect()));
      dispatch(showMovieTooltipInfo({
        tooltipItem: movie,
        hoverItemRect: rect,
        tooltipOffsetLeft: offsetLeft,
        tooltipOffsetTop: offsetTop
      }));
    }, 600)
  };

  const handleMouseLeave = (e) => {
    clearTimeout(timeoutId.current)
  };

  useEffect(() => {
    // Cleanup timeout on component unmount
    return () => {
      clearTimeout(timeoutId.current);
    };
  }, []);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );
};

export default memo(MovieTooltipItem)