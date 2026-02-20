import _ from 'lodash';

const DOMAIN = "https://static.nutscdn.com"
const ADS_IMAGE_DOMAIN = "https://i.finallygotthexds.site"
const AVATAR_DOMAIN = "https://u-static.nutscdn.com"

const genImageUrl = ({path, size}) => {
    const pathSplit = path.split('/')
    return `${DOMAIN}/vimg/${size}/${pathSplit.pop()}`
}

const moviePoster = (posters, size = "300-0", random = true) => {
    if (!posters || posters.length === 0) return null
    const poster = random ? _.sample(posters) : posters[0]
    if (/^https?:\/\//i.test(poster.path)) {
        return poster.path
    }
    if (poster.path.length < 36) {
        return `https://image.tmdb.org/t/p/w500${poster.path}`
    } else {
        const pathSplit = poster.path.split('/')
        return `${DOMAIN}/vimg/${size}/${pathSplit.pop()}`
    }
}

const peopleAvatar = (path) => {
    if (path) {
        if (/^https?:\/\//i.test(path)) {
            return path
        }
        if (path.length < 36) {
            return `https://image.tmdb.org/t/p/w500${path}`
        } else {
            const pathSplit = path.split('/')
            return `${DOMAIN}/${pathSplit.pop()}`
        }
    }

    return `/images/avatar-default.webp`
}

const movieTitle = (titles) => {
    if (titles.length > 0) {
        const title = _.sample(titles)
        const pathSplit = title.path.split('/')
        return `${DOMAIN}/vimg/0-260/${pathSplit.pop()}`
    }

    return `/images/player-default.png`
}

const moviePosterHorizontal = (posters) => {
    if (!posters || posters.length === 0) {
        return `/images/poster-horizontal-default.png`
    }
    const poster = _.sample(posters)
    if (/^https?:\/\//i.test(poster.path)) {
        return poster.path
    }
    const pathSplit = poster.path.split('/')
    return `${DOMAIN}/vimg/400-0/${pathSplit.pop()}`
}

const movieBackdrop = (backdrops, size = '1920-0') => {
    if (backdrops.length > 0) {
        const backdrop = _.sample(backdrops)
        if (/^https?:\/\//i.test(backdrop.path)) {
            return backdrop.path
        }
        if (backdrop.path.length < 36) {
            return `https://image.tmdb.org/t/p/w1280${backdrop.path}`
        } else {
            const pathSplit = backdrop.path.split('/')
            return `${DOMAIN}/vimg/${size}/${pathSplit.pop()}`
        }
    }

    return `/images/backdrop-default.png`
}

const episodeThumbnail = (url) => {
    if (url) return url

    return `/images/e-thumb-default.png`
}

const userAvatar = (user) => {
    if (user) {
        if ((user.is_vip || ["admin", "mod", "commentator"].includes(user.role)) && user.avatar_path) {
            const pathSplit = user.avatar_path.split('/')
            return `${AVATAR_DOMAIN}/vuresource/200-0/${pathSplit.pop()}`
        }
        return `/images${user.avatar.path}`
    }
}

const adsImage = (path) => {
    return `${ADS_IMAGE_DOMAIN}/vpromolink/${path}`
}

export {
    moviePoster,
    movieBackdrop,
    moviePosterHorizontal,
    movieTitle,
    peopleAvatar,
    episodeThumbnail,
    userAvatar,
    genImageUrl,
    adsImage
}