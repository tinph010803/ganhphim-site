import W2gApi from "@/api/w2g.api"
import {notFound} from "next/navigation";
import W2gPageRoomDetail from "@/components/w2g/page/RoomDetail";
import {getMetadata} from "@/utils/metadata";
import {movieBackdrop} from "@/utils/image";

export async function generateMetadata({params}) {
    const {id} = await params
    const {result: room} = await W2gApi.info(id)

    if (!room) return notFound()

    const data = {
        movie: room.movie,
        user: room.user
    }
    const {
        title,
        description,
        metadataBase,
        openGraph
    } = await getMetadata({
        page: room.is_premiere ? "w2gRoomPremiereDetail" : "w2gRoomNormalDetail",
        data
    })

    return {
        title,
        description,
        metadataBase,
        openGraph: {
            ...openGraph,
            url: `/xem-chung/${id}`,
            images: [
                {url: movieBackdrop(room.movie.images.backdrops)}
            ]
        },
        alternates: {
            canonical: `/xem-chung/${id}`
        },
        robots: {
            index: false,
            follow: true
        }
    }
}

const W2gPage = async ({params}) => {
    const {id} = await params
    const {result: room} = await W2gApi.info(id)
    if (!room) return notFound()

    return (
        <W2gPageRoomDetail room={room}/>
    )
}

export default W2gPage