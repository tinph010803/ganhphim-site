import {genSlug} from "@/utils/helpers";

const ROBONG_DOMAIN = "https://robong.tv"

const movieDetailUrl = (movie) => {
    return `/phim/${movie.slug}`
}

const movieWatchUrl = (movie) => {
    return `/xem-phim/${movie.slug}`
}

const genreUrl = (genre) => {
    return `/the-loai/${genre.slug}`
}

const countryUrl = (country) => {
    return `/quoc-gia/${country.slug}`
}

const productionCompanyUrl = (production) => {
    return `/nha-san-xuat/${production.slug}`
}

const directorUrl = (director) => {
    return `/dao-dien/${director.slug}`
}

const castUrl = (cast) => {
    return `/dien-vien/${cast.slug}`
}

const networkUrl = (network) => {
    return `/network/${network.slug}`
}

const userFavoriteUrl = () => {
    return `/user/favorite`
}

const userPlaylistUrl = () => {
    return `/user/playlist`
}
const userNotificationUrl = () => {
    return `/user/thong-bao`
}
const userProfileUrl = () => {
    return `/user/thong-tin`
}
const userContinueWatchingUrl = () => {
    return `/user/xem-tiep`
}
const homeUrl = () => {
    return `/phimhay`
}
const collectionUrl = (collection) => {
    return `/c/${collection.slug}`
}

const w2gRoomUrl = (room) => {
    return `/xem-chung/${room._id}`
}

const robongHomeUrl = () => {
    return `${process.env.RB_BASE_URL}/truc-tiep`
}

const robongMatchUrl = ({match, room}) => {
    const sportSlug = {
        football: "bong-da",
        basketball: "bong-ro",
        volleyball: "bong-chuyen",
        tennis: "tennis",
    }

    if (room)
        return `${ROBONG_DOMAIN}/${sportSlug[match.sport_type]}/${genSlug(match.home_team.name)}-vs-${genSlug(match.away_team.name)}.${room._id}`

    return "#"
}

const idpLoginUrl = `${process.env.IDP_URL}/dang-nhap`
const idpProfileUrl = `${process.env.IDP_URL}/tai-khoan/thong-tin`
const idpDepositUrl = `${process.env.IDP_URL}/tai-khoan/nap-rocoin`
const idpUpgradeUrl = `${process.env.IDP_URL}/tai-khoan/nang-cap-rox`

export {
    movieDetailUrl,
    movieWatchUrl,
    genreUrl,
    productionCompanyUrl,
    directorUrl,
    castUrl,
    networkUrl,
    userProfileUrl,
    userNotificationUrl,
    userPlaylistUrl,
    userFavoriteUrl,
    homeUrl,
    collectionUrl,
    countryUrl,
    userContinueWatchingUrl,
    w2gRoomUrl,
    robongHomeUrl,
    robongMatchUrl,
    idpProfileUrl,
    idpUpgradeUrl,
    idpLoginUrl,
    idpDepositUrl
}