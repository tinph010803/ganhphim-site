"use client";
(function () {
    if (typeof window !== "undefined") {
        const allowed = ['localhost', 'rophim.me', 'rophim.mx', 'rophim.li', 'rophim.moi', 'rophim.nl']
        const host = window?.location?.hostname || ''

        const isAllowed =
            allowed.includes(host) ||
            allowed.some((d) => host.includes(d))

        if (!isAllowed) {
            window.stop?.()
            window.location.href = 'https://rophim.com'
        }
    }
})()