import {getMetadata} from "@/utils/metadata";
import AppDownloadContent from "@/components/app_download/Content";
import H1Tags from "@/components/layout/H1Tags";

export async function generateMetadata() {
  const {title, description, metadataBase, openGraph} = await getMetadata({page: "rophimApp"})
  return {
    title,
    description,
    metadataBase,
    openGraph: {
      ...openGraph
    },
    alternates: {
      canonical: `/app-rophim`
    }
  }
}

export default async function AndroidAppPage() {
  const {h1} = await getMetadata({})

  return (
    <>
      <H1Tags text={h1}/>
      <AppDownloadContent/>
    </>
  )
}
