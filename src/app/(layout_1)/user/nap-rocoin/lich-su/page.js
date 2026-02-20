import {getMetadata} from "@/utils/metadata";
import UserDepositHistoryPageContent from "@/components/user/deposit/HistoryPageContent";

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
            canonical: `/user/nap-rocoin/lich-su`
        }
    }
}

const DepositHistoryPage = async () => {
    return (
        <UserDepositHistoryPageContent/>
    )
}

export default DepositHistoryPage