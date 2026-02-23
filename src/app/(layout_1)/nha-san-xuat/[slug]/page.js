import MovieFilter from "@/components/movie/Filter";
import ProductionApi from "@/api/production.api";
import {getMetadata} from "@/utils/metadata";
import {notFound, redirect} from "next/navigation";
import {productionCompanyUrl} from "@/utils/url";
import H1Tags from "@/components/layout/H1Tags";
import BannerCenter from "@/components/ads/BannerCenter";

const pageMetadata = async (data) => {
    return await getMetadata({page: "category", data})
}

export async function generateMetadata({params}) {
    const {slug} = await params
    const {result: production} = await ProductionApi.detail(slug)

    if (production) {
        if (slug !== production.slug) {
            return redirect(productionCompanyUrl(production))
        }
        const {title, description, metadataBase, openGraph} = await pageMetadata({category_name: production.name})
        return {
            title,
            description,
            metadataBase,
            openGraph: {
                ...openGraph
            },
            alternates: {
                canonical: productionCompanyUrl(production)
            }
        }
    } else {
        return notFound()
    }
}

const ProductionPage = async ({params}) => {
    const {slug} = await params
    const {result: production} = await ProductionApi.detail(slug)

    if (production) {
        const {h1} = await pageMetadata({category_name: production.name})
        return (
            <div id="wrapper">
                <H1Tags text={h1}/>
                <div className="fluid-gap">
                    <BannerCenter page="movie_list" position="center_1"/>
                    <div className="cards-row wide">
                        <div className="row-header">
                            <h3 className="category-name">{production.name}</h3>
                        </div>
                        <MovieFilter initFilter={{productions: production._id}} allowFilter={false}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProductionPage
