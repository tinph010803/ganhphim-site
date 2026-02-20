import W2gButtonCreateGuide from "@/components/w2g/ButtonCreateGuide";
import W2gModalCreateGuide from "@/components/w2g/ModalCreateGuide";
import W2gButtonManage from "@/components/w2g/ButtonManage";
import W2gRooms from "@/components/w2g/Rooms";
import {getMetadata} from "@/utils/metadata";

const pageMetadata = async (data) => {
    return await getMetadata({page: "w2g", data})
}

export async function generateMetadata({params}) {
    const {title, description, metadataBase, openGraph} = await pageMetadata({})

    return {
        title,
        description,
        metadataBase,
        openGraph: {
            ...openGraph
        },
        alternates: {
            canonical: `/xem-chung`
        }
    }
}

const W2gPage = async () => {

    return (
        <>
            <div id="wrapper" className="live-category">
                <div className="live-background">
                    <div className="light-blur"></div>
                    <img src="/images/live-cover2.webp"/>
                </div>
                <div className="fluid-gap">
                    <div className="cards-row wide live-manager">
                        <div className="buttons line-center gap-3">
                            <W2gButtonManage/>
                            <W2gButtonCreateGuide/>
                        </div>
                    </div>
                    <W2gRooms/>
                </div>
            </div>
            <W2gModalCreateGuide/>
        </>
    )
}

export default W2gPage