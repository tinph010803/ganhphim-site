import DirectorApi from "@/api/director.api";
import {peopleAvatar} from "@/utils/image";
import CastButtonFavorite from "@/components/director/ButtonFavorite";
import MovieList from "@/components/cast/MovieList";
import {notFound} from "next/navigation";
import ShareButton from "@/components/sharethis/Button";
import ShareModal from "@/components/sharethis/Modal";
import {directorUrl} from "@/utils/url";

export async function generateMetadata({params}) {
    const {id} = await params
    const res = await DirectorApi.detail(id)
    if (res) {
        return {
            title: `Đạo diễn ${res.info.name}`,
            alternates: {
                canonical: directorUrl(res.info)
            }
        }
    } else {
        return notFound()
    }
}

const DirectorPage = async ({params}) => {
    const {id} = await params
    const res = await DirectorApi.detail(id)
    if (res) {
        const {info: director, movies} = res

        return (
            <>
                <div id="wrapper" className="makeup">
                    <div className="actor-container">
                        <div className="ac-side">
                            <div className="as-info" data-include="as-info">
                                <div className="actor-photo mb-3">
                                    <div className="v-actor"><img src={peopleAvatar(director.profile_path)}
                                                                  alt={director.name}/></div>
                                </div>
                                <h2 className="heading-md actor-name mb-3">{director.name}</h2>
                                <div className="button-group line-center w-100 mb-3">
                                    <CastButtonFavorite directorId={director._id}/>
                                    <ShareButton/>
                                </div>
                                <div id="toggle-detail" className="btn btn-block btn-basic primary-text mb-2 d-none">
                                    <span>Thông tin</span>
                                    <i className="fa-solid fa-angle-down me-2"></i>
                                </div>
                                <div className="detail-more">
                                    <div className="detail-line">
                                        <div className="de-title d-block mb-2">Tên gọi khác:</div>
                                        <div className="de-value">{director.also_known_as || "Đang cập nhật"}</div>
                                    </div>
                                    <div className="detail-line">
                                        <div className="de-title d-block mb-2">Giới thiệu:</div>
                                        <div className="description">
                                            {director.biography || "Đang cập nhật"}
                                        </div>
                                    </div>
                                    <div className="detail-line d-flex">
                                        <div className="de-title">Giới tính:</div>
                                        <div className="de-value">{director.gender === 2 ? "Nam" : "Nữ"}</div>
                                    </div>
                                    <div className="detail-line d-flex">
                                        <div className="de-title">Ngày sinh:</div>
                                        <div className="de-value">{director.birthday || "Đang cập nhật"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ac-main">
                            <MovieList movies={movies} heading={`Danh sách phim`}/>
                        </div>
                    </div>
                </div>
                <ShareModal/>
            </>
        )
    }
}

export default DirectorPage