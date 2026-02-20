import MovieFilter from "@/components/movie/Filter";
import {getMetadata} from "@/utils/metadata";
import {Suspense} from "react";
import H1Tags from "@/components/layout/H1Tags";

const pageMetadata = async () => {
    return await getMetadata({page: "filter"})
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
            canonical: "/duyet-tim"
        },
        robots: {
            index: false,
            follow: true
        }
    }
}

const FilterPage = async ({params}) => {
    const {h1} = pageMetadata()

    return (
        <Suspense>
            <div id="wrapper">
                <H1Tags text={h1}/>
                <div className="fluid-gap">
                    <div className="cards-row wide">
                        <div className="row-header">
                            <div className="inc-icon text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"
                                     fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M8.66333 23.3334H13.0033C15.0267 23.3334 16.6667 24.9734 16.6667 26.9967V31.3367C16.6667 33.36 15.0267 35 13.0033 35H8.66333C6.64 35 5 33.36 5 31.3367V26.9967C5 24.9734 6.64 23.3334 8.66333 23.3334Z"
                                          stroke="#FFFFFF" strokeWidth="2px" strokeLinecap="round"
                                          strokeLinejoin="round"
                                          fill="none"></path>
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M26.9966 23.3334H31.3366C33.3599 23.3334 34.9999 24.9734 34.9999 26.9967V31.3367C34.9999 33.36 33.3599 35 31.3366 35H26.9966C24.9733 35 23.3333 33.36 23.3333 31.3367V26.9967C23.3333 24.9734 24.9733 23.3334 26.9966 23.3334Z"
                                          stroke="#FFFFFF" strokeWidth="2px" strokeLinecap="round"
                                          strokeLinejoin="round"
                                          fill="none"></path>
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M8.66333 5H13.0033C15.0267 5 16.6667 6.64 16.6667 8.66333V13.0033C16.6667 15.0267 15.0267 16.6667 13.0033 16.6667H8.66333C6.64 16.6667 5 15.0267 5 13.0033V8.66333C5 6.64 6.64 5 8.66333 5Z"
                                          stroke="#FFFFFF" strokeWidth="2px" strokeLinecap="round"
                                          strokeLinejoin="round"
                                          fill="none"></path>
                                    <path
                                        d="M32.1887 13.8554C30.1637 15.8804 26.8787 15.8804 24.852 13.8554C22.827 11.8287 22.827 8.54542 24.852 6.51875C26.8787 4.49375 30.1637 4.49375 32.1887 6.51875C34.2153 8.54542 34.2153 11.8287 32.1887 13.8554ZM32.1887 13.8554L35 16.6658"
                                        stroke="#FFFFFF" strokeWidth="2px" strokeLinecap="round" strokeLinejoin="round"
                                        fill="none"></path>
                                </svg>
                            </div>
                            <h3 className="category-name">Duyệt tìm</h3>
                        </div>
                        <MovieFilter initShowFilter={true} initFilter={{exclude_status: ["Upcoming"]}}/>
                    </div>
                </div>
            </div>
        </Suspense>
    )
}

export default FilterPage