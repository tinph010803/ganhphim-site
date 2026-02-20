import W2gPageRoomsManage from "@/components/w2g/page/RoomsManage";

export async function generateMetadata({params}) {
    return {
        title: `Phòng xem chung của tôi`,
    }
}

const W2gManagePage = async ({params}) => {
    return <W2gPageRoomsManage/>
}

export default W2gManagePage