import {redirect} from "next/navigation";

export async function generateMetadata({params, searchParams}) {
    const {slug} = await params
    const qs = new URLSearchParams(await searchParams).toString()
    return redirect(`/dao-dien/${slug}${qs ? '?'+qs : ''}`)
}

const OldPage = async ({params, searchParams}) => {
    const {slug} = await params
    const qs = new URLSearchParams(await searchParams).toString()
    redirect(`/dao-dien/${slug}${qs ? '?'+qs : ''}`)
}

export default OldPage