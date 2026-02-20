import {getMetadata} from "@/utils/metadata";
import UserDepositPageContent from "@/components/user/deposit/PageContent";

const pageMetadata = async () => {
    return await getMetadata({page: "deposit"})
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
            canonical: `/user/nap-rocoin`
        }
    }
}

const DepositPage = async () => {
    return (
        <div id="wrapper" className="premium-wrap wallet-wrap">
            <UserDepositPageContent/>
        </div>
    )
}

export default DepositPage