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