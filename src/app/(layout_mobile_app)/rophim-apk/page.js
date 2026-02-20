import {getMetadata} from "@/utils/metadata";
import MobileAppDownloadContent from "@/components/app_download/MobileContent";
import H1Tags from "@/components/layout/H1Tags";

export async function generateMetadata() {
    const {title, description, metadataBase, openGraph} = await getMetadata({page:"rophimApk"})
    return {
        title,
        description,
        metadataBase,
        openGraph: {
            ...openGraph
        },
        alternates: {
            canonical: `/rophim-apk`
        }
    }
}

export default async function MobileAppPage() {
    const {h1} = await getMetadata({})

    return (
        <div id="fullwide">
            <H1Tags text={h1}/>
            <MobileAppDownloadContent/>
        </div>
    )
}
