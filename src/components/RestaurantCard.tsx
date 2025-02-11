interface Restaurant {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  isFavorite: boolean;
  toggleFavorite: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, isFavorite, toggleFavorite }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      <h2 className="text-lg font-bold">{restaurant.name}</h2>
      <p className="text-gray-600">{restaurant.vicinity}</p>
      <p className="text-yellow-500">⭐ {restaurant.rating ?? "N/A"}</p>
      <button
        onClick={toggleFavorite}
        className={`mt-2 p-2 rounded-md w-full ${
          isFavorite ? "bg-red-500 text-white" : "bg-blue-500 text-white"
        } hover:opacity-80`}
      >
        {isFavorite ? "💔 お気に入り解除" : "⭐ お気に入り追加"}
      </button>
    </div>
  );
};

export default RestaurantCard;
