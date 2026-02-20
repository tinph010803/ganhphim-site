import {useRef, useEffect} from "react";

export default function useOnceWhen(condition, callback) {
    const hasRunRef = useRef(false);

    useEffect(() => {
        if (condition && !hasRunRef.current) {
            hasRunRef.current = true;
            callback();
        }
    }, [condition, callback]);
}
