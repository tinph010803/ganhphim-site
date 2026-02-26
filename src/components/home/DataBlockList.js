"use client";

import {memo, useCallback, useEffect, useRef} from "react";
import CollectionStyle1 from "@/components/collection/Style1";
import CollectionStyle2 from "@/components/collection/Style2";
import CollectionStyle3 from "@/components/collection/Style3";
import CollectionStyle4 from "@/components/collection/Style4";
import CollectionStyle5 from "@/components/collection/Style5";
import HomeTopics from "@/components/home/Topics";
import CollectionStyle6 from "@/components/collection/Style6";
import LoadingElement from "@/components/loading/Element";
import HomeContinueWatching from "@/components/home/ContinueWatching";
import HomeCommunity from "@/components/home/Community";
import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {fetchCollections} from "@/redux/features/collectionSlice";
import CollectionStyleEvent304 from "@/components/collection/StyleEvent304";
import HomeW2g from "@/components/home/W2g";
import AdsBannerCenter from "@/components/ads/BannerCenter";
import RobongWidget from "@/components/home/RobongWidget";
import HomeHotSeries from "@/components/home/HotSeries";
import HomeTop10Singles from "@/components/home/Top10Singles";
import HomeCinema from "@/components/home/Cinema";
import HomeAnime from "@/components/home/Anime";
import HomeHongKong from "@/components/home/HongKong";
import HomeHorror from "@/components/home/Horror";
import HomeCountryRows from "@/components/home/CountryRows";
import LazySection from "@/components/shared/LazySection";

const DataBlockList = () => {
    const dispatch = useAppDispatch()
    const observerRef = useRef(null);

    const {collections, groupCollections, currentPage, totalPages, isLoading} = useAppSelector(
        (state) => state.collection
    )

    useEffect(() => {
        if (!collections[currentPage]) {
            dispatch(fetchCollections(currentPage));
        }
    }, [collections, currentPage])

    const loadMoreCollections = useCallback(() => {
        if (!isLoading && currentPage < totalPages) {
            dispatch(fetchCollections(currentPage + 1));
        }
    }, [isLoading, currentPage, totalPages]);

    const handleObserver = useCallback(
        (entries) => {
            const target = entries[0];
            if (target.isIntersecting) {
                loadMoreCollections();
            }
        },
        [loadMoreCollections]
    );

    useEffect(() => {
        if (!observerRef.current) return;

        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "300px",
            threshold: 1.0,
        });

        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [handleObserver]);

    const style7 = [];
    const others = [];
    Object.values(collections).flat().forEach(item => {
        (item.style === 7 ? style7 : others).push(item);
    });

    return (
        <>
            <AdsBannerCenter page="home" position="center_1"/>

            <HomeTopics/>

            {/*<RobongWidget/>*/}

            {style7.map(item => (
                <div key={item._id} className="effect-fade-in">
                    <CollectionStyleEvent304 collection={item}/>
                </div>
            ))}

            <LazySection minHeight={120}>
                <HomeContinueWatching/>
            </LazySection>

            <LazySection minHeight={200}>
                <HomeCountryRows/>
            </LazySection>

            <LazySection minHeight={200}>
                <HomeCommunity/>
            </LazySection>

            <AdsBannerCenter page="home" position="center_2"/>

            {/*<HomeW2g/>*/}

            {others.filter(i => i.style === 1).length > 0 && (
                <LazySection minHeight={200}>
                    <div className="cards-row cards-slide wide effect-fade-in">
                        <div className="topics-list single mt-0">
                            {others.filter(i => i.style === 1).map((item, idx) => (
                                <CollectionStyle1 key={item._id} collection={item} index={idx + 1}/>
                            ))}
                        </div>
                    </div>
                </LazySection>
            )}

            <LazySection minHeight={300}>
                <HomeHotSeries/>
            </LazySection>

            <LazySection minHeight={300}>
                <HomeTop10Singles/>
            </LazySection>

            <LazySection minHeight={300}>
                <HomeCinema/>
            </LazySection>

            <LazySection minHeight={300}>
                <HomeAnime/>
            </LazySection>

            <LazySection minHeight={300}>
                <HomeHongKong/>
            </LazySection>

            <LazySection minHeight={300}>
                <HomeHorror/>
            </LazySection>

            <AdsBannerCenter page="home" position="center_3"/>

            {others.filter(i => i.style !== 1).map((item) => (
                <LazySection key={item._id} minHeight={200}>
                    <div className="effect-fade-in">
                        {item.style === 2 && <CollectionStyle2 collection={item}/>}
                        {item.style === 3 && <CollectionStyle3 collection={item}/>}
                        {item.style === 4 && <CollectionStyle4 collection={item}/>}
                        {item.style === 5 && <CollectionStyle5 collection={item}/>}
                    </div>
                </LazySection>
            ))}

            {currentPage < totalPages && <div ref={observerRef}><LoadingElement/></div>}
        </>
    );
};

export default memo(DataBlockList);
