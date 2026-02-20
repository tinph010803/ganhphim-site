import {getMetadata} from "@/utils/metadata";
import LoginTV from "@/components/auth/LoginTV";

const pageMetadata = async () => {
  return await getMetadata({page: "loginTV"})
}

export async function generateMetadata({params}) {
  const {title, description, metadataBase, openGraph} = await pageMetadata()
  return {
    title,
    description,
    metadataBase,
    openGraph: {
      ...openGraph
    }
  }
}

const LoginTvPage = async () => {
  const {h1} = await pageMetadata()

  return (
    <div id="wrapper">
      <h1 style={{display: "none"}}>{h1}</h1>
      <LoginTV/>
    </div>
  )
}

export default LoginTvPage