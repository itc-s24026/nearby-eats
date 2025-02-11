import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

        
        console.log("Google Maps API Key:", API_KEY);

        if (!API_KEY) {
            return res.status(500).json({ error: "API Key がロードされていません。" });
        }

       
        const keyword = Array.isArray(req.query.keyword) ? req.query.keyword[0] : req.query.keyword;
        const searchKeyword = keyword ? `&keyword=${encodeURIComponent(keyword)}` : "";

        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=35.6895,139.6917&radius=1500&type=restaurant${searchKeyword}&key=${API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "OK") {
            return res.status(500).json({ error: "Google API からのレスポンスエラー", details: data });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("サーバーエラー:", error);
        return res.status(500).json({ error: "サーバーエラー", details: error });
    }
}
