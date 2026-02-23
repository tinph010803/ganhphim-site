import {redirect} from "next/navigation";

// Redirect tất cả URL cũ dạng /xem-phim/slug/id sang /xem-phim/slug
export async function generateMetadata({params, searchParams}) {
    const {slug} = await params
    const qs = new URLSearchParams(await searchParams).toString()
    return redirect(`/xem-phim/${slug}${qs ? '?' + qs : ''}`)
}

const MovieDetailOld = async ({params, searchParams}) => {
    const {slug} = await params
    const qs = new URLSearchParams(await searchParams).toString()
    return redirect(`/xem-phim/${slug}${qs ? '?' + qs : ''}`)
}

export default MovieDetailOld