import axios from "axios";

export async function GET(request) {
    let result = {status: false}

    try {
        const {data} = await axios.get(`${process.env.API_RP_PREFIX}/v1/movie/topViews?range=week`);
        result = data
    } catch (error) {
        console.log(error)
    }

    return Response.json(result)
}