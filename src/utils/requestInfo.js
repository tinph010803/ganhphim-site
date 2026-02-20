import {headers} from 'next/headers'

export const getRequestInfo = async () => {
    const headersList = await headers()
    const host = headersList.get('host') || ''
    const protocol = headersList.get('x-forwarded-proto') || 'https'
    const baseUrl = `${protocol}://${host}`

    return {host, protocol, baseUrl}
}
