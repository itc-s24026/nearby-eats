import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: "API Key がロードされていません。" });
        }

        // 获取前端传递的位置信息
        const latitude = req.query.latitude ? parseFloat(req.query.latitude as string) : null;
        const longitude = req.query.longitude ? parseFloat(req.query.longitude as string) : null;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: "緯度と経度のパラメーターが必要です。" });
        }

        // 处理搜索关键词
        const keyword = Array.isArray(req.query.keyword) ? req.query.keyword[0] : req.query.keyword;
        const searchKeyword = keyword ? `&keyword=${encodeURIComponent(keyword)}` : "";

        // 构造 API 请求 URL
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant${searchKeyword}&key=${API_KEY}`;

        console.log("Google API Request URL:", url); // 调试用，查看完整 URL

        // 调用 Google Places API
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "OK") {
            console.error("Google API Response Error:", data);
            return res.status(500).json({ error: "Google API からのレスポンスエラー", details: data });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("サーバーエラー:", error);
        return res.status(500).json({ error: "サーバーエラー", details: error instanceof Error ? error.message : error });
    }
}
