"use client";

import useTabSwap from "@/hooks/useTabSwap";
import {useAppSelector} from "@/hooks/redux";
import {useMemo} from "react";

export default function TabSwap() {
    const {configAds} = useAppSelector(s => s.app);

    const popunderConfig = useMemo(() => {
        const popunder = configAds?.popunder;

        if (popunder && Array.isArray(popunder.urls) && popunder.urls.length > 0) {
            const randomIndex = Math.floor(Math.random() * popunder.urls.length);

            return {
                adUrl: popunder.urls[randomIndex],
                cooldownMinutes: parseInt(popunder.cooldown_minutes) || 60
            };
        }
        return null;
    }, [configAds]);

    useTabSwap({
        adUrl: popunderConfig?.adUrl || null,
        cooldownMinutes: popunderConfig?.cooldownMinutes || 60,
        priority: 2
    })

    return null;
}