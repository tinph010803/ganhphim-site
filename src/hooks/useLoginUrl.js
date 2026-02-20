"use client";

import {usePathname} from "next/navigation";
import {idpLoginUrl} from "@/utils/url";

export function useLoginUrl() {
    const pathname = usePathname();

    return `${idpLoginUrl}?client_id=rp&state=${btoa(pathname)}`
}
