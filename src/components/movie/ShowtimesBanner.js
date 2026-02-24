import MovieApi from "@/api/movie.api";

const MovieShowtimesBanner = async ({slug}) => {
    const showtimes = await MovieApi.showtimesBySlug(slug)

    // Today's date in YYYY-MM-DD for comparison
    const today = new Date().toISOString().slice(0, 10)

    // Filter only future/today episodes and sort ascending
    const upcoming = showtimes
        .filter(st => st.show_date >= today)
        .sort((a, b) => new Date(a.show_date) - new Date(b.show_date))

    if (upcoming.length === 0) return null

    const next = upcoming[0]
    const [year, month, day] = next.show_date.split('-')
    const dateFormatted = `${day}-${month}-${year}`

    return (
        <div className="movie-showtimes-banner">
            <span className="msb-icon">
                <img src="https://rophimm.net/images/alarm.gif" alt="alarm" width={36} height={36} loading="lazy"/>
            </span>
            <span>
                <strong>{next.episode}</strong> sẽ phát sóng ngày <strong>{dateFormatted}</strong>. Các bạn nhớ đón xem nhé 😘
            </span>
        </div>
    )
}

export default MovieShowtimesBanner
