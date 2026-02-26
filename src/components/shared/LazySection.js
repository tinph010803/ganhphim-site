"use client"

import {useEffect, useRef, useState, memo} from "react"

/**
 * Chỉ render children khi element sắp vào viewport.
 * Dùng để lazy-mount các block nặng trên trang chủ.
 *
 * @param {string}  rootMargin  - Khoảng cách pre-load trước viewport (default 400px)
 * @param {number}  minHeight   - Giữ chỗ tối thiểu để scroll không bị giật (default 80px)
 * @param {node}    placeholder - Nội dung hiển thị khi chưa load (default skeleton nhỏ)
 */
const LazySection = ({children, rootMargin = "400px", minHeight = 80, placeholder = null, className = ""}) => {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            {rootMargin, threshold: 0}
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [rootMargin])

    return (
        <div ref={ref} className={className} style={!visible ? {minHeight} : undefined}>
            {visible
                ? children
                : (placeholder ?? <div style={{minHeight}}/>)
            }
        </div>
    )
}

export default memo(LazySection)
