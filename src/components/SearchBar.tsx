import { useState } from "react";

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center gap-2">
      <input
        type="text"
        placeholder="🍣 店を検索..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="p-2 border rounded-md w-64"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        検索
      </button>
    </form>
  );
}
