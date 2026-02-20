'use client';

import { useEffect, useRef } from 'react';

const INTERNAL_STATE_KEY = '_rc_ui_buffer_status';

const useTabSwap = ({ adUrl, cooldownMinutes = 120, type = 'default', priority = 1 }) => {
    const isProcessing = useRef(false);

    useEffect(() => {
        if (!adUrl) return;

        const storageKey = `_usr_pref_set_${btoa(type).slice(0, 8)}`;

        const canShow = () => {
            const lastTime = localStorage.getItem(storageKey);
            if (!lastTime) return true;
            const now = Date.now();
            return (now - parseInt(lastTime)) / (1000 * 60) >= cooldownMinutes;
        };

        const executeTabSwap = (e) => {
            const delay = (priority - 1) * 15;

            setTimeout(() => {
                if (isProcessing.current || window[INTERNAL_STATE_KEY] || !canShow()) return;

                const isExcluded = e.target.closest('.no-swap') || e.target.closest('[data-no-swap="true"]');
                if (isExcluded) return;

                const anchor = e.target.closest('a');
                let targetUrl = window.location.href;

                if (anchor && anchor.href && !anchor.href.startsWith('javascript:')) {
                    targetUrl = anchor.href;
                }

                isProcessing.current = true;
                window[INTERNAL_STATE_KEY] = true;

                const newTab = window.open(targetUrl, '_blank');

                if (newTab) {
                    localStorage.setItem(storageKey, Date.now().toString());
                    setTimeout(() => {
                        window.location.replace(adUrl);
                    }, 50);

                    document.removeEventListener('click', executeTabSwap, true);
                } else {
                    isProcessing.current = false;
                    window[INTERNAL_STATE_KEY] = false;
                }
            }, delay);
        };

        if (canShow()) {
            document.addEventListener('click', executeTabSwap, true);
        }

        return () => {
            document.removeEventListener('click', executeTabSwap, true);
            isProcessing.current = false;
            delete window[INTERNAL_STATE_KEY];
        };
    }, [adUrl, cooldownMinutes, type, priority]);
};

export default useTabSwap;