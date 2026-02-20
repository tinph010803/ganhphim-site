"use client"

import {forwardRef, memo, useEffect, useRef, useState} from "react";
import {Dropdown} from "react-bootstrap";
import {usePathname} from "next/navigation";

const CustomToggle = forwardRef(({children, onClick}, ref) => (
    <div className="line-center" ref={ref} onClick={(e) => {
        e.preventDefault();
        onClick(e);
    }}>
        <i className="fa-solid fa-link"></i>
        <span>Chia sẻ</span>
    </div>
));

const W2gButtonShare = ({}) => {
    const pathname = usePathname()
    const inputRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState("");

    useEffect(() => {
        setShareUrl(window.location.href)
    }, [pathname]);

    const handleCopy = async () => {
        try {
            if (inputRef.current) {
                await navigator.clipboard.writeText(inputRef.current.value);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // Reset trạng thái sau 2 giây
            }
        } catch (err) {
            console.error('Lỗi khi sao chép:', err);
        }
    };

    return (
        <Dropdown className="live-share">
            <Dropdown.Toggle as={CustomToggle}/>
            <Dropdown.Menu as="ul" className="v-dropdown-menu">
                <div className="quick-share">
                    <small>Liên kết gửi bạn bè</small>
                    <input
                        className="form-control quick-share-link"
                        type="text"
                        readOnly={true}
                        value={shareUrl}
                        ref={inputRef}
                    />
                    <button
                        type="button"
                        className="btn btn-sm btn-dark btn-block"
                        onClick={handleCopy}
                    >
                        {copied ? 'Đã sao chép!' : 'Sao chép'}
                    </button>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default memo(W2gButtonShare);