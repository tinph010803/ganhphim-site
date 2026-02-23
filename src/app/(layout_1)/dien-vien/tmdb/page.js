import {notFound} from "next/navigation";

export async function generateMetadata() {
    return {title: 'Diễn viên'}
}

const TmdbCastIndexPage = () => {
    return notFound()
}

export default TmdbCastIndexPage
