import axios from "axios";

export async function GET() {
    const baseUrl = process.env.API_SERVER_PREFIX || "(chưa có biến môi trường)"
    let result = { baseUrl, status: false, data: null, error: null }

    try {
        const { data } = await axios.get(`${baseUrl}/v1/phim/nu-hoang-nuoc-mat`, {
            timeout: 8000,
            headers: {
                "X-Internal-Token": process.env.INTERNAL_API_SECRET || "",
            }
        })
        result.status = true
        result.data = data
    } catch (error) {
        result.error = {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            responseData: error.response?.data,
        }
    }

    return Response.json(result)
}
