import MovieFilter from "@/components/movie/Filter";
import CountryApi from "@/api/country.api";
import {getMetadata} from "@/utils/metadata";
import {notFound, redirect} from "next/navigation";
import {countryUrl} from "@/utils/url";
import H1Tags from "@/components/layout/H1Tags";
import BannerCenter from "@/components/ads/BannerCenter";

const pageMetadata = async (data) => {
    return await getMetadata({page: "category", data})
}

export async function generateMetadata({params}) {
    const {id, slug} = await params
    const country = await CountryApi.detail(id)

    if (country) {
        if (slug !== country.slug) {
            return redirect(countryUrl(country))
        }
        const {title, description, metadataBase, openGraph} = await pageMetadata({category_name: country.name})
        return {
            title,
            description,
            metadataBase,
            openGraph: {
                ...openGraph
            },
            alternates: {
                canonical: countryUrl(country)
            }
        }
    } else {
        return notFound()
    }
}

const CountryPage = async ({params}) => {
    const {id} = await params
    const country = await CountryApi.detail(id)

    if (country) {
        const {h1} = await pageMetadata({category_name: country.name})

        return (
            <div id="wrapper">
                <H1Tags text={h1}/>
                <div className="fluid-gap">
                    <BannerCenter page="movie_list" position="center_1"/>
                    <div className="cards-row wide">
                        <div className="row-header">
                            <h3 className="category-name">Phim {country.name}</h3>
                        </div>
                        <MovieFilter initFilter={{countries: country.code, exclude_status: ["Upcoming"]}}/>
                    </div>
                    <BannerCenter page="movie_list" position="center_2"/>
                </div>
            </div>
        )
    }
}

export default CountryPage