import CollectionApi from "@/api/collection.api";
import {getMetadata} from "@/utils/metadata";
import {notFound, redirect} from "next/navigation";
import {collectionUrl} from "@/utils/url";
import CollectionDetailContentEvent304 from "@/components/collection/events/DetailContentEvent304";
import CollectionDetailContent from "@/components/collection/DetailContent";
import H1Tags from "@/components/layout/H1Tags";

const pageMetadata = async (data) => {
    return await getMetadata({page: "collection", data})
}

export async function generateMetadata({params}) {
    const {id, slug} = await params
    const {result} = await CollectionApi.info(id)

    if (result) {
        if (slug !== result.slug) {
            return redirect(collectionUrl(result))
        }

        const {title, description, metadataBase, openGraph} = await pageMetadata({collection_name: result.name})
        return {
            title,
            description,
            metadataBase,
            openGraph: {
                ...openGraph
            },
            alternates: {
                canonical: collectionUrl(result)
            },
            robots: {
                index: false,
                follow: true
            }
        }
    } else {
        return notFound()
    }
}

const CollectionDetailPage = async ({params}) => {
    const {id} = await params
    const {result: collection} = await CollectionApi.info(id)
    if (collection) {
        const {h1} = await pageMetadata({collection_name: collection.name})

        return (
            <>
                <H1Tags text={h1}/>
                {collection.style === 7 && <CollectionDetailContentEvent304 collection={collection}/>}
                {collection.style !== 7 && <CollectionDetailContent collection={collection}/>}
            </>
        )
    }
}

export default CollectionDetailPage