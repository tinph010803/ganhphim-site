import {getMetadata} from "@/utils/metadata";
import UserUpgradeRoxPageContent from "@/components/user/upgrade_rox/PageContent";

const pageMetadata = async () => {
    return await getMetadata({page: "upgrade_rox"})
}

export async function generateMetadata({params}) {
    const {title, description, metadataBase, openGraph} = await pageMetadata()
    return {
        title,
        description,
        metadataBase,
        openGraph: {
            ...openGraph
        },
        alternates: {
            canonical: `/user/nang-cap-rox`
        }
    }
}

const UpgradeRoxPage = async () => {
    return (
        <UserUpgradeRoxPageContent/>
    )
}

export default UpgradeRoxPage