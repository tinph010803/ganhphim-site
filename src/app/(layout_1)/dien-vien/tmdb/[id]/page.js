import TmdbApi, {TMDB_IMG} from "@/api/tmdb.api";
import {notFound} from "next/navigation";
import Link from "next/link";

export async function generateMetadata({params}) {
    const {id} = await params
    const person = await TmdbApi.person(id)
    if (person) {
        return {title: `Diễn viên ${person.name}`}
    }
    return {}
}

const genderLabel = (g) => g === 2 ? 'Nam' : g === 1 ? 'Nữ' : 'Khác'

const TmdbCastPage = async ({params}) => {
    const {id} = await params
    const [person, credits] = await Promise.all([
        TmdbApi.person(id),
        TmdbApi.personCredits(id),
    ])

    if (!person) return notFound()

    const photo = person.profile_path
        ? `${TMDB_IMG}/w342${person.profile_path}`
        : '/images/avatars/default.jpg'

    return (
        <div id="wrapper" className="makeup">
            <div className="actor-container">
                {/* ── Sidebar ── */}
                <div className="ac-side">
                    <div className="as-info" data-include="as-info">
                        <div className="actor-photo mb-3">
                            <div className="v-actor">
                                <img src={photo} alt={person.name}/>
                            </div>
                        </div>
                        <h2 className="heading-md actor-name mb-3">{person.name}</h2>

                        <div className="detail-more">
                            {person.also_known_as?.length > 0 && (
                                <div className="detail-line">
                                    <div className="de-title d-block mb-2">Tên gọi khác:</div>
                                    <div className="de-value">{person.also_known_as.slice(0, 3).join(' / ')}</div>
                                </div>
                            )}

                            {person.biography && (
                                <div className="detail-line">
                                    <div className="de-title d-block mb-2">Giới thiệu:</div>
                                    <div className="description" style={{whiteSpace: 'pre-line'}}>
                                        {person.biography}
                                    </div>
                                </div>
                            )}

                            <div className="detail-line d-flex">
                                <div className="de-title">Giới tính:</div>
                                <div className="de-value">{genderLabel(person.gender)}</div>
                            </div>

                            {person.birthday && (
                                <div className="detail-line d-flex">
                                    <div className="de-title">Ngày sinh:</div>
                                    <div className="de-value">{person.birthday}</div>
                                </div>
                            )}

                            {person.place_of_birth && (
                                <div className="detail-line d-flex">
                                    <div className="de-title">Nơi sinh:</div>
                                    <div className="de-value">{person.place_of_birth}</div>
                                </div>
                            )}

                            {person.known_for_department && (
                                <div className="detail-line d-flex">
                                    <div className="de-title">Vai trò:</div>
                                    <div className="de-value">{person.known_for_department}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Main: filmography grid ── */}
                <div className="ac-main">
                    <div className="actor-film">
                        <div className="cg-body-box pt-0 is-suggest">
                            <div className="box-header">
                                <div className="heading-sm mb-0">Các phim đã tham gia</div>
                            </div>
                            <div className="box-body">
                                <div className="cards-grid-wrapper de-suggest">
                                    {credits.map(item => {
                                        const poster = item.poster_path
                                            ? `${TMDB_IMG}/w300${item.poster_path}`
                                            : '/images/thumbs/default.jpg'
                                        const title = item.title || item.name || 'Không rõ'
                                        const year = (item.release_date || item.first_air_date || '').slice(0, 4)
                                        const searchUrl = `/tim-kiem?q=${encodeURIComponent(title)}`
                                        return (
                                            <div className="movie-item" key={`tmdb-credit-${item.id}-${item.media_type}`}>
                                                <Link href={searchUrl} className="mi-thumb">
                                                    <img src={poster} alt={title} loading="lazy"/>
                                                </Link>
                                                <div className="mi-info">
                                                    <h3 className="mi-title lim-2">
                                                        <Link href={searchUrl}>{title}</Link>
                                                    </h3>
                                                    {year && <div className="mi-year">{year}</div>}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TmdbCastPage
