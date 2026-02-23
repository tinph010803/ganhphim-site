import {redirect, notFound} from "next/navigation";
import TmdbApi, {TMDB_IMG} from "@/api/tmdb.api";
import TmdbMovieList from "@/components/cast/TmdbMovieList";

const genderLabel = (g) => g === 2 ? 'Nam' : g === 1 ? 'Nữ' : 'Khác'

export async function generateMetadata({params, searchParams}) {
    const {slug, id} = await params
    if (slug === 'tmdb') {
        const person = await TmdbApi.person(id)
        return person ? {title: `Diễn viên ${person.name}`} : {}
    }
    const qs = new URLSearchParams(await searchParams).toString()
    return redirect(`/dien-vien/${slug}${qs ? '?'+qs : ''}`)
}

const OldPage = async ({params, searchParams}) => {
    const {slug, id} = await params

    // Render TMDB actor detail directly (avoids redirect loop since [slug]/[id] intercepts tmdb/[id])
    if (slug === 'tmdb') {
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
                    <div className="ac-side">
                        <div className="as-info" data-include="as-info">
                            <div className="actor-photo mb-3">
                                <div className="v-actor"><img src={photo} alt={person.name}/></div>
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
                                        <div className="description" style={{whiteSpace: 'pre-line'}}>{person.biography}</div>
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
                    <div className="ac-main">
                        <TmdbMovieList credits={credits}/>
                    </div>
                </div>
            </div>
        )
    }

    const qs = new URLSearchParams(await searchParams).toString()
    redirect(`/dien-vien/${slug}${qs ? '?'+qs : ''}`)
}

export default OldPage