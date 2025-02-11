import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import RestaurantCard from "@/components/RestaurantCard";

export default function Home() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ローカルストレージからお気に入りを取得
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // 検索処理
  const handleSearch = async (keyword: string) => {
    if (!keyword) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/search?keyword=${keyword}`);
      const data = await response.json();

      if (data.status === "OK") {
        setRestaurants(data.results);
      } else {
        setError("データを取得できませんでした");
      }
    } catch (err) {
      setError("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // お気に入りの追加/削除
  const toggleFavorite = (restaurant: any) => {
    const isAlreadyFavorite = favorites.some((fav) => fav.place_id === restaurant.place_id);

    let updatedFavorites;
    if (isAlreadyFavorite) {
      updatedFavorites = favorites.filter((fav) => fav.place_id !== restaurant.place_id);
    } else {
      updatedFavorites = [...favorites, restaurant];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

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
