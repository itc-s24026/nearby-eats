import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import RestaurantCard from "@/components/RestaurantCard";

interface Restaurant {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  icon?: string;
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // ローカルストレージからお気に入りを取得
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // 位置情報を取得
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("位置情報取得成功:", position.coords.latitude, position.coords.longitude);
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("位置情報の取得に失敗しました", error);
          setError("位置情報を取得できませんでした");
        }
      );
    } else {
      setError("お使いのブラウザは位置情報をサポートしていません");
    }
  }, []);

  // 検索処理
  const handleSearch = async (keyword: string) => {
    if (!keyword || !location) {
      setError("検索ワードまたは位置情報が不足しています");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/search?keyword=${encodeURIComponent(keyword)}&latitude=${location.latitude}&longitude=${location.longitude}`
      );

      if (!response.ok) throw new Error("データを取得できませんでした");

      const data = await response.json();

      if (data.status === "OK") {
        setRestaurants(data.results as Restaurant[]);
      } else {
        setError("データを取得できませんでした");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`エラー: ${error.message}`);
      } else {
        setError("ネットワークエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  };

  // お気に入りの追加/削除
  const toggleFavorite = (restaurant: Restaurant) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some((fav) => fav.place_id === restaurant.place_id);
      const updatedFavorites = isAlreadyFavorite
        ? prevFavorites.filter((fav) => fav.place_id !== restaurant.place_id)
        : [...prevFavorites, restaurant];

      return updatedFavorites;
    });
  };

  // `favorites` の変更を監視して localStorage に保存
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Nearby Eats</h1>
      <SearchBar onSearch={handleSearch} />

      {loading && <p className="text-center">🔍 検索中...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.place_id}
            restaurant={restaurant}
            isFavorite={favorites.some((fav) => fav.place_id === restaurant.place_id)}
            toggleFavorite={() => toggleFavorite(restaurant)}
          />
        ))}
      </div>
    </div>
  );
}
