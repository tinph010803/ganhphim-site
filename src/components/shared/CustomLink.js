"use client"

import Link from "next/link"

const CustomLink = ({children, prefetch = false, ...props}) => {
    return (
        <Link prefetch={prefetch} {...props}>
            {children}
        </Link>
    )
}

export default CustomLink
