import { useState, useEffect } from "react";
import RestaurantCard from "@/components/RestaurantCard";

interface Restaurant {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Restaurant[]>([]);

  // ローカルストレージからお気に入りを取得
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // お気に入りの削除処理
  const removeFavorite = (place_id: string) => {
    const updatedFavorites = favorites.filter((fav) => fav.place_id !== place_id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">お気に入りリスト</h1>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-500">お気に入りに追加されたレストランはありません。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {favorites.map((restaurant) => (
            <RestaurantCard
              key={restaurant.place_id}
              restaurant={restaurant}
              isFavorite={true}
              toggleFavorite={() => removeFavorite(restaurant.place_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
