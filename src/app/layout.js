import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/css/bootstrap-utilities.min.css"
import "react-toastify/dist/ReactToastify.css"
import StoreProvider from "@/redux/StoreProvider"
import AnalyticsGoogle from "@/components/analytics/Google"
import {getMetadata} from "@/utils/metadata"
import RegisterServiceWorker from "@/components/service_worker/RegisterServiceWorker"
import TabSwap from "@/components/layout/TabSwap";

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1
}

export async function generateMetadata() {
    const {title, description, metadataBase, openGraph} = await getMetadata({})
    return {
        title,
        description,
        metadataBase,
        openGraph: {
            ...openGraph
        },
        robots: {
            index: true,
            follow: true,
        },
        icons: {
            icon: `/images/favicon.ico?v=0.1`
        }
    }
}

export default async function RootLayout({children}) {
    return (

        <html lang="vi">
        <head>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
            />
            <meta name="google-site-verification" content="pmXwCko4DP6k40bK4V9hAY7Udo9ANpuiXJaojHYmb8A"/>
            <meta name="revisit-after" content="1 days"/>
            <meta name="BingBOT" content="index,follow"/>
        </head>
        <body suppressHydrationWarning={true}>
        <StoreProvider>
            <TabSwap/>
            {children}
            <AnalyticsGoogle/>
            <RegisterServiceWorker/>
        </StoreProvider>
        </body>
        </html>
    );
}
