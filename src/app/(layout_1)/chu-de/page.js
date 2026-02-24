import CollectionApi from "@/api/collection.api";
import Link from "next/link";
import {collectionUrl} from "@/utils/url";

export async function generateMetadata({params}) {
    return {
        title: `Chủ đề`
    }
}

const CollectionPage = async () => {
    const {result} = await CollectionApi.allTopics()
    const topics = Array.isArray(result) ? result : (result?.items || [])

    return (
        <div id="wrapper" className="makeup">
            <div className="fluid-gap">
                <div className="cards-row wide">
                    <div className="row-header">
                        <h3 className="category-name me-3">Các chủ đề</h3>
                    </div>
                    <div className="row-content">
                        <div className="tc-grid">
                            {topics.map((topic) => {
                                const c = topic.color || '#1d2e79'
                                const thumb = topic.thumbnail || topic.thumb || null
                                return (
                                    <Link href={collectionUrl(topic)} key={`t-${topic._id}`} className="tc-card">
                                        {/* Colour overlay */}
                                        <div className="tc-overlay" style={{backgroundColor: c}} />
                                        {/* Glow circle */}
                                        <div className="tc-glow" style={{backgroundColor: c}} />
                                        {/* Thumbnail */}
                                        {thumb && (
                                            <div className="tc-thumb">
                                                <img src={thumb} alt={topic.name} className="tc-thumb__img" />
                                            </div>
                                        )}
                                        {/* Text layer */}
                                        <div className="tc-body">
                                            <div className="tc-icon" style={{color: c}}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
                                                    <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
                                                </svg>
                                            </div>
                                            <h3 className="tc-title">{topic.name}</h3>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CollectionPage