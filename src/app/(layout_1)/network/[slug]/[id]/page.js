import MovieFilter from "@/components/movie/Filter";
import NetworkApi from "@/api/network.api";
import {getMetadata} from "@/utils/metadata";
import {notFound, redirect} from "next/navigation";
import {networkUrl} from "@/utils/url";
import H1Tags from "@/components/layout/H1Tags";
import BannerCenter from "@/components/ads/BannerCenter";

const pageMetadata = async (data) => {
  return await getMetadata({page: "category", data})
}

export async function generateMetadata({params}) {
  const {slug, id} = await params
  const {result: network} = await NetworkApi.detail(id)

  if (network) {
    if (slug !== network.slug) {
      return redirect(networkUrl(network))
    }
    const {title, description, metadataBase, openGraph} = await pageMetadata({category_name: network.name})
    return {
      title,
      description,
      metadataBase,
      openGraph: {
        ...openGraph
      },
      alternates: {
        canonical: networkUrl(network)
      }
    }
  } else {
    return notFound()
  }
}

const NetworkPage = async ({params}) => {
  const {id} = await params
  const {result: network} = await NetworkApi.detail(id)

  if (network){
    const {h1} = await pageMetadata({category_name: network.name})

    return (
        <div id="wrapper">
          <H1Tags text={h1}/>
          <div className="fluid-gap">
            <BannerCenter page="movie_list" position="center_1"/>
            <div className="cards-row wide">
              <div className="row-header">
                <h3 className="category-name">{network.name}</h3>
              </div>
              <MovieFilter initFilter={{networks: network._id}} allowFilter={false}/>
            </div>
          </div>
        </div>
    )
  }
}

export default NetworkPage