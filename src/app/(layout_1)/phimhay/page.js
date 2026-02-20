import TopSlide from "@/components/home/TopSlide";
import DataBlockList from "@/components/home/DataBlockList";
import {getMetadata} from "@/utils/metadata";
import H1Tags from "@/components/layout/H1Tags";

export async function generateMetadata() {
    const {title, description, metadataBase, openGraph} = await getMetadata({page: "home"})
    return {
        title,
        description,
        metadataBase,
        openGraph: {
            ...openGraph
        },
        alternates: {
            canonical: "/phimhay"
        }
    }
}

export default async function HomePage() {
    const {h1} = await getMetadata({page: "home"})

    return (
        <>
            <H1Tags text={h1}/>
            <TopSlide/>
            <div id="wrapper" className="wrapper-w-slide">
                <div className="fluid-gap">
                    <DataBlockList/>
                </div>
            </div>
        </>
    )
}
