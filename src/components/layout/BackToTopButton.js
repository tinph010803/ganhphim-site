"use client";

import {useEffect, useState} from "react";

const BackToTopButton = () => {
    const [style, setStyle] = useState({bottom: "1rem"});

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 200) {
                setStyle(prevState => ({...prevState, bottom: "1rem"}))
            } else {
                setStyle(prevState => ({...prevState, bottom: "-4rem"}))
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button id="totop" title="Lên đầu trang" className="effect-fade-in" style={style}
                onClick={scrollToTop}>
            <i className="fa-solid fa-arrow-up"></i>
        </button>
    );
};

export default BackToTopButton;