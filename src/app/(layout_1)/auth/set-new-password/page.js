import {getMetadata} from "@/utils/metadata";
import SetNewPassword from "@/components/auth/SetNewPassword";

const pageMetadata = async () => {
  return await getMetadata({page: "setNewPassword"})
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

const SetNewPasswordPage = async () => {
  const {h1} = await pageMetadata()

  return (
    <div id="wrapper">
      <h1 style={{display: "none"}}>{h1}</h1>
      <SetNewPassword/>
    </div>
  )
}

export default SetNewPasswordPage