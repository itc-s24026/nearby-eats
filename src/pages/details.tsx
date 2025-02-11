import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Restaurant {
  place_id: string;
  name: string;
  rating?: number;
  vicinity?: string;
  formatted_phone_number?: string;
  opening_hours?: { weekday_text: string[] };
}

export default function Details() {
  const router = useRouter();
  const { place_id } = router.query;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!place_id) return;

    const fetchDetails = async () => {
      try {
        const response = await fetch(`/api/details?place_id=${place_id}`);
        const data = await response.json();
        if (data.status === "OK") {
          setRestaurant(data.result);
        } else {
          setError("データを取得できませんでした");
        }
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError("ネットワークエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [place_id]);

  useEffect(() => {
    if (!restaurant) return;
    const favorites: Restaurant[] = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((fav) => fav.place_id === restaurant.place_id));
  }, [restaurant]);

  const toggleFavorite = () => {
    if (!restaurant) return;
    let favorites: Restaurant[] = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFavorite) {
      favorites = favorites.filter((fav) => fav.place_id !== restaurant.place_id);
    } else {
      favorites.push(restaurant);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  if (loading) return <p className="text-center">📡 読み込み中...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">{restaurant?.name}</h1>
      <div className="bg-white shadow-md p-4 rounded-md max-w-md mx-auto">
        <p className="text-gray-600">📍 {restaurant?.vicinity || "住所不明"}</p>
        <p className="text-yellow-500">⭐ {restaurant?.rating || "N/A"}</p>
        {restaurant?.formatted_phone_number && (
          <p className="text-gray-700">📞 {restaurant.formatted_phone_number}</p>
        )}
        {restaurant?.opening_hours?.weekday_text && (
          <div>
            <p className="font-semibold">営業時間:</p>
            <ul className="list-disc pl-5">
              {restaurant.opening_hours.weekday_text.map((time, index) => (
                <li key={index} className="text-gray-600">{time}</li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={toggleFavorite}
          className={`mt-4 p-2 rounded-md w-full ${
            isFavorite ? "bg-gray-500 text-white" : "bg-blue-500 text-white"
          } hover:bg-opacity-80`}
        >
          {isFavorite ? "✅ お気に入り済み" : "⭐ お気に入りに追加"}
        </button>
      </div>
    </div>
  );
}
