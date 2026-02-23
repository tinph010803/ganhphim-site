import CastApi from "@/api/cast.api";
import {peopleAvatar} from "@/utils/image";
import CastButtonFavorite from "@/components/cast/ButtonFavorite";
import MovieList from "@/components/cast/MovieList";
import {notFound, redirect} from "next/navigation";
import ShareButton from "@/components/sharethis/Button";
import ShareModal from "@/components/sharethis/Modal";
import {castUrl} from "@/utils/url";
import {isUsingOphimApi, isUsingGtavnApi} from "@/utils/axios";
import TmdbApi, {TMDB_IMG} from "@/api/tmdb.api";
import TmdbMovieList from "@/components/cast/TmdbMovieList";

const slugToName = (slug) => slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

export async function generateMetadata({params}) {
    const {slug} = await params
    if (isUsingOphimApi() || isUsingGtavnApi()) {
        const query = slug.replace(/-/g, ' ')
        const {items} = await TmdbApi.searchPersons(query, 1)
        if (items.length > 0) return redirect(`/dien-vien/tmdb/${items[0].tmdb_id}`)
        return {title: `Diễn viên ${slugToName(slug)}`}
    }
    const res = await CastApi.detail(slug)
    if (res) {
        return {
            title: `Diễn viên ${res.info.name}`,
            alternates: {canonical: castUrl(res.info)}
        }
    } else {
        return notFound()
    }
}

const CastPage = async ({params}) => {
    const {slug} = await params

    if (isUsingOphimApi() || isUsingGtavnApi()) {
        const query = slug.replace(/-/g, ' ')
        const {items} = await TmdbApi.searchPersons(query, 1)
        if (items.length > 0) redirect(`/dien-vien/tmdb/${items[0].tmdb_id}`)

        // Not on TMDB — show basic page with name from slug
        const name = slugToName(slug)
        return (
            <div id="wrapper" className="makeup">
                <div className="actor-container">
                    <div className="ac-side">
                        <div className="as-info" data-include="as-info">
                            <div className="actor-photo mb-3">
                                <div className="v-actor">
                                    <img src={peopleAvatar(null)} alt={name}/>
                                </div>
                            </div>
                            <h2 className="heading-md actor-name mb-3">{name}</h2>
                            <div className="detail-more">
                                <div className="detail-line">
                                    <div className="de-title d-block mb-2">Giới thiệu:</div>
                                    <div className="de-value">Đang cập nhật</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ac-main">
                        <TmdbMovieList credits={[]}/>
                    </div>
                </div>
            </div>
        )
    }

    const res = await CastApi.detail(slug)
    if (res) {
        const {info: cast, movies} = res
        return (
            <>
                <div id="wrapper" className="makeup">
                    <div className="actor-container">
                        <div className="ac-side">
                            <div className="as-info" data-include="as-info">
                                <div className="actor-photo mb-3">
                                    <div className="v-actor"><img src={peopleAvatar(cast.profile_path)} alt={cast.name}/></div>
                                </div>
                                <h2 className="heading-md actor-name mb-3">{cast.name}</h2>
                                <div className="button-group line-center w-100 mb-3">
                                    <CastButtonFavorite castId={cast._id}/>
                                    <ShareButton/>
                                </div>
                                <div id="toggle-detail" className="btn btn-block btn-basic primary-text mb-2 d-none">
                                    <span>Thông tin</span>
                                    <i className="fa-solid fa-angle-down me-2"></i>
                                </div>
                                <div className="detail-more">
                                    <div className="detail-line">
                                        <div className="de-title d-block mb-2">Tên gọi khác:</div>
                                        <div className="de-value">{cast.also_known_as || "Đang cập nhật"}</div>
                                    </div>
                                    <div className="detail-line">
                                        <div className="de-title d-block mb-2">Giới thiệu:</div>
                                        <div className="description">{cast.biography || "Đang cập nhật"}</div>
                                    </div>
                                    <div className="detail-line d-flex">
                                        <div className="de-title">Giới tính:</div>
                                        <div className="de-value">{cast.gender === 2 ? "Nam" : "Nữ"}</div>
                                    </div>
                                    <div className="detail-line d-flex">
                                        <div className="de-title">Ngày sinh:</div>
                                        <div className="de-value">{cast.birthday || "Đang cập nhật"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ac-main">
                            <MovieList movies={movies} heading={`Các phim đã tham gia`}/>
                        </div>
                    </div>
                </div>
                <ShareModal/>
            </>
        )
    }
}

export default CastPage
