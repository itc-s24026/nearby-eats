import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { place_id } = req.query;

  if (!place_id) {
    return res.status(400).json({ error: "place_id が必要です。" });
  }

  try {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${API_KEY}&language=ja`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      return res.status(500).json({ error: "Google API からのレスポンスエラー", details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "サーバーエラー", details: error });
  }
}
